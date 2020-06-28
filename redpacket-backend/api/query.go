package api

import (
	"math/big"

	"github.com/bytom/bytom/errors"
	"github.com/gin-gonic/gin"

	"github.com/redpacket/redpacket-backend/database/orm"
	"github.com/redpacket/redpacket-backend/util/types"
)

var (
	errParseAmount = errors.New("parse sender amount to big float")
)

type winner struct {
	Address       string          `json:"address"`
	Amount        string          `json:"amount"`
	TxID          string          `json:"tx_id"`
	IsConfirmed   bool            `json:"is_confirmed"`
	ConfirmedTime types.Timestamp `json:"confirmed_time"`
}

type senderDetail struct {
	SenderAddress     string          `json:"sender_address"`
	SenderAddressName string          `json:"sender_address_name"`
	AssetID           string          `json:"asset_id"`
	RedPacketID       string          `json:"red_packet_id"`
	RedPacketType     int             `json:"red_packet_type"`
	TotalAmount       string          `json:"total_amount"`
	TotalNumber       int64           `json:"total_number"`
	OpenedNumber      int64           `json:"opened_number"`
	Note              string          `json:"note"`
	IsConfirmed       bool            `json:"is_confirmed"`
	SendTime          types.Timestamp `json:"send_time"`
}

type receiverDetail struct {
	SenderAddress     string `json:"sender_address"`
	SenderAddressName string `json:"sender_address_name"`
	AssetID           string `json:"asset_id"`
	RedPacketType     int    `json:"red_packet_type"`
	Note              string `json:"note"`
	winner
}

type RedPacketDetail struct {
	senderDetail
	Winners []*winner `json:"winners"`
}

func convertToWinner(receivers []*orm.Receiver) (winners []*winner) {
	for _, receiver := range receivers {
		winners = append(winners, &winner{
			Address:       receiver.Address,
			Amount:        receiver.Amount,
			TxID:          receiver.TxID,
			IsConfirmed:   receiver.IsConfirmed,
			ConfirmedTime: receiver.UpdatedAt,
		})
	}
	return
}

type GetRedPacketReq struct {
	RedPacketID string `json:"red_packet_id"`
}

func (s *Server) GetRedPacketDetails(c *gin.Context, req *GetRedPacketReq) (*RedPacketDetail, error) {
	sender := &orm.Sender{}
	query := s.db.Master().Preload("Receivers").Where(&orm.Sender{RedPacketID: req.RedPacketID})
	if err := query.First(sender).Error; err != nil {
		return nil, errors.Wrap(err, "query sender")
	}

	openedReceivers := []*orm.Receiver{}
	for _, receiver := range sender.Receivers {
		if receiver.IsSpend {
			openedReceivers = append(openedReceivers, receiver)
		}
	}

	return &RedPacketDetail{
		senderDetail: senderDetail{
			SenderAddress:     sender.Address,
			SenderAddressName: sender.AddressName,
			AssetID:           sender.AssetID,
			RedPacketID:       sender.RedPacketID,
			RedPacketType:     sender.RedPacketType,
			TotalAmount:       sender.Amount,
			TotalNumber:       int64(len(sender.Receivers)),
			OpenedNumber:      int64(len(openedReceivers)),
			Note:              sender.Note,
			IsConfirmed:       sender.IsConfirmed,
			SendTime:          sender.UpdatedAt,
		},
		Winners: convertToWinner(openedReceivers),
	}, nil
}

type ListRedPacketsReq struct {
	Address string `json:"address"`
	AssetID string `json:"asset_id,omitempty"`
}

type ListSenderRedPacketsResp struct {
	TotalAmount   string          `json:"total_amount"`
	TotalNumber   int64           `json:"total_number"`
	SenderDetails []*senderDetail `json:"sender_details"`
}

