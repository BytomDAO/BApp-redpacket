PACKAGES := $(shell go list ./... | grep -v '/vendor/')

.PHONY: all clean test

all:
	@mkdir -p target
	go build -o target/redpacket_updater cmd/updater/main.go
	go build -o target/redpacket_api cmd/api/main.go

test:
	@echo "Running go test"
	@go test $(PACKAGES)

golint:
	@echo "======> Running golint"
	@golint --set_exit_status $(PACKAGES)

ci: test golint

clean:
	rm -f target/updater
	rm -f target/api
