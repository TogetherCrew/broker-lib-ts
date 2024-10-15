import { Queue } from './queue.enum';

// events that will be used in all BOT microservices
enum BotEvent {
  FETCH = 'FETCH',
}

// events that will be used in all ANALYTIC microservices
enum AnalyzerEvent {
  RUN = 'RUN',
  RUN_ONCE = 'RUN_ONCE',
  SAVE = 'SAVE',
}

const ServerEvent = {
  UPDATE_GUILD: 'UPDATE_GUILD',
  ANNOUNCEMENT_SAFETY_MESSAGE: 'ANNOUNCEMENT_SAFETY_MESSAGE',
};

const DiscordBotEvent = {
  ...BotEvent,
  SEND_MESSAGE: 'SEND_MESSAGE',
  SEND_MESSAGE_TO_CHANNEL: 'SEND_MESSAGE_TO_CHANNEL',
  FETCH_MEMBERS: 'FETCH_MEMBERS',
  INTERACTION_RESPONSE: {
    CREATE: 'INTERACTION_RESPONSE_CREATE',
    EDIT: 'INTERACTION_RESPONSE_EDIT',
    DELETE: 'INTERACTION_RESPONSE_DELETE',
  },
  FOLLOWUP_MESSAGE: {
    CREATE: 'FOLLOWUP_CREATE',
  },
};

const DiscordHivemindAdapterEvent = {
  QUESTION_COMMAND_RECIVED: 'QUESTION_COMMAND_RECEIVED',
  QUESTION_RESPONSE_RECIVED: 'QUESTION_RESPONSE_RECEIVED',
};

const DiscordAnalyzerEvent = {
  ...AnalyzerEvent,
};

const TwitterBotEvent = {
  EXTRACT: {
    TWEETS: 'EXTRACT_TWEETS',
    LIKES: 'EXTRACT_LIKES',
    PROFILES: 'EXTRACT_PROFILES',
  },
  SEND_MESSAGE: 'SEND_MESSAGE',
};

const HivemindEvent = {
  QUESTION_RECIVED: 'QUESTION_RECEIVED',
};

export const Event = {
  [Queue.SERVER_API]: ServerEvent,
  [Queue.DISCORD_BOT]: DiscordBotEvent,
  [Queue.DISCORD_ANALYZER]: DiscordAnalyzerEvent,
  [Queue.DISCORD_HIVEMIND_ADAPTER]: DiscordHivemindAdapterEvent,
  [Queue.TWITTER_BOT]: TwitterBotEvent,
  [Queue.HIVEMIND]: HivemindEvent,
} as const;
