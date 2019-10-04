package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// Response describes the response standard. Code & Msg are always present.
// Data is present for a success response only.
type Response struct {
	Code   int                    `json:"code"`
	Msg    string                 `json:"msg"`
	Result map[string]interface{} `json:"result,omitempty"`
}

func RespondErrorResp(c *gin.Context, err error) {
	log.WithFields(log.Fields{
		"url":     c.Request.URL,
		"request": c.Value(ReqBodyLabel),
		"err":     err,
	}).Error("request fail")
	c.AbortWithStatusJSON(http.StatusOK, Response{Code: 300, Msg: err.Error()})
}

func RespondSuccessResp(c *gin.Context, data interface{}) {
	result := make(map[string]interface{})
	result["data"] = data
	c.AbortWithStatusJSON(http.StatusOK, Response{Code: 200, Result: result})
}
