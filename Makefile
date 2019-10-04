PACKAGES := $(shell go list ./... | grep -v '/vendor/')

.PHONY: all clean test

all:
	@mkdir -p target
	go build -o target/updater redpacket-backend/cmd/updater/main.go
	go build -o target/api redpacket-backend/cmd/api/main.go

test:
	@echo "Running go test"
	@go test $(PACKAGES)

ci: test

clean:
	rm -f target/updater
	rm -f target/api