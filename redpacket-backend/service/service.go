package service

import (
	"github.com/bytom/bytom/errors"

	"github.com/redpacket/redpacket-backend/util"
)

// Service can invoke the api which provide by the server
type Service struct {
	netType string
	url     string
}

// NewService new a service with target server
func NewService(netType string, url string) *Service {
	return &Service{
		netType: netType,
		url:     url,
	}
}

// Response is the response result of request service
type Response struct {
	Code   int                    `json:"code"`
	Msg    string                 `json:"msg"`
	Result map[string]interface{} `json:"result,omitempty"`
}

func (s *Service) request(path string, payload []byte) (interface{}, error) {
	resp := &Response{}
	if err := util.Post(s.url+path, payload, resp); err != nil {
		return nil, err
	}

	if resp.Code != 200 {
		return nil, errors.New(resp.Msg)
	}

	return resp.Result["data"], nil
}
