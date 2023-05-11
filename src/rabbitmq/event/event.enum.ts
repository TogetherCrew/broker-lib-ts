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

enum ServerEvent {
    UPDATE_GUILD = "UPDATE_GUILD",
}

enum DiscordBotEvent {
    SEND_MESSAGE = "SEND_MESSAGE"
}

enum DiscordAnalyticsEvent {
}

export const Event = {
    [Queue.SERVER_API]: ServerEvent,
    [Queue.DISCORD_BOT]: DiscordBotEvent,
    [Queue.DISCORD_ANALYTICS]: DiscordAnalyticsEvent,
    "BotEvent": BotEvent,
    "AnalyticsEvent": AnalyticsEvent
} as const
