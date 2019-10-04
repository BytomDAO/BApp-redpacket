package main

import (
	"github.com/gin-gonic/gin"

	"github.com/redpacket/redpacket-backend/api"
	"github.com/redpacket/redpacket-backend/config"
	"github.com/redpacket/redpacket-backend/util"
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
