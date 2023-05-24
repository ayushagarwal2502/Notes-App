"use strict";
exports.__esModule = true;
var ResponseModel = /** @class */ (function () {
    function ResponseModel(statusCode, status, method, message, data) {
        this.statusCode = statusCode;
        this.status = status;
        this.method = method;
        this.message = message;
        this.data = data;
    }
    return ResponseModel;
}());
exports["default"] = ResponseModel;
