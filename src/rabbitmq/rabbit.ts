import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib'


class RabbitMQ {
    // make the class Singleton
    private static instance: RabbitMQ;
    private constructor(){}
    public static getInstance(): RabbitMQ {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
        }

        return RabbitMQ.instance;
    }

    channel!: Channel
    connection!: Connection;
    private eventFunction: Record<string, any> = {}

    async connect(connectionURL: string, queueName: string, consumeOptions?: amqplib.Options.Consume){
        try {
            const amqpServer = connectionURL
            this.connection = await amqplib.connect(amqpServer)
            console.log("channel was created!")
            this.channel = await this.connection.createChannel()
    
            // make sure that the channel is created, if not this statement will create it
            await this.channel.assertQueue(queueName)

            this.channel.consume(queueName, this.consume, consumeOptions)
            
        } catch (error) {
            console.error("Something went wrong with RabbitMQ", error)
        }
    }

    consume = (msg: ConsumeMessage | null) => {        
        const data = JSON.parse(msg?.content.toString() as string)
        const event = data.event
        
        const eventFunction = this.eventFunction[event]
        if(!eventFunction) {
            console.log("An Event was received that doesn't exist")
            return;
        }

        const isAsync = eventFunction[Symbol.toStringTag] === 'AsyncFunction'
        if(isAsync)
            eventFunction?.()?.then(() => {
                if(msg) this.channel.ack(msg)
            })
        
        else {
            eventFunction?.()
            if(msg) this.channel.ack(msg)
        }
        
    }

    publish(queueName: string, event: string, content: any, options?: amqplib.Options.Publish){
        const data  = Buffer.from(JSON.stringify({event, date: new Date(), content}))
        
        this.channel.sendToQueue(queueName, data, options)
    }

    onEvent(eventName: string, onMessage: (msg: amqplib.ConsumeMessage | null) => void){
        this.eventFunction[eventName] = onMessage
    }

}

export default RabbitMQ.getInstance()
