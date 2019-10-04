package api

import (
	"encoding/hex"
	"encoding/json"

	"github.com/bytom/errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/redpacket/redpacket-backend/database/orm"
	"github.com/redpacket/redpacket-backend/service"
	"github.com/redpacket/redpacket-backend/util"
)

// status of opening red packet
const (
	// success opened red packet
	successOpened int = iota
	// all redpackets has been completely opened
	allOpened
	// the address has opened the redpacket
	addressOpened
	// mismatch password
	mismatchPassword
	// not found the redpacket
	notFound
)

var statusMsg = map[int]string{
	successOpened:    "success opened red packet",
	allOpened:        "all redpackets has been completely opened",
	addressOpened:    "the address has opened the redpacket",
	mismatchPassword: "mismatch password",
	notFound:         "not found the redpacket",
}

type OpenRedPacketReq struct {
	RedPacketID string `json:"red_packet_id"`
	Password    string `json:"password"`
	Address     string `json:"address"`
}

type RedPacketStatus struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func (s *Server) OpenRedPacket(c *gin.Context, req *OpenRedPacketReq) (*RedPacketStatus, error) {
	if req.Address == "" {
		return nil, errors.New("open redpacket address is empty, please enter correct address")
	}

	sender := &orm.Sender{}
	query := s.db.Master().Preload("Receivers").Where(&orm.Sender{RedPacketID: req.RedPacketID})
	if err := query.First(sender).Error; err != nil {
		return nil, errors.Wrap(err, "query sender")
	}

	// check whether the redpacket is empty or not
	if len(sender.Receivers) == 0 {
		return &RedPacketStatus{
			Status:  notFound,
			Message: statusMsg[notFound],
		}, nil
	}

	// check password
	if sender.Password != req.Password {
		return &RedPacketStatus{
			Status:  mismatchPassword,
			Message: statusMsg[mismatchPassword],
		}, nil
	}

	// open redpacket
	var openReceiver *orm.Receiver
	for _, recv := range sender.Receivers {
		// check have opened redpacket address
		if recv.Address == req.Address {
			return &RedPacketStatus{
				Status:  addressOpened,
				Message: statusMsg[addressOpened],
			}, nil
		}

		if recv.IsSpend {
			continue
		}

		// open redpacket, SetNX for redis lock
		if result := s.cache.SetNX(recv.UtxoID, req.Address, 0); !result {
			continue
		}

		openReceiver = recv
		break
	}

	// check the redpackets status
	if openReceiver == nil {
		return &RedPacketStatus{
			Status:  allOpened,
			Message: statusMsg[allOpened],
		}, nil
	}

	// send transaction
	txID, err := s.OpenRedPacketTransaction(openReceiver.Amount, openReceiver.UtxoID, req.Address, sender)
	if err != nil {
		s.cache.Del(openReceiver.UtxoID)
		return nil, errors.Wrap(err, "send open red packet transaction")
	}

	// update transactionID, address and utxo status
	openReceiver.TxID = txID
	openReceiver.Address = req.Address
	openReceiver.IsSpend = true
	if err := s.db.Master().Model(&orm.Receiver{}).Where(&orm.Receiver{UtxoID: openReceiver.UtxoID}).Updates(openReceiver).Error; err != nil {
		s.cache.Del(openReceiver.UtxoID)
		return nil, errors.Wrap(err, "update receicer utxo to spent")
	}

	return &RedPacketStatus{
		Status:  successOpened,
		Message: statusMsg[successOpened],
	}, nil
}

func (s *Server) OpenRedPacketTransaction(amount uint64, utxoID, address string, sender *orm.Sender) (string, error) {
	rawTx, err := s.BuildRedPacketTransaction(amount, utxoID, address)
	if err != nil {
		return "", err
	}

	txID, err := s.SubmitRedPacketTransaction(string(rawTx), sender)
	if err != nil {
		return "", err
	}
	return *txID, nil
}

func (s *Server) BuildRedPacketTransaction(amount uint64, utxoID, address string) ([]byte, error) {
	buildReq := &service.BuildTransactionReq{
		Guid:          s.GetCommonGuid(),
		Fee:           util.TransactionFee,
		Confirmations: uint64(1),
		Inputs: []map[string]interface{}{
			map[string]interface{}{"type": "spend_utxo", "output_id": utxoID},
		},
		Outputs: []map[string]interface{}{
			map[string]interface{}{"type": "control_address", "asset": util.BTMAssetID, "address": address, "amount": amount},
		},
	}
	buildResp, err := s.service.BuildTransaction(buildReq)
	if err != nil {
		return nil, err
	}

	rawTx, err := json.Marshal(buildResp.RawTransaction)
	if err != nil {
		return nil, err
	}
	return rawTx[1 : len(rawTx)-1], nil
}

func (s *Server) SubmitRedPacketTransaction(rawTx string, sender *orm.Sender) (*string, error) {
	redPacketID, err := uuid.Parse(sender.RedPacketID)
	if err != nil {
		return nil, err
	}

	assemblePassword := util.AssemblePassword(sender.Password, redPacketID)
	submitReq := &service.SubmitTransactionReq{
		Guid:  s.GetCommonGuid(),
		RawTx: rawTx,
		Sigs: [][]string{
			[]string{hex.EncodeToString(assemblePassword), sender.WitnessProgram},
		},
	}
	submitResp, err := s.service.SubmitTransaction(submitReq)
	if err != nil {
		return nil, err
	}
	return &submitResp.TxHash, nil
}