import { Event, Queue, Status } from '../enums';
import { ITransaction } from '../interfaces/transaction.interface';

const DEFAULT_TRANSACTION_PROPERTY = {
  status: Status.NOT_STARTED,
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
    ...DEFAULT_TRANSACTION_PROPERTY,
  }
  // { TODO: reactivated later
  //   queue: Queue.SERVER_API,
  //   event: Event.SERVER_API.UPDATE_GUILD,
  //   order: 3,
  //   ...DEFAULT_TRANSACTION_PROPERTY,
  // },
];

export const DISCORD_FETCH_MEMBERS_TRANSACTIONS: ITransaction[] = [
  {
    queue: Queue.DISCORD_BOT,
    event: Event.DISCORD_BOT.FETCH_MEMBERS,
    order: 1,
    ...DEFAULT_TRANSACTION_PROPERTY,
  },
];


export const TWITTER_REFRESH_TRANSACTIONS: ITransaction[] = [
  {
    queue: Queue.TWITTER_BOT,
    event: Event.TWITTER_BOT.EXTRACT.TWEETS,
    order: 1,
    ...DEFAULT_TRANSACTION_PROPERTY
  },
  {
    queue: Queue.TWITTER_BOT,
    event: Event.TWITTER_BOT.EXTRACT.LIKES,
    order: 2,
    ...DEFAULT_TRANSACTION_PROPERTY
  },
  {
    queue: Queue.TWITTER_BOT,
    event: Event.TWITTER_BOT.EXTRACT.PROFILES,
    order: 3,
    ...DEFAULT_TRANSACTION_PROPERTY
  },
  {
    queue: Queue.DISCORD_BOT,
    event: Event.DISCORD_BOT.SEND_MESSAGE,
    order: 4,
    ...DEFAULT_TRANSACTION_PROPERTY
  }
]

export const ANNOUNCEMENT_SEND_MESSAGE_TO_USER_TRANSACTIONS: ITransaction[] = [
  {
    queue: Queue.DISCORD_BOT,
    event: Event.DISCORD_BOT.SEND_MESSAGE_TO_CHANNEL,
    order: 1,
    ...DEFAULT_TRANSACTION_PROPERTY,
  },
  {
    queue: Queue.SERVER_API,
    event: Event.SERVER_API.ANNOUNCEMENT_SAFETY_MESSAGE,
    order: 2,
    ...DEFAULT_TRANSACTION_PROPERTY,
  },
  {
    queue: Queue.DISCORD_BOT,
    event: Event.DISCORD_BOT.SEND_MESSAGE,
    order: 3,
    ...DEFAULT_TRANSACTION_PROPERTY,
  }
]

export const ANNOUNCEMENT_SEND_MESSAGE_TO_CHANNEL_TRANSACTIONS: ITransaction[] = [
  {
    queue: Queue.DISCORD_BOT,
    event: Event.DISCORD_BOT.SEND_MESSAGE_TO_CHANNEL,
    order: 1,
    ...DEFAULT_TRANSACTION_PROPERTY,
  }
]
