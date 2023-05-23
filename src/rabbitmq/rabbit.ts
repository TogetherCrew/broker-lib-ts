import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib';

class RabbitMQ {
  // make the class Singleton
  private static instance: RabbitMQ;
  private constructor() {}
  public static getInstance(): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
    }

    return RabbitMQ.instance;
  }

  channel!: Channel;
  connection!: Connection;
  private eventFunction: Record<string, any> = {};

  async connect(connectionURL: string, queueName: string, consumeOptions?: amqplib.Options.Consume) {
    try {
      const amqpServer = connectionURL;
      this.connection = await amqplib.connect(amqpServer);
      this.channel = await this.connection.createChannel();

      // make sure that the channel is created, if not this statement will create it
      await this.channel.assertQueue(queueName);

      this.channel.consume(queueName, this.consume, consumeOptions);
    } catch (error) {
      console.error('Something went wrong with RabbitMQ', error);
    }
  }

  consume = (msg: ConsumeMessage | null) => {
    // if there is no message return nothing
    if (!msg) return;

    const data = this.parseBufferToJSON(msg?.content);
    const event = data.event;

    const eventFunction = this.eventFunction[event];
    if (!eventFunction) {
      console.log("An Event was received that doesn't exist");
      return;
    }

    const isAsync = eventFunction[Symbol.toStringTag] === 'AsyncFunction';
    if (isAsync)
      eventFunction(data)?.then(() => {
        if (msg) this.channel.ack(msg);
      });
    else {
      eventFunction(data);
      if (msg) this.channel.ack(msg);
    }
  };

  publish(queueName: string, event: string, content: Object, options?: amqplib.Options.Publish) {
    const data = this.convertObjectToBuffer({ event, date: new Date(), content });

    this.channel.sendToQueue(queueName, data, options);
  }

  onEvent(eventName: string, onMessage: (msg: amqplib.ConsumeMessage | null) => void) {
    this.eventFunction[eventName] = onMessage;
  }

  createExchange(
    name: string,
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match',
    options?: amqplib.Options.AssertExchange
  ) {
    return this.channel.assertExchange(name, type, options);
  }

  bindQueueToExchange(queueName: string, exchangeName: string, pattern: string) {
    return this.channel.bindQueue(queueName, exchangeName, pattern);
  }

  publishOnExchange(
    exchangeName: string,
    routingKey: string,
    event: string,
    content: Object,
    options?: amqplib.Options.Publish
  ) {
    const data = this.convertObjectToBuffer({ event, date: new Date(), content });

    this.channel.publish(exchangeName, routingKey, data, options);
  }

  private convertObjectToBuffer(data: Object) {
    return Buffer.from(JSON.stringify(data));
  }

  private parseBufferToJSON(data: Buffer) {
    return JSON.parse(data.toString() as string);
  }
}

export default RabbitMQ.getInstance();
