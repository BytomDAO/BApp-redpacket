package main

import (
	"github.com/gin-gonic/gin"

	"github.com/redpacket/server/api"
	"github.com/redpacket/server/config"
	"github.com/redpacket/server/util"
)

func main() {
	cfg := config.NewConfig()
	if cfg.GinGonic.IsReleaseMode {
		gin.SetMode(gin.ReleaseMode)
	}

	util.ChangeTransactionFee(cfg.Updater.BlockCenter.NetType)
	apiServer := api.NewServer(cfg)
	apiServer.Run()
}
