import { Status } from '../enums';
import { Queue } from './queue.interface'

export interface Workflow {
    uuid?: string
    name: string
    status: Status
    data: any
    sequence: Queue[]
}