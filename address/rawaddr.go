package address

import (
	"errors"
	"fmt"
	"math/big"
	"strings"

	"github.com/schancel/cashaddr-converter/cashaddress"
)

type AddressType byte

const (
	P2KH AddressType = 0
	P2SH AddressType = 1
)

type NetworkType string

const (
	RegTest NetworkType = "bchreg"
	TestNet NetworkType = "bchtest"
	MainNet NetworkType = "bitcoincash"
)

type Address struct {
	Network NetworkType
	Version AddressType
	Payload []byte
}

func (r *Address) Verify() error {
	switch r.Version {
	case P2KH:
	case P2SH:
	default:
		return errors.New("invalid address type")
	}

	switch r.Network {
	case RegTest:
	case TestNet:
	case MainNet:
	default:
		return errors.New("invalid network")
	}

	return nil
}

func (addr *Address) Hex() string {
	var format = "0x%s"
	hexStr := strings.ToUpper(big.NewInt(0).SetBytes(addr.Payload).Text(16))

	// Prepend a zero
	if len(hexStr)%2 == 1 {
		format = "0x0%s"
	}

	return fmt.Sprintf(format, hexStr)
}

func (addr *Address) CashAddress() (*cashaddress.Address, error) {
	var network = cashaddress.MainNet
	var addrtype = cashaddress.P2SH

	switch addr.Network {
	case MainNet:
		network = cashaddress.MainNet
	case TestNet:
		network = cashaddress.TestNet
	case RegTest:
		network = cashaddress.RegTest
	default:
		return nil, errors.New("invalid address network")
	}

	switch addr.Version {
	case P2KH:
		addrtype = cashaddress.P2KH
	case P2SH:
		addrtype = cashaddress.P2SH
	default:
		return nil, errors.New("invalid address type")
	}
	return &cashaddress.Address{
		Version: addrtype,
		Prefix:  network,
		Payload: addr.Payload,
	}, nil
}

func NewFromCashAddress(addr *cashaddress.Address) (*Address, error) {
	var network = MainNet
	var addrtype = P2SH

	switch addr.Prefix {
	case cashaddress.MainNet:
		network = MainNet
	case cashaddress.TestNet:
		network = TestNet
	case cashaddress.RegTest:
		network = RegTest
	default:
		return nil, errors.New("invalid address network")
	}

	switch addr.Version {
	case cashaddress.P2KH:
		addrtype = P2KH
	case cashaddress.P2SH:
		addrtype = P2SH
	default:
		return nil, errors.New("invalid address type")
	}

	return &Address{
		Network: network,
		Version: addrtype,
		Payload: addr.Payload,
	}, nil
}
