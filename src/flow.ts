// Imagine this flow that when a user changed his/her channels `tc-server should do something` after that `tc-bot should do something` 
// then `tc-analyzer should do something'

import { Status } from "./enums"
import { Queue } from "./rabbitmq"


/* interface of a transaction in a choreography */
interface ITransaction {
    event: Event
    queue: Queue
    status: Status
    order: number 
    message?: any
    start?: Date
    end?: Date
    runtime?: number
    error?: Error
}

interface IChoreography {
    name: string,
    transactions: ITransaction[]
}

/* define the DISCORD_UPDATE_CHANNELS choreography  */
const DISCORD_UPDATE_CHANNELS: IChoreography = {
    name: "DISCORD_UPDATE_CHANNELS",
    transactions: [/* ... */]
}

interface IChoreographyDict { 
    [key: string]: IChoreography
}

/* all available Choreographies, will grow overtime */
const ChoreographyDict: IChoreographyDict = {
    DISCORD_UPDATE_CHANNELS: DISCORD_UPDATE_CHANNELS
}

/* interface of the saga data that will be stored */
interface ISaga {
    uuid: string
    choreography: IChoreography
    status: Status
    data: any
    created_at: Date
    next: () => void
}


/* mongoose schema */
const sagaSchema = new Schema<ISaga>(/* define schema */)

type AnyFunction = (...args: any[]) => any;

sagaSchema.methods.next = (fn: AnyFunction): void => { /* 
    1. Find the first transaction (tx) in the saga with the status NOT_STARTED
    2. Update the tx.status to IN_PROGRESS (save to db)
    3. Run the job, surround with try block.
    4a. If error is thrown, set tx.error and tx.status = FAILED
    4b. If ok, set tx.status = COMPLETED
    5. Check if it was the last transaction in the choreography
    6a. If last, update the saga.status = COMPLETED
    6b. If not last, publish the next transaction message

    Additional notes:
    1. next() should accept any function (fn) and any arguments.
    2. fn() can return data, in this case the data should be passed as an argument in the next message i.e. { uuid, data }
*/ }
