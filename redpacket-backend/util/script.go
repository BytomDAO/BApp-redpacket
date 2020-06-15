package util

import (
	"github.com/bytom/bytom/crypto"
	"github.com/bytom/bytom/protocol/vm"
	"github.com/bytom/bytom/protocol/vm/vmutil"
	"github.com/google/uuid"
)

// TransactionFee is global variable for transaction fee
var TransactionFee uint64

const (
	Duration   = int64(600)
	BTMAssetID = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
)

// AddressProgram contains address and program
type AddressProgram struct {
	Address string
	Program []byte
}

// NewP2SHAddressProgram create address and program by script
func NewP2SHAddressProgram(script []byte, hrp string) (*AddressProgram, error) {
	scriptHash := crypto.Sha256(script)
	program, err := vmutil.P2WSHProgram(scriptHash)
	if err != nil {
		return nil, err
	}

	address, err := NewAddressWitnessScriptHash(hrp, scriptHash)
	if err != nil {
		return nil, err
	}

	return &AddressProgram{
		Address: address.EncodeAddress(),
		Program: program,
	}, nil
}

// NewRevealPreimageScript generate RevealPreimage script
func NewRevealPreimageScript(hash []byte) ([]byte, error) {
	builder := vmutil.NewBuilder()
	builder.AddData(hash[:])
	builder.AddOp(vm.OP_SWAP)
	builder.AddOp(vm.OP_SHA3)
	builder.AddOp(vm.OP_EQUAL)
	return builder.Build()
}

// AssemblePassword return assemble password and guid
func AssemblePassword(password string, guid uuid.UUID) []byte {
	var assemblePassword []byte
	assemblePassword = append(assemblePassword, []byte(password)...)
	assemblePassword = append(assemblePassword, guid[:]...)
	return assemblePassword
}

// ChangeTransactionFee change TransactionFee by netType
func ChangeTransactionFee(netType string) {
	if netType == "btm" {
		TransactionFee = uint64(200000)
	} else if netType == "vapor" {
		TransactionFee = uint64(0)
	}
}
