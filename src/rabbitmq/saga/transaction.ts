import { Queue } from "../queue";
import { Event } from '../event';
import { Status } from "../../enums";
import { ITransaction } from "./interfaces/transaction.interface";

export const DISCORD_UPDATE_CHANNELS_TRANSACTIONS: ITransaction[] = [
    {
        queue: Queue.DISCORD_BOT,
        event: Event.DISCORD_BOT.FETCH,
        order: 1,
        status: Status.NOT_STARTED,
        message: undefined,
        start: undefined,
        end: undefined,
        runtime: undefined,
        error: undefined,
    }
]
