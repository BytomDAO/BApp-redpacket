package api

import (
	"strconv"

	"github.com/bytom/bytom/errors"
	"github.com/gin-gonic/gin"

	"github.com/redpacket/redpacket-backend/database/orm"
	"github.com/redpacket/redpacket-backend/util/types"
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
	RedPacketType     int    `json:"red_packet_type"`
	Note              string `json:"note"`
	winner
}

type RedPacketDetail struct {
	senderDetail
	Winners []*winner `json:"winners"`
}

func convertToWinner(receivers []*orm.Receiver) (winners []*winner) {
	for _, receicer := range receivers {
		winners = append(winners, &winner{
			Address:       receicer.Address,
			Amount:        receicer.Amount,
			TxID:          receicer.TxID,
			IsConfirmed:   receicer.IsConfirmed,
			ConfirmedTime: receicer.UpdatedAt,
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
	query := s.db.Master().Preload("Receivers").Where(&orm.Sender{Address: req.Address})
	if err := query.Find(&senders).Error; err != nil {
		return nil, errors.Wrap(err, "query sender")
	}

	var totalAmount float64
	senderDetails := []*senderDetail{}
	for _, sender := range senders {
		openedReceivers := []*orm.Receiver{}
		for _, receiver := range sender.Receivers {
			if receiver.IsSpend {
				openedReceivers = append(openedReceivers, receiver)
			}
		}

		senderAmount, err := strconv.ParseFloat(sender.Amount, 64)
		if err != nil {
			return nil, errors.Wrap(err, "parse sender amount to float64")
		}

		totalAmount += senderAmount
		senderDetails = append(senderDetails, &senderDetail{
			SenderAddress:     sender.Address,
			SenderAddressName: sender.AddressName,
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
		TotalAmount:   strconv.FormatFloat(totalAmount, 'f', -1, 64),
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
	query := s.db.Master().Preload("Sender").Where(&orm.Receiver{Address: req.Address})
	if err := query.Find(&receivers).Error; err != nil {
		return nil, errors.Wrap(err, "query receiver")
	}

	winners := convertToWinner(receivers)
	var totalAmount float64
	receiverDetails := []*receiverDetail{}
	for i, receiver := range receivers {
		receiverAmount, err := strconv.ParseFloat(receiver.Amount, 64)
		if err != nil {
			return nil, errors.Wrap(err, "parse sender amount to float64")
		}

		totalAmount += receiverAmount
		receiverDetails = append(receiverDetails, &receiverDetail{
			SenderAddress:     receiver.Sender.Address,
			SenderAddressName: receiver.Sender.AddressName,
			RedPacketType:     receiver.Sender.RedPacketType,
			Note:              receiver.Sender.Note,
			winner:            *winners[i],
		})
	}

	return &ListReceiverRedPacketsResp{
		TotalAmount:     strconv.FormatFloat(totalAmount, 'f', -1, 64),
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
