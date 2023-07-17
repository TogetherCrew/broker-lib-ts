# tc-messageBroker

[![Maintainability](https://api.codeclimate.com/v1/badges/3bfc028af8f41cd1cd0c/maintainability)](https://codeclimate.com/github/RnDAO/tc-messageBroker/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3bfc028af8f41cd1cd0c/test_coverage)](https://codeclimate.com/github/RnDAO/tc-messageBroker/test_coverage)

RabbitMQ library written in TypeScript. Responsible for brokering messages between different services.
## Install
`npm i @togethercrew.dev/tc-messagebroker`

## Initial `RabbitMQ` in root directory
```Javascript
import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

RabbitMQ.connect("connectionURL", "queueName").then(() => {
    console.log("RabbitMQ was connected!")
})
```

## Push to the specific queue and event
```Javascript
import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

RabbitMQ.publish("queueName", "eventName", { key: "value" })
```

## Subscribe on specific event
```Javascript
import RabbitMQ from '@togethercrew.dev/tc-messagebroker';

RabbitMQ.onEvent("eventName", (msg) => {})
```
> Ensure that the `onEvent` function is called when the application is launched
