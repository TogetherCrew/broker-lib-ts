import { Status } from "src/enums"
import { Queue } from "../../queue"

export interface ITransaction {
    queue: Queue
    event: string
    order: number 
    status: Status
    message?: any
    start?: Date
    end?: Date
    runtime?: number
    error?: Error
}