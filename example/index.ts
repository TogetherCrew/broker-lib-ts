import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

const connectionStr = "amqp://guest:guest@localhost:5672"
const queueName = "queueName"
const eventName = "eventName"

RabbitMQ.connect(connectionStr, queueName).then(() => {
    console.log("RabbitMQ was connected!")

    RabbitMQ.onEvent(eventName, (msg) => {
        console.log(`Received ${eventName} with:`, msg)
    })
    
    RabbitMQ.publish(queueName, eventName, { key: "value" })
})

console.log("Hello world!")