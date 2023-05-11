export * from './queue.interface'

export * from './workflow.interface'


enum Queue {
    SERVER_API = "SERVER_API",
    DISCORD_BOT = "DISCORD_BOT",
    DISCORD_ANALYTICS = "DISCORD_ANALYTICS"
}

enum BotEvent {
    FETCH = "FETCH",
}

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

const Event = {
    [Queue.SERVER_API]: ServerEvent,
    [Queue.DISCORD_BOT]: DiscordBotEvent,
    [Queue.DISCORD_ANALYTICS]: DiscordAnalyticsEvent,
    "BotEvent": BotEvent,
    "AnalyticsEvent": AnalyticsEvent
}

interface EventMessage {
    event: ServerEvent | DiscordBotEvent | DiscordAnalyticsEvent,
    date: Date,
    content: Record<string, any>
}
