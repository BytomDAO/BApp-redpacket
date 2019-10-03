package orm

import "github.com/redpacket/server/util/types"

// Sender is the table of sender information
// ***  RedPacketType  ***
// ***  0. normal   1.lucky
type Sender struct {
	ID              uint64 `json:"-" gorm:"primary_key"`
	RedPacketID     string
	Password        string
	ContractAddress string
	ContractProgram string
	WitnessProgram  string
	Address         string
	Amount          uint64
	TxID            *string
	IsConfirmed     bool
	IsHandled       bool
	RedPacketType   int
	Note            string
	IsExpired       bool
	CreatedAt       types.Timestamp `json:"create_at"`
	UpdatedAt       types.Timestamp `json:"updated_at"`

	Receivers []*Receiver
}
