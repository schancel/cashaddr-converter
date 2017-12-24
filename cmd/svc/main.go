package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"github.com/schancel/cashaddr-converter/address"
	"github.com/schancel/cashaddr-converter/cmd/common"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/convert", handleConvert)
	corsOptions := []handlers.CORSOption{
		handlers.AllowedMethods([]string{"GET", "POST"}),
		handlers.AllowedOrigins([]string{"*"}),
	}
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static")))
	http.ListenAndServe(":3000", handlers.CORS(corsOptions...)(r))
}

func handleConvert(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	addr, err := address.NewFromString(r.Form.Get("address"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	out, err := common.GetAllFormats(addr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	encoder.Encode(out)
}
