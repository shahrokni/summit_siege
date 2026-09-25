package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/shahrokni/summit-siege/backend/internal/api"
	"github.com/shahrokni/summit-siege/backend/internal/config"
)

func main() {
	cfg := config.Load()

	router := api.NewRouter()

	addr := ":" + cfg.Port

	fmt.Printf("Summit Siege API listening on http://localhost%s\n", addr)

	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatal(err)
	}
}
