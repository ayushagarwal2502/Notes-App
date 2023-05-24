// generating request id for tracking the request further
function uuidv4() {
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
  var r = (Math.random() * 16) | 0,
    v = c == "x" ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});
}

//creating an array to store the actions performed Add/Update/Delete
let requests =JSON.parse(sessionStorage.getItem("requests"));

// a function which inserts object in a request array with type of request, socket-id and request-id
function dic(req){
    let requestId = uuidv4();
    if(requests !==null){
        requests.push({
            requestType: req,
            socketId: sessionStorage.getItem("socketID"),
            requestId: requestId,
        });
        sessionStorage.setItem("requests", JSON.stringify(requests))
    }
    else{
        requests =[
            {
                requestType: req,
                socketId: sessionStorage.getItem("socketID"),
                requestId: requestId,
            },
        ];
        sessionStorage.setItem("requests",JSON.stringify(requests))
    }
    return requestId;
}



