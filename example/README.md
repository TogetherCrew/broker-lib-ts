# Example

This simple example:
1. connects to RabbitMQ
2. listens for an event
3. emits an event

You will need docker to run an instance of RabbitMQ.

```bash
$ docker-compose up
$ yarn install
$ yarn build
$ yarn start
```

Expected output:

```bash
Hello world!
channel was created!
RabbitMQ was connected!
Received eventName with: { "key": "value" }
```