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
      const mockChannel = {
        ack: () => {
          console.log('Ack was called!');
        },
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
    });

    it('If event exist consume function should call it (Sync)', () => {
      const mockChannel = {
        ack: () => {
          console.log('Ack was called!');
        },
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
    });
  });
});
