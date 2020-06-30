package api

import (
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"

	"github.com/redpacket/redpacket-backend/api/common"
	"github.com/redpacket/redpacket-backend/config"
	"github.com/redpacket/redpacket-backend/database"
	"github.com/redpacket/redpacket-backend/service"
)

type Server struct {
	db      *database.DB
	cache   *database.RedisDB
	cfg     *config.Config
	engine  *gin.Engine
	service *service.Service
}

func NewServer(cfg *config.Config) *Server {
	db, err := database.NewMySQLDB(cfg.MySQL, cfg.API.MySQLConnCfg)
	if err != nil {
		log.WithField("err", err).Panic("initialize mysql db error")
	}

	return NewServerWithDB(cfg, db)
}

func NewServerWithDB(cfg *config.Config, db *database.DB) *Server {
	cache, err := database.NewRedisDB(cfg.Redis)
	if err != nil {
		log.WithField("err", err).Panic("initialize redis error")
	}

	server := &Server{
		db:      db,
		cache:   cache,
		cfg:     cfg,
		service: service.NewService(cfg.Updater.BlockCenter.NetType, cfg.Updater.BlockCenter.URL),
	}
	setupRouter(server)
	return server
}

func setupRouter(apiServer *Server) {
	r := gin.Default()
	r.Use(apiServer.Middleware())
	r.HEAD("/dapp", handlerMiddleware(apiServer.Head))
	v1 := r.Group("/dapp")

	v1.POST("/create-redpacket", handlerMiddleware(apiServer.CreateRedPacket))
	v1.POST("/submit-redpacket", handlerMiddleware(apiServer.SubmitRedPacket))
	v1.POST("/open-redpacket", handlerMiddleware(apiServer.OpenRedPacket))
	v1.POST("/get-redpacket-details", handlerMiddleware(apiServer.GetRedPacketDetails))
	v1.POST("/list-sender-redpackets", handlerMiddleware(apiServer.ListSenderRedPackets))
	v1.POST("/list-receiver-redpackets", handlerMiddleware(apiServer.ListReceiverRedPackets))
	v1.POST("/get-redpacket-password", handlerMiddleware(apiServer.GetRedPacketPwd))

	v1.GET("/ping", handlerMiddleware(apiServer.Ping))
	apiServer.engine = r
}

func handlerMiddleware(handleFunc interface{}) func(*gin.Context) {
	if err := common.ValidateFuncType(handleFunc); err != nil {
		panic(err)
	}

	return func(context *gin.Context) {
		common.HandleRequest(context, handleFunc)
	}
}

func (s *Server) Run() {
	s.engine.Run(fmt.Sprintf(":%d", s.cfg.GinGonic.ListeningPort))
}

func (s *Server) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// add Access-Control-Allow-Origin for gin
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Set(common.ServerLabel, s)
		c.Set(common.DBLabel, s.db)
		c.Set(common.CacheLabel, s.cache)
		c.Next()
	}
}

func (s *Server) Head(_ *gin.Context) error {
	return nil
}

func (s *Server) GetNetWorkPrefix() (prefix string, err error) {
	if s.cfg.Updater.BlockCenter.NetType == "btm" {
		switch s.cfg.Updater.BlockCenter.NetWork {
		case "mainnet":
			prefix = "bm"
		case "wisdom", "testnet":
			prefix = "tm"
		default:
			prefix = "sm"
		}
	} else if s.cfg.Updater.BlockCenter.NetType == "vapor" {
		switch s.cfg.Updater.BlockCenter.NetWork {
		case "mainnet":
			prefix = "vp"
		case "testnet":
			prefix = "tp"
		default:
			prefix = "sp"
		}
	} else {
		err = errors.New("wrong netType")
	}
	return
}

func (s *Server) GetCommonAddress() string {
	return s.cfg.Updater.BlockCenter.CommonAddress
}
