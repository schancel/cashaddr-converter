package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"github.com/schancel/cashaddr-converter/address"
)

type Output struct {
	CashAddr string `json:"cashaddr,omitempty"`
	Legacy   string `json:"legacy,omitempty"`
	Copay    string `json:"copay,omitempty"`
	Hash     string `json:"hash,omitempty"`
}

func usage() {
	fmt.Fprintf(os.Stderr, "Usage of %s:\n", os.Args[0])
	fmt.Fprintf(os.Stderr, "  ./addrconv address ...\n")
	flag.PrintDefaults()
}

func main() {
	flag.Usage = usage
	flag.Parse()

	args := flag.Args()

	outputs := make(map[string]*Output, len(args))

	for _, addr := range args {
		address, err := address.NewFromString(addr)
		if err != nil {
			fmt.Fprintf(os.Stderr, "unable to decode address %q: %v\n", addr, err)
			continue
		}
		out, err := GetAllFormats(address)
		if err != nil {
			fmt.Fprintf(os.Stderr, "unable to convert address %q: %v\n", addr, err)
			continue
		}
		outputs[addr] = out
	}

	var bytes bytes.Buffer
	encoder := json.NewEncoder(&bytes)
	encoder.SetIndent("", "  ")
	encoder.Encode(outputs)
	fmt.Println(bytes.String())
}

func GetAllFormats(addr *address.Address) (*Output, error) {
	cashaddr, err := addr.CashAddress()
	if err != nil {
		return nil, err
	}
	cashaddrstr, err := cashaddr.Encode()
	if err != nil {
		return nil, err
	}

	old, err := addr.Legacy()
	if err != nil {
		return nil, err
	}
	oldstr, err := old.Encode()
	if err != nil {
		return nil, err
	}

	copay, err := addr.Copay()
	if err != nil {
		return nil, err
	}
	copaystr, err := copay.Encode()
	if err != nil {
		return nil, err
	}

	return &Output{
		CashAddr: cashaddrstr,
		Legacy:   oldstr,
		Copay:    copaystr,
		Hash:     addr.Hex(),
	}, nil
}
