export default class ResponseModel<TDto extends {}> {
  statusCode: number;
  status: "SUCCESS" | "FAILED";
  method: "GET" | "POST" | "PUT" | "DELETE";
  message: string;
  data: TDto;
  socketID: string;
  requestId: string;
  serviceName: string;
  constructor(
    statusCode: number,
    status: "SUCCESS" | "FAILED",
    method: "GET" | "POST" | "PUT" | "DELETE",
    message: string,
    data: TDto
  ) {
    this.statusCode = statusCode;
    this.status = status;
    this.method = method;
    this.message = message;
    this.data = data;
  }
}
