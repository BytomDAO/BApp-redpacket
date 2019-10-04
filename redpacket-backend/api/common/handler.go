package common

import (
	"encoding/json"
	"reflect"

	"github.com/bytom/errors"
	"github.com/gin-gonic/gin"
)

type handlerFun interface{}

// HandleRequest get a handler function to process the request by request url
func HandleRequest(context *gin.Context, fun handlerFun) {
	args, err := buildHandleFuncArgs(fun, context)
	if err != nil {
		RespondErrorResp(context, err)
		return
	}

	result := callHandleFunc(fun, args...)
	if err := result[len(result)-1]; err != nil {
		RespondErrorResp(context, err.(error))
		return
	}

	if len(result) == 1 {
		RespondSuccessResp(context, nil)
		return
	}

	RespondSuccessResp(context, result[0])
}

func callHandleFunc(fun handlerFun, args ...interface{}) []interface{} {
	fv := reflect.ValueOf(fun)

	params := make([]reflect.Value, len(args))
	for i, arg := range args {
		params[i] = reflect.ValueOf(arg)
	}

	rs := fv.Call(params)
	result := make([]interface{}, len(rs))
	for i, r := range rs {
		result[i] = r.Interface()
	}
	return result
}

func buildHandleFuncArgs(fun handlerFun, context *gin.Context) ([]interface{}, error) {
	args := []interface{}{context}

	req, err := createHandleReqArg(fun, context)
	if err != nil {
		return nil, errors.Wrap(err, "createHandleReqArg")
	}

	if req != nil {
		args = append(args, req)
	}
	return args, nil
}

func createHandleReqArg(fun handlerFun, context *gin.Context) (interface{}, error) {
	ft := reflect.TypeOf(fun)
	if ft.NumIn() == 1 {
		return nil, nil
	}
	argType := ft.In(1)
	argKind := argType.Kind()

	// point type must dereference once
	if argKind == reflect.Ptr {
		argType = argType.Elem()
	}

	reqArg := reflect.New(argType).Interface()
	if err := context.ShouldBindJSON(reqArg); err != nil {
		return nil, errors.Wrap(err, "bind reqArg")
	}

	b, err := json.Marshal(reqArg)
	if err != nil {
		return nil, errors.Wrap(err, "json marshal")
	}

	context.Set(ReqBodyLabel, string(b))

	if argKind == reflect.Ptr {
		return reqArg, nil
	}

	return reflect.ValueOf(reqArg).Elem().Interface(), nil
}

var (
	errorType   = reflect.TypeOf((*error)(nil)).Elem()
	contextType = reflect.TypeOf((*gin.Context)(nil))
)

func ValidateFuncType(fun handlerFun) error {
	ft := reflect.TypeOf(fun)
	if ft.Kind() != reflect.Func || ft.IsVariadic() {
		return errors.New("need nonvariadic func in " + ft.String())
	}

	if ft.NumIn() < 1 || ft.NumIn() > 3 {
		return errors.New("need one or two or three parameters in " + ft.String())
	}

	if ft.In(0) != contextType {
		return errors.New("the first parameter must point of context in " + ft.String())
	}

	if ft.NumIn() == 2 && ft.In(1).Kind() != reflect.Struct && ft.In(1).Kind() != reflect.Ptr {
		return errors.New("the second parameter must struct or point in " + ft.String())
	}

	if ft.NumOut() < 1 || ft.NumOut() > 2 {
		return errors.New("the size of return value must one or two in " + ft.String())
	}

	if !ft.Out(ft.NumOut() - 1).Implements(errorType) {
		return errors.New("the last return value must error in " + ft.String())
	}
	return nil
}
