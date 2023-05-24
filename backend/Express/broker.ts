import Exchange from "./Exchange";
import ResponseModel from "./responseModel";

const amqp = require("amqplib/callback_api");

interface QueueURLMapValue {
  queueName: string;
  OnSuccessTopicsToPush: string[];
  OnFailureTopicsToPush: string[];
}

export class Broker {
  private static instance: Broker;
  private queueURLMap: { [id: string]: QueueURLMapValue } = {};
  private channel;
  private rabbitmqURL: string = process.env.BROKER_URL || `amqp://localhost`;
  private topicNames: string[] = [];

  private constructor() {
    this.init_broker();
  }

  public static getInstance(): Broker {
    if (!Broker.instance) {
      Broker.instance = new Broker();
    }
    return Broker.instance;
  }

  // Method to initiate all the exchanges and queues

  public async init_broker() {
    try {
      console.log("Connecting to rabbitmq " + this.rabbitmqURL);
      amqp.connect(this.rabbitmqURL, (err, connection) => {
        if (err) {
          console.log("from connection", err);
        }
        connection.createChannel((err, channel) => {
          if (err) {
            console.log("from connection", err);
          }
          this.channel = channel;
          const topics = Exchange.Topics;

          // this will check all the topics one by one
          for (let i = 0; i < topics.length; i++) {
            let topic = topics[i];

            let topicName = topic.TopicName;
            this.topicNames.push(topicName);
            //this will create channel for the topic
            channel.assertExchange(topicName, "fanout", {
              durable: true,
            });
            // this will create a queuefor the channel
            let subscribers = topic.Subscribers;
            for (let j = 0; j < subscribers.length; j++) {
              let subscriber = subscribers[j];

              let queueName = subscriber.QueueName;
              channel.assertQueue(queueName, {
                exclusive: false,
              });
              //this method will bind the queue with the topic name
              channel.bindQueue(queueName, topicName, ""); //(EMPLOYYEE_ADDED, EMPLOYEE_ADD-IOT_SERVICE)
              let queueURLMapValue = {
                queueName: queueName,
                OnSuccessTopicsToPush: subscriber.OnSuccessTopicsToPush,
                OnFailureTopicsToPush: subscriber.OnFailureTopicsToPush,
              };

              this.queueURLMap[queueName] = queueURLMapValue;
              // console.log(this.queueURLMap)
            }
          }
        });
      });
    } catch (error) {
      console.log(error.message, "Check  rabbitmq is running ...");
    }
  }

  //   This methoda will Publish the Message into a particular topic

  public PublicMessageToTopic(
    topicName: string,
    message: any
  ): ResponseModel<{}> {
    //Message Received in broker to publish"=> message, topicName

    //before publishing swe have to stringify the message to buffer
    const data = Buffer.from(JSON.stringify(message));
    //publish the message into topicname
    if (this.topicNames.includes(topicName)) {
      this.channel.publish(topicName, "", data);
      var response = new ResponseModel(
        200,
        "SUCCESS",
        "POST",
        `Successfully published into Topic Name : ${topicName} `,
        {}
      );
    } else {
      var response = new ResponseModel(
        400,
        "FAILED",
        "POST",
        `Unalble to publish to Topic Name : ${topicName} `,
        {}
      );
    }
    return response;
  }

  //this method listens to a particular queuename and returns message as callback

  public async listenToService(topicName, serviceName, callBack) {
    try {
      const queueURLMapValue = this.queueURLMap[topicName + "-" + serviceName];
      const queueName = queueURLMapValue.queueName;
      // consume message from queue
      this.channel.consume(
        queueName,
        (msg) => {
          if (msg.content) {
            let message = JSON.parse(msg.content);
            callBack({
              message,
              OnSuccessTopicsToPush: queueURLMapValue.OnSuccessTopicsToPush,
              OnFailureTopicsToPush: queueURLMapValue.OnFailureTopicsToPush,
            });
          }
        },
        { noAck: true }
      );
    } catch (e) {
      setTimeout(() => {
        this.listenToService(topicName, serviceName, callBack);
      }, 5000);
    }
  }

  //   This method listen to a particular service with a callback

  public listenToServices(serviceName, callback) {
    let topics = Exchange.Topics;
    for (let i = 0; i < topics.length; i++) {
      let topic = topics[i];
      let topicName = topic.TopicName;
      let subscribers = topic.Subscribers;
      for (let j = 0; j < subscribers.length; j++) {
        let subscriber = subscribers[j];
        let vServiceName = subscriber.Service;
        if (vServiceName === serviceName) {
          this.listenToService(topicName, serviceName, callback);
        }
      }
    }
  }
}
