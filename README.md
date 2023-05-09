# tc-messageBroker
RabbitMQ library for brokering messages between different system components


## Install 
`npm i @togethercrew.dev/tc-messagebroker `

## Initial `RabbitMQ` in root directory
```Javascript
import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

RabbitMQ.connect("connectionURL", "queueName").then(() => {
    console.log("RabbitMQ was connected!")
})
```

## Subscribe on specific event
```Javascript
import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

RabbitMQ.onEvent("eventName", (msg) => {})
```
> Ensure that the `onEvent` function is called when the application is launched


## Push to the specific queue and event
```Javascript
import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

RabbitMQ.publish("queueName", "eventName", { key: "value" })
```