func (s *Server) ListSenderRedPackets(c *gin.Context, req *ListRedPacketsReq) (*ListSenderRedPacketsResp, error) {
	if req.Address == "" {
		return nil, errors.New("the address is empty")
	}

	var senders []*orm.Sender
	query := s.db.Master().Preload("Receivers").Where(&orm.Sender{Address: req.Address, AssetID: req.AssetID})
	if err := query.Find(&senders).Error; err != nil {
		return nil, errors.Wrap(err, "query sender")
	}

	totalAmount := new(big.Float).SetUint64(0)
	senderDetails := []*senderDetail{}
	for _, sender := range senders {
		openedReceivers := []*orm.Receiver{}
		for _, receiver := range sender.Receivers {
			if receiver.IsSpend {
				openedReceivers = append(openedReceivers, receiver)
			}
		}

		senderAmount, ok := new(big.Float).SetString(sender.Amount)
		if !ok {
			return nil, errors.Wrapf(errParseAmount, "sender amount: %s", sender.Amount)
		}

		totalAmount.Add(totalAmount, senderAmount)
		senderDetails = append(senderDetails, &senderDetail{
			SenderAddress:     sender.Address,
			SenderAddressName: sender.AddressName,
			AssetID:           sender.AssetID,
			RedPacketID:       sender.RedPacketID,
			RedPacketType:     sender.RedPacketType,
			Note:              sender.Note,
			TotalAmount:       sender.Amount,
			TotalNumber:       int64(len(sender.Receivers)),
			OpenedNumber:      int64(len(openedReceivers)),
			IsConfirmed:       sender.IsConfirmed,
			SendTime:          sender.UpdatedAt,
		})
	}

	return &ListSenderRedPacketsResp{
		TotalAmount:   totalAmount.String(),
		TotalNumber:   int64(len(senders)),
		SenderDetails: senderDetails,
	}, nil
}

type ListReceiverRedPacketsResp struct {
	TotalAmount     string            `json:"total_amount"`
	TotalNumber     int64             `json:"total_number"`
	ReceiverDetails []*receiverDetail `json:"receiver_details"`
}

func (s *Server) ListReceiverRedPackets(c *gin.Context, req *ListRedPacketsReq) (*ListReceiverRedPacketsResp, error) {
	if req.Address == "" {
		return nil, errors.New("the address is empty")
	}

	var receivers []*orm.Receiver
	receiversQuery := s.db.Master().Joins("join senders on receivers.id = senders.id").Where(&orm.Sender{AssetID: req.AssetID})
	if err := receiversQuery.Preload("Sender").Where(&orm.Receiver{Address: req.Address}).Find(&receivers).Error; err != nil {
		return nil, errors.Wrap(err, "query receiver")
	}

	winners := convertToWinner(receivers)
	totalAmount := new(big.Float).SetUint64(0)
	receiverDetails := []*receiverDetail{}
	for i, receiver := range receivers {
		receiverAmount, ok := new(big.Float).SetString(receiver.Amount)
		if !ok {
			return nil, errors.Wrapf(errParseAmount, "receiver amount: %s", receiver.Amount)
		}

		totalAmount.Add(totalAmount, receiverAmount)
		receiverDetails = append(receiverDetails, &receiverDetail{
			SenderAddress:     receiver.Sender.Address,
			SenderAddressName: receiver.Sender.AddressName,
			AssetID:           receiver.Sender.AssetID,
			RedPacketType:     receiver.Sender.RedPacketType,
			Note:              receiver.Sender.Note,
			winner:            *winners[i],
		})
	}

	return &ListReceiverRedPacketsResp{
		TotalAmount:     totalAmount.String(),
		TotalNumber:     int64(len(receivers)),
		ReceiverDetails: receiverDetails,
	}, nil
}

type GetRedPacketPwdReq struct {
	RedPacketID   string `json:"red_packet_id"`
	SenderAddress string `json:"sender_address"`
}

type GetRedPacketPwdResp struct {
	Password string `json:"password"`
}

func (s *Server) GetRedPacketPwd(c *gin.Context, req *GetRedPacketPwdReq) (*GetRedPacketPwdResp, error) {
	if req.RedPacketID == "" || req.SenderAddress == "" {
		return nil, errors.New("red_packet_id or sender_address is empty, please check it")
	}

	sender := &orm.Sender{RedPacketID: req.RedPacketID, Address: req.SenderAddress}
	if err := s.db.Master().Where(sender).First(sender).Error; err != nil {
		return nil, errors.Wrap(err, "db query sender")
	}

	return &GetRedPacketPwdResp{Password: sender.Password}, nil
}
