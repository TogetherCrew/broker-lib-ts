import { ConsumeMessage } from 'amqplib';
import RabbitMQ from '../../src';

describe("RabbitMQ", () => {

    it("If event does not exist consume function should return undefined", () => {
        const content = Buffer.from(JSON.stringify({ event: "event", date: new Date(), data: { key: "value" } }))
        const consumeMessage = { content: content, fields: "", properties: ""}

        expect(RabbitMQ.consume(consumeMessage as unknown as ConsumeMessage)).toBeUndefined()
    })
})

