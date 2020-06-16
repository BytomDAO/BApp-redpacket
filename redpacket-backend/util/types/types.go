package types

import (
	"fmt"
	"strconv"
	"time"
)

// BuildTxRequestGeneralV3 is the general struct request to build tx v3
type BuildTxRequestGeneralV3 struct {
	Confirmations uint64                   `json:"confirmations"`
	Fee           string                   `json:"fee"`
	Inputs        []map[string]interface{} `json:"inputs"`
	Outputs       []map[string]interface{} `json:"outputs"`
	ForbidChainTx bool                     `json:"forbid_chain_tx"`
}

// SigningInstruction represent the signing instruction
type SigningInstruction struct {
	DerivationPath []string `json:"derivation_path"`
	SignData       []string `json:"sign_data"`
	DataWitness    []byte   `json:"-"`

	// only shown for a single-signature tx
	Pubkey string `json:"pubkey,omitempty"`
}

// SubmitPaymentReqV3 the struct request to submit payment
type SubmitPaymentReqV3 struct {
	RawTx string     `json:"raw_transaction"`
	Sigs  [][]string `json:"signatures"`
	Memo  string     `json:"memo"`
}

type Input struct {
	Script  string `json:"script"`
	Address string `json:"address"`
	Asset   string `json:"asset"`
	Amount  uint64 `json:"amount"`
}

type Output struct {
	UtxoID  string `json:"utxo_id"`
	Script  string `json:"script"`
	Address string `json:"address"`
	Asset   string `json:"asset"`
	Amount  uint64 `json:"amount"`
}

// Tx the transcation in txpool
type Tx struct {
	Hash                string     `json:"hash"`
	Status              bool       `json:"status"`
	Size                uint64     `json:"size"`
	SubmissionTimestamp uint64     `json:"submission_timestamp"`
	BlockHeight         uint64     `json:"block_height,omitempty"`
	BlockTimestamp      uint64     `json:"block_timestamp,omitempty"`
	Memo                string     `json:"memo"`
	Inputs              []*Input   `json:"inputs"`
	Outputs             []*Output  `json:"outputs"`
	Fee                 string     `json:"fee"`
	CrossChainFee       string     `json:"cross_chain_fee,omitempty"`
	Balances            []*Balance `json:"balances"`
	Types               []string   `json:"types"`
}

type Balance struct {
	Asset  string `json:"asset"`
	Amount string `json:"amount"`
}

type Timestamp time.Time

func (t *Timestamp) Unix() int64 {
	return time.Time(*t).Unix()
}

func (t *Timestamp) MarshalJSON() ([]byte, error) {
	ts := time.Time(*t).Unix()
	stamp := fmt.Sprint(ts)
	return []byte(stamp), nil
}

func (t *Timestamp) UnmarshalJSON(b []byte) error {
	ts, err := strconv.Atoi(string(b))
	if err != nil {
		return err
	}

	*t = Timestamp(time.Unix(int64(ts), 0))
	return nil
}
