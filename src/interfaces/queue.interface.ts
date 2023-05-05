import { Status } from '../enums';

export interface Queue {
    name: string
    description: string
    status: Status
    message: any
    start: Date
    end: Date
    runtime: number
    error: Error
}