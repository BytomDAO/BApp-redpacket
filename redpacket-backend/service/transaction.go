package service

import (
	"fmt"

	"github.com/bytom/bytom/errors"

	"github.com/redpacket/redpacket-backend/util/types"
)

// BuildTransactionReq is the build transaction request
type BuildTransactionReq struct {
	*types.BuildTxRequestGeneralV3
	Address string `json:"address"`
}

// BuildTransactionResp is response for build transaction
type BuildTransactionResp struct {
	*types.Tx           `json:"tx"`
	RawTransaction      interface{}                 `json:"raw_transaction"`
	SigningInstructions []*types.SigningInstruction `json:"signing_instructions"`
}

func (s *Service) BuildTransaction(req *BuildTransactionReq) ([]*BuildTransactionResp, error) {
	urlPath := fmt.Sprintf("/%s/v3/merchant/build-advanced-tx?address=%s", s.netType, req.Address)
	resp := []*BuildTransactionResp{}
	return resp, errors.Wrapf(s.request(urlPath, req.BuildTxRequestGeneralV3, &resp), "build transaction, url path: %s", urlPath)
}

type SubmitTransactionReq struct {
	*types.SubmitPaymentReqV3
	Address string `json:"address"`
}

type SubmitTransactionResp struct {
	TxHash string `json:"tx_hash"`
}

func (s *Service) SubmitTransaction(req *SubmitTransactionReq) (*SubmitTransactionResp, error) {
	urlPath := fmt.Sprintf("/%s/v3/merchant/submit-payment?address=%s", s.netType, req.Address)
	resp := new(SubmitTransactionResp)
	return resp, errors.Wrapf(s.request(urlPath, req.SubmitPaymentReqV3, resp), "submit transaction, url path: %s", urlPath)
}

type GetTransactionReq struct {
	TxID string `json:"tx_id"`
}

func (s *Service) GetTransaction(req *GetTransactionReq) (*types.Tx, error) {
	urlPath := fmt.Sprintf("/%s/v3/merchant/transaction?tx_hash=%s", s.netType, req.TxID)
	resp := new(types.Tx)
	return resp, errors.Wrapf(s.request(urlPath, nil, resp), "get transaction, url path: %s", urlPath)
}
