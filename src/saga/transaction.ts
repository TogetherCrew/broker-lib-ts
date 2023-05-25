import { Event, Queue, Status } from '../enums';
import { ITransaction } from '../interfaces/transaction.interface';

const DEFAULT_TRANSACTION_PROPERTY = {
  message: undefined,
  start: undefined,
  end: undefined,
  runtime: undefined,
  error: undefined,
};

export const DISCORD_UPDATE_CHANNELS_TRANSACTIONS: ITransaction[] = [
  {
    queue: Queue.DISCORD_BOT,
    event: Event.DISCORD_BOT.FETCH,
    order: 1,
    status: Status.NOT_STARTED,
    ...DEFAULT_TRANSACTION_PROPERTY,
  },
  {
    queue: Queue.DISCORD_ANALYZER,
    event: Event.DISCORD_ANALYZER.RUN,
    order: 2,
    status: Status.NOT_STARTED,
    ...DEFAULT_TRANSACTION_PROPERTY,
  },
  {
    queue: Queue.SERVER_API,
    event: Event.SERVER_API.UPDATE_GUILD,
    order: 3,
    status: Status.NOT_STARTED,
    ...DEFAULT_TRANSACTION_PROPERTY,
  },
];
