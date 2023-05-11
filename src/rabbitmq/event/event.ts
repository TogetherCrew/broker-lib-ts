import { Queue } from "../queue";

// events that will be used in all BOT microservices
enum BotEvent {
    FETCH = "FETCH",
}

// events that will be used in all ANALYTIC microservices
enum AnalyticsEvent {
    RUN = "RUN",
    SAVE = "SAVE"
}

const ServerEvent = {
    UPDATE_GUILD: "UPDATE_GUILD",
}

const DiscordBotEvent = {
    ...BotEvent,
    SEND_MESSAGE: "SEND_MESSAGE"
}

const DiscordAnalyticsEvent = {
    ...AnalyticsEvent
}

export const Event = {
    [Queue.SERVER_API]: ServerEvent,
    [Queue.DISCORD_BOT]: DiscordBotEvent,
    [Queue.DISCORD_ANALYTICS]: DiscordAnalyticsEvent,
} as const
