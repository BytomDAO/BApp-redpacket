package copartner

import (
	"encoding/json"

	"github.com/bytom/bytom/errors"

	"github.com/redpacket/redpacket-backend/util"
)

// Service can invoke the api which provide by the server
type Service struct {
	url string
}

// NewService new a service with target server
func NewService(url string) *Service {
	return &Service{
		url: url,
	}
}

// Response describes the response standard. Code & Msg are always present.
// Data is present for a success response only.
type Response struct {
	Code int             `json:"code"`
	Msg  string          `json:"msg"`
	Data json.RawMessage `json:"data,omitempty"`
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

	return json.Unmarshal(resp.Data, respData)
}
