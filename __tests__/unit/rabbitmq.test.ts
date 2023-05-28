import { Channel, ConsumeMessage } from 'amqplib';
import RabbitMQ from '../../src';

describe('RabbitMQ', () => {
  describe('consume', () => {
    it('If event does not exist consume function should return undefined', () => {
      const content = Buffer.from(JSON.stringify({ event: 'event', date: new Date(), data: { key: 'value' } }));
      const consumeMessage = { content: content, fields: '', properties: '' };

      expect(RabbitMQ.consume(consumeMessage as unknown as ConsumeMessage)).toBeUndefined();
    });

    it('If event exist consume function should call it (Async)', () => {
      const ackFn = jest.fn()
      const mockChannel = {
        ack: ackFn
      };
      RabbitMQ.channel = mockChannel as unknown as Channel;

      const mockEventCallback = jest.fn(() => console.log('Callback was called'));
      RabbitMQ.onEvent('event', mockEventCallback);

      const content = { event: 'event', date: new Date(), data: { key: 'value' } };
      const buffContent = Buffer.from(JSON.stringify(content));
      const afterBuffContent = JSON.parse(buffContent.toString() as string);
      const consumeMessage = { content: buffContent, fields: '', properties: '' };

      expect(RabbitMQ.consume(consumeMessage as unknown as ConsumeMessage)).toBeUndefined();
      expect(mockEventCallback).toHaveBeenCalledWith(afterBuffContent);
      expect(ackFn).toHaveBeenCalledTimes(1)
    });

    it('If event exist consume function should call it (Sync)', () => {
      const ackFn = jest.fn()
      const mockChannel = {
        ack: ackFn
      };
      RabbitMQ.channel = mockChannel as unknown as Channel;

      const mockEventCallback = jest.fn().mockResolvedValue(() => console.log('Callback was called'));
      RabbitMQ.onEvent('event', mockEventCallback);

      const content = { event: 'event', date: new Date(), data: { key: 'value' } };
      const buffContent = Buffer.from(JSON.stringify(content));
      const afterBuffContent = JSON.parse(buffContent.toString() as string);
      const consumeMessage = { content: buffContent, fields: '', properties: '' };

      expect(RabbitMQ.consume(consumeMessage as unknown as ConsumeMessage)).toBeUndefined();
      expect(mockEventCallback).toHaveBeenCalledWith(afterBuffContent);
      expect(ackFn).toHaveBeenCalledTimes(1)

    });
  });

  it('publishOnExchange', () => {
    const convertObjectToBufferFn = jest.fn(() => ({ description: "returned from to buffer" }))
    const publishFn = jest.fn()
    const that = {
      convertObjectToBuffer: convertObjectToBufferFn,
      channel: {
        publish: publishFn
      }
    }

    RabbitMQ.publishOnExchange.call(that, 'exchangeName', 'routingKey', 'event', { key: "value"})

    expect(convertObjectToBufferFn).toHaveBeenCalledTimes(1)
    expect(convertObjectToBufferFn).toHaveBeenCalledWith({ event: 'event', content: { key: "value" }, date: new Date() })
    
    expect(publishFn).toHaveBeenCalledTimes(1)
    expect(publishFn).toHaveBeenCalledWith("exchangeName", "routingKey", { description: "returned from to buffer" }, undefined)


  });

  it('bindQueueToExchange', () => {
    const bindQueueFn = jest.fn()
    const that = {
      channel: {
        bindQueue: bindQueueFn
      }
    }

    RabbitMQ.bindQueueToExchange.call(that, "queueName", "exchangeName", "pattern")
    expect(bindQueueFn).toHaveBeenCalledTimes(1)
    expect(bindQueueFn).toHaveBeenCalledWith("queueName", "exchangeName", "pattern")
  })

});
