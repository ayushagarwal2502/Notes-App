"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.Broker = void 0;
var Exchange_1 = require("./Exchange");
var responseModel_1 = require("./responseModel");
var amqp = require("amqplib/callback_api");
var Broker = /** @class */ (function () {
  function Broker() {
    this.queueURLMap = {};
    this.rabbitmqURL = process.env.BROKER_URL || "amqp://localhost";
    this.topicNames = [];
    this.init_broker();
  }
  Broker.getInstance = function () {
    if (!Broker.instance) {
      Broker.instance = new Broker();
    }
    return Broker.instance;
  };
  // Method to initiate all the exchanges and queues
  Broker.prototype.init_broker = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        try {
          console.log("Connecting to rabbitmq " + this.rabbitmqURL);
          amqp.connect(this.rabbitmqURL, function (err, connection) {
            if (err) {
              console.log("from connection", err);
            }
            connection.createChannel(function (err, channel) {
              if (err) {
                console.log("from connection", err);
              }
              _this.channel = channel;
              var topics = Exchange_1["default"].Topics;
              // this will check all the topics one by one
              for (var i = 0; i < topics.length; i++) {
                var topic = topics[i];
                var topicName = topic.TopicName;
                _this.topicNames.push(topicName);
                //this will create channel for the topic
                channel.assertExchange(topicName, "fanout", {
                  durable: true,
                });
                // this will create a queuefor the channel
                var subscribers = topic.Subscribers;
                for (var j = 0; j < subscribers.length; j++) {
                  var subscriber = subscribers[j];
                  var queueName = subscriber.QueueName;
                  channel.assertQueue(queueName, {
                    exclusive: false,
                  });
                  //this method will bind the queue with the topic name
                  channel.bindQueue(queueName, topicName, ""); //(EMPLOYYEE_ADDED, EMPLOYEE_ADD-IOT_SERVICE)
                  var queueURLMapValue = {
                    queueName: queueName,
                    OnSuccessTopicsToPush: subscriber.OnSuccessTopicsToPush,
                    OnFailureTopicsToPush: subscriber.OnFailureTopicsToPush,
                  };
                  _this.queueURLMap[queueName] = queueURLMapValue;
                  // console.log(this.queueURLMap)
                }
              }
            });
          });
        } catch (error) {
          console.log(error.message, "Ckech you rabbitmq is running ...");
        }
        return [2 /*return*/];
      });
    });
  };
  //   This methoda will Publish the Message into a particular topic
  Broker.prototype.PublicMessageToTopic = function (topicName, message) {
    console.log("Message Received in broker to publish", message, topicName);
    //before publishing swe have to stringify the message to buffer
    var data = Buffer.from(JSON.stringify(message));
    //publish the message into topicname
    if (this.topicNames.includes(topicName)) {
      this.channel.publish(topicName, "", data);
      var response = new responseModel_1["default"](
        200,
        "SUCCESS",
        "POST",
        "Successfully published into Topic Name : ".concat(topicName, " "),
        {}
      );
    } else {
      var response = new responseModel_1["default"](
        400,
        "FAILED",
        "POST",
        "Unalble to publish to Topic Name : ".concat(topicName, " "),
        {}
      );
    }
    return response;
  };
  //this method listens to a particular queuename and returns message as callback
  // queuename = [topicname + '-' + Service] i.e [EMPLOYEE_ADDED-API_GATEWAY_SERVICE]
  Broker.prototype.listenToService = function (
    topicName,
    serviceName,
    callBack
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var queueURLMapValue_1, queueName;
      var _this = this;
      return __generator(this, function (_a) {
        try {
          queueURLMapValue_1 = this.queueURLMap[topicName + "-" + serviceName];
          queueName = queueURLMapValue_1.queueName;
          // consume message from queue
          this.channel.consume(
            queueName,
            function (msg) {
              if (msg.content) {
                var message = JSON.parse(msg.content);
                callBack({
                  message: message,
                  OnSuccessTopicsToPush:
                    queueURLMapValue_1.OnSuccessTopicsToPush,
                  OnFailureTopicsToPush:
                    queueURLMapValue_1.OnFailureTopicsToPush,
                });
              }
            },
            { noAck: true }
          );
        } catch (e) {
          setTimeout(function () {
            _this.listenToService(topicName, serviceName, callBack);
          }, 5000);
        }
        return [2 /*return*/];
      });
    });
  };
  //This method listen to a particular service with a callback
  Broker.prototype.listenToServices = function (serviceName, callback) {
    var topics = Exchange_1["default"].Topics;
    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      var topicName = topic.TopicName;
      var subscribers = topic.Subscribers;
      for (var j = 0; j < subscribers.length; j++) {
        var subscriber = subscribers[j];
        var vServiceName = subscriber.Service;
        if (vServiceName === serviceName) {
          this.listenToService(topicName, serviceName, callback);
        }
      }
    }
  };
  return Broker;
})();
exports.Broker = Broker;
