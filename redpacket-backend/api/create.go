package api

import (
	"encoding/hex"
	"fmt"

	"github.com/bytom/bytom/crypto"
	"github.com/bytom/bytom/errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/redpacket/redpacket-backend/database/orm"
	"github.com/redpacket/redpacket-backend/service"
	"github.com/redpacket/redpacket-backend/util"
)

var (
	errFindScriptFail = errors.New("find script fail")
)

type CreateRedPacketReq struct {
	Password string `json:"password"`
}

type CreateRedPacketResp struct {
	Address     string `json:"address"`
	RedPacketID string `json:"red_packet_id"`
}

func (s *Server) CreateRedPacket(c *gin.Context, req *CreateRedPacketReq) (*CreateRedPacketResp, error) {
	if len(req.Password) == 0 || len(req.Password) > 20 {
		return nil, errors.New(fmt.Sprintf("bad length with [%d] is not between 1 and 20", len(req.Password)))
	}

	// generate redpacket guid
	redPacketID := uuid.New()
	assemblePassword := util.AssemblePassword(req.Password, redPacketID)

	// calculate hash and generate witness program
	hash := crypto.Sha256(assemblePassword)
	witnessProgram, err := util.NewRevealPreimageScript(hash)
	if err != nil {
		return nil, errors.Wrapf(err, "new reveal preimage script, hash: %s", hex.EncodeToString(hash))
	}

	// create redpacket contract
	hrp, err := s.GetNetWorkPrefix()
	if err != nil {
		return nil, errors.Wrap(err, "get net work prefix")
	}

	addressProgram, err := util.NewP2SHAddressProgram(witnessProgram, hrp)
	if err != nil {
		return nil, errors.Wrap(err, "new P2SH address program")
	}

	// save contract information into db
	sender := &orm.Sender{
		RedPacketID:     redPacketID.String(),
		Password:        req.Password,
		ContractAddress: addressProgram.Address,
		ContractProgram: hex.EncodeToString(addressProgram.Program),
		WitnessProgram:  hex.EncodeToString(witnessProgram),
	}
	if err := s.db.Master().Create(sender).Error; err != nil {
		return nil, errors.Wrap(err, "save the redpacket of sender")
	}

	return &CreateRedPacketResp{
		Address:     addressProgram.Address,
		RedPacketID: redPacketID.String(),
	}, nil
}

type SubmitRedPacketReq struct {
	RedPacketID   string `json:"red_packet_id"`
	TxID          string `json:"tx_id"`
	Address       string `json:"address"`
	AddressName   string `json:"address_name,omitempty"`
	Amount        string `json:"amount"`
	RedPacketType int    `json:"red_packet_type"`
	Note          string `json:"note"`
}

func (s *Server) SubmitRedPacket(c *gin.Context, req *SubmitRedPacketReq) error {
	assetID, err := s.getAssetID(req.TxID)
	if err != nil {
		return errors.Wrapf(err, "get asset id, tx id: %s", req.TxID)
	}

	if req.Address == "" {
		return errors.New("sender address is empty, please input correct address")
	}

	if req.Amount == "" {
		return errors.New("sender amount is empty, please input correct amount")
	}

	sender := &orm.Sender{RedPacketID: req.RedPacketID}
	if err := s.db.Master().Where(sender).First(sender).Error; err != nil {
		return errors.Wrap(err, "db query the redpacket of sender")
	}

	if sender.TxID != nil {
		return errors.New("the redpacket transaction have submitted, please don't repeat it")
	}

	// update sender information
	sender.Address = req.Address
	sender.AddressName = req.AddressName
	sender.AssetID = assetID
	sender.Amount = req.Amount
	sender.TxID = &req.TxID
	sender.RedPacketType = req.RedPacketType
	sender.Note = req.Note
	db := s.db.Master().Model(sender).Where(&orm.Sender{ID: sender.ID}).Updates(sender)
	if err := db.Error; err != nil {
		return err
	}

	if db.RowsAffected != 1 {
		return errors.New("inconsistent db status, maybe exist the same txid")
	}
	return nil
}

// getAsset get asset id by tx id from blockcenter
func (s *Server) getAssetID(txID string) (string, error) {
	if txID == "" {
		return "", errors.New("txid is empty, submit redpacket must include txid")
	}

	tx, err := s.service.GetTransaction(&service.GetTransactionReq{TxID: txID})
	if err != nil {
		return "", errors.Wrapf(err, "get transaction from blockcenter, tx id: %s", txID)
	}

	var script string
	for _, input := range tx.Inputs {
		if len(input.Script) != 0 {
			script = input.Script
		}
	}

	for _, output := range tx.Outputs {
		if output.Script != script {
			return output.Script, nil
		}
	}

	return "", errFindScriptFail
}
