const express = require("express");
const app = express();
const http = require("http");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const amqp = require("amqplib/callback_api");
const { Broker } = require("./broker");
var broker = Broker.getInstance();
var cors = require("cors");
const { Dictionary } = require("dictionaryjs");
const { default: axios } = require("axios");
const port = 5005;
app.use(cors());

let activeDictionary = new Dictionary();

//socket connection with frontend and generating socket ID
io.on("connection", (socket) => {
    activeDictionary.set("socketID", socket.id);
    socket.emit("generateID", socket.id)
});

//post method to add a note
app.post("/notes/:socketID/:service/:note", (req, res) => {
    const note1 = req.params.note;
    const reqId = req.headers.requestid;
    const topicName = req.params.service + "_ADD";  //NOTES_ADD
    const body = {
        requestId: reqId,
        note: note1,
    }
    //fetch the response success or fail from broker file function
    const response = broker.PublicMessageToTopic(topicName, body);
    res.json(response);
});

//to update the note using put method
app.put("/notes/:socketID/:service/:id/:note", (req, res) => {
    const topicName = req.params.service + "_UPDATE";   //NOTES_UPDATE

    const body = {
        id: req.params.id,
        note: req.params.note,
    }
    const response = broker.PublicMessageToTopic(topicName, body);
    res.json(response);
});

//delete the note on request by user 
app.delete("/notes/:socketID/:service/:id", (req, res) => {
    let id = req.params.id;
    let topicName = req.params.service + "_DELETE"; //NOTES_DELETE
    const response = broker.PublicMessageToTopic(topicName, id);
    res.json(response);
});

//get all the notes from Database using Axios and display on below url
app.get("/home/:socketID", async (req, res) => {
    const url = "http://localhost:5002/notes";
    try {

        let result = await axios.get(url);
        res.status(200).json(result.data);
    }
    catch (e) {
        console.log("Error in Axios")

    }
});

//listening the port
server.listen(port, () => {
    console.log("Starting the server on port: ", port);
    //listening to the API service to check if the required action is sucessfully performed 
    broker.listenToServices("API_GATEWAY_SERVICE", (result) => {
        const { message } = result;
        console.log(message);
    });
});







