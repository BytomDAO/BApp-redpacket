package service

import (
	"fmt"

	"github.com/bytom/blockcenter/api/common"
	"github.com/bytom/blockcenter/api/service"
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
	return resp, errors.Wrap(s.request(urlPath, req.BuildTxRequestGeneralV3, &resp), "build transaction")
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
	return resp, errors.Wrap(s.request(urlPath, req.SubmitPaymentReqV3, resp), "submit transaction")
}

type GetTransactionReq struct {
	TxID string `json:"tx_id"`
}

func (s *Service) GetTransaction(req *GetTransactionReq) (*types.Tx, error) {
	urlPath := fmt.Sprintf("/%s/v3/merchant/transaction?tx_hash=%s", s.netType, req.TxID)
	resp := new(types.Tx)
	return resp, errors.Wrap(s.request(urlPath, nil, resp), "get transaction")
}

// ListPendingTxProposals get the bytom pending tx proposals by the blockcenter RPC call
func (b *bycoinClient) ListTxProposals(guid string) ([]*service.RespTxProposalV3, error) {
	url := b.baseURL + "/merchant/list-txproposals"
	req := &service.ListTxProposalsReq{
		GUIDReq: common.GUIDReq{
			GUID: guid,
		},
		Display: common.Display{
			Filter: map[string]interface{}{
				"status": common.TxProposalPendingStatus,
			},
		},
	}

	resp := []*service.RespTxProposalV3{}
	return resp, errors.Wrap(b.request(url, req, &resp), "ListTxProposals v3")
}
