package service

import (
	"encoding/json"

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

// Response is the response result of request service, blockcenter v3 api response
type Response struct {
	Code   int                        `json:"code"`
	Msg    string                     `json:"msg"`
	Data   json.RawMessage            `json:"data,omitempty"`
	Result map[string]json.RawMessage `json:"result"`
}

func (s *Service) request(path string, reqData, respData interface{}) error {
	payload, err := json.Marshal(reqData)
	if err != nil {
		return err
	}

	resp := &Response{}
	if reqData == nil {
		err = util.Get(s.url+path, resp)
	} else {
		err = util.Post(s.url+path, payload, resp)
	}

	if err != nil {
		return err
	}

	if resp.Code != 200 {
		return errors.New(resp.Msg)
	}

	// v3 response format
	if len(resp.Data) != 0 {
		return json.Unmarshal(resp.Data, respData)
	}

	data, ok := resp.Result["data"]
	if !ok {
		return errors.New("fail on find resp data")
	}

	return json.Unmarshal(data, respData)
}
