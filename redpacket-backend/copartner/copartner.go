package copartner

import (
	"github.com/bytom/bytom/errors"
)

// BindInviteRelationReq bind invite relation req
type BindInviteRelationReq struct {
	Token          string `json:"token"`
	InviterAddress string `json:"inviter_address"`
	InviteeAddress string `json:"invitee_address"`
}

// BindInviteRelationResp bind invite relation resp
type BindInviteRelationResp struct {
	InviterAddress string `json:"inviter_address"`
	InviteeAddress string `json:"invitee_address"`
	InviteCode     string `json:"invite_code"`
}

func (s *Service) BindInviteRelation(req *BindInviteRelationReq) (*BindInviteRelationResp, error) {
	urlPath := "/partner/v3/bind-invite-relation"
	resp := &BindInviteRelationResp{}
	return resp, errors.Wrapf(s.request(urlPath, req, resp), "bind invite relation, url path: %s", urlPath)
}
