/* eslint-disable prettier/prettier */
const Exchange = {
    Topics: [
        {
            TopicName: "NOTES_ADD",
            Publishers: ["API_GATEWAY_SERVICE"],
            Method: "POST",
            Subscribers: [
                {
                    Service: "IOT_SERVICE",
                    OnSuccessTopicsToPush: ["NOTES_ADDED"],
                    OnFailureTopicsToPush: ["ERROR_RECEIVER"],
                    QueueName: "NOTES_ADD-IOT_SERVICE"
                },
            ],
        },
        {
            TopicName: "NOTES_ADDED",
            Publishers: ["IOT_SERVICE"],
            Method: "UNKNOWN",
            Subscribers: [
                {
                    Service: "API_GATEWAY_SERVICE",
                    OnSuccessTopicsToPush: [],
                    OnFailureTopicsToPush: [],
                    QueueName: "NOTES_ADDED-API_GATEWAY_SERVICE"
                },
            ],
        },
        {
            TopicName: "NOTES_UPDATE",
            Publishers: ["API_GATEWAY_SERVICE"],
            Method: "POST",
            Subscribers: [
                {
                    Service: "IOT_SERVICE",
                    OnSuccessTopicsToPush: ["NOTES_UPDATED"],
                    OnFailureTopicsToPush: ["ERROR_RECEIVER"],
                    QueueName: "NOTES_UPDATE-IOT_SERVICE"
                },
            ],
        },
        {
            TopicName: "NOTES_UPDATED",
            Publishers: ["IOT_SERVICE"],
            Method: "UNKNOWN",
            Subscribers: [
                {
                    Service: "API_GATEWAY_SERVICE",
                    OnSuccessTopicsToPush: [],
                    OnFailureTopicsToPush: [],
                    QueueName: "NOTES_UPDATED-API_GATEWAY_SERVICE"
                },
            ],
        },
        {
            TopicName: "NOTES_DELETE",
            Publishers: ["API_GATEWAY_SERVICE"],
            Method: "PUT",
            Subscribers: [
                {
                    Service: "IOT_SERVICE",
                    OnSuccessTopicsToPush: ["NOTES_DELETED"],
                    OnFailureTopicsToPush: ["ERROR_RECEIVER"],
                    QueueName: "NOTES_DELETE-IOT_SERVICE"
                },
            ],
        },
        {
            TopicName: "NOTES_DELETED",
            Publishers: ["IOT_SERVICE"],
            Method: "UNKNOWN",
            Subscribers: [
                {
                    Service: "API_GATEWAY_SERVICE",
                    OnSuccessTopicsToPush: [],
                    OnFailureTopicsToPush: [],
                    QueueName: "NOTES_DELETED-API_GATEWAY_SERVICE"
                },
            ],
        },
        {
            TopicName: "ERROR_RECEIVER",
            Publishers: ["IOT_SERVICE"],
            Method: "UNKNOWN",
            Subscribers: [
                {
                    Service: "API_GATEWAY_SERVICE",
                    OnSuccessTopicsToPush: [],
                    OnFailureTopicsToPush: [],
                    QueueName: "ERROR_RECEIVER-API_GATEWAY_SERVICE"
                },
            ],
        },
    ]
}

export default Exchange;