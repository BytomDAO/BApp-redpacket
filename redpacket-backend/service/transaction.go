package service

import (
	"encoding/json"
	"fmt"

	"github.com/bytom/bytom/errors"

	"github.com/redpacket/redpacket-backend/util/types"
)

type BuildTransactionReq struct {
	Guid          string                   `json:"guid"`
	Confirmations uint64                   `json:"confirmations"`
	Fee           uint64                   `json:"fee"`
	Inputs        []map[string]interface{} `json:"inputs"`
	Outputs       []map[string]interface{} `json:"outputs"`
}

// SigningInstruction is a structure of the blockcenter
type SigningInstruction struct {
	DerivationPath []string `json:"derivation_path"`
	SignData       []string `json:"sign_data"`
	DataWitness    []byte   `json:"-"`
	Pubkey         string   `json:"pubkey,omitempty"`
}

type BuildTransactionResp struct {
	RawTransaction      interface{}           `json:"raw_transaction"`
	SigningInstructions []*SigningInstruction `json:"signing_instructions"`
	Fee                 uint64                `json:"fee"`
}

func (s *Service) BuildTransaction(req *BuildTransactionReq) (*BuildTransactionResp, error) {
	urlPath := fmt.Sprintf("/api/v2/%s/merchant/build-transaction", s.netType)
	payload, err := json.Marshal(req)
	if err != nil {
		return nil, errors.Wrap(err, "json marshal")
	}

	resp, err := s.request(urlPath, payload)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(resp)
	if err != nil {
		return nil, err
	}

	var res *BuildTransactionResp
	if err := json.Unmarshal(data, &res); err != nil {
		return nil, err
	}
	return res, nil
}

type SubmitTransactionReq struct {
	Guid  string     `json:"guid"`
	RawTx string     `json:"raw_transaction"`
	Sigs  [][]string `json:"signatures"`
	Memo  string     `json:"memo"`
}

type SubmitTransactionResp struct {
	TxHash string `json:"transaction_hash"`
}

func (s *Service) SubmitTransaction(req *SubmitTransactionReq) (*SubmitTransactionResp, error) {
	urlPath := fmt.Sprintf("/api/v2/%s/merchant/submit-payment", s.netType)
	payload, err := json.Marshal(req)
	if err != nil {
		return nil, errors.Wrap(err, "json marshal")
	}

	resp, err := s.request(urlPath, payload)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(resp)
	if err != nil {
		return nil, err
	}

	var res *SubmitTransactionResp
	if err := json.Unmarshal(data, &res); err != nil {
		return nil, err
	}
	return res, nil
}

type GetTransactionReq struct {
	TxID string `json:"tx_id"`
}

func (s *Service) GetTransaction(req *GetTransactionReq) (*types.Tx, error) {
	urlPath := fmt.Sprintf("/api/v2/%s/merchant/get-transaction", s.netType)
	payload, err := json.Marshal(req)
	if err != nil {
		return nil, errors.Wrap(err, "json marshal")
	}

	resp, err := s.request(urlPath, payload)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(resp)
	if err != nil {
		return nil, err
	}

	var res *types.Tx
	if err := json.Unmarshal(data, &res); err != nil {
		return nil, err
	}
	return res, nil
}
