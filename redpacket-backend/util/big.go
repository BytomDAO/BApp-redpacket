package util

import (
	"math/big"
	"strings"
)

func TrimFloatStr(bf *big.Float) string {
	result := strings.TrimRight(bf.Text('f', 10), "0")
	return strings.TrimRight(result, ".")
}
