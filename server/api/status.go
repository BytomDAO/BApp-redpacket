package api

import (
	"github.com/gin-gonic/gin"
)

func (s *Server) Ping(c *gin.Context) (err error) {
	if err = s.cache.Ping(); err != nil {
		return
	}
	return s.db.Ping()
}
