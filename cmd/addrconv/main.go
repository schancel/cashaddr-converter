package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"github.com/schancel/cashaddr-converter/address"
	"github.com/schancel/cashaddr-converter/cmd/common"
)

func usage() {
	fmt.Fprintf(os.Stderr, "Usage of %s:\n", os.Args[0])
	fmt.Fprintf(os.Stderr, "  ./addrconv address ...\n")
	flag.PrintDefaults()
}

func main() {
	flag.Usage = usage
	flag.Parse()

	args := flag.Args()

	outputs := make(map[string]*common.Output, len(args))

	for _, addr := range args {
		address, err := address.NewFromString(addr)
		if err != nil {
			fmt.Fprintf(os.Stderr, "unable to decode address %q: %v\n", addr, err)
			continue
		}
		out, err := common.GetAllFormats(address)
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
