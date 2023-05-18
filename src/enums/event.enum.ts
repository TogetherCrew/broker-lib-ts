import { Queue } from "./queue.enum"

// events that will be used in all BOT microservices
enum BotEvent {
    FETCH = "FETCH",
}

// events that will be used in all ANALYTIC microservices
enum AnalyzerEvent {
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

const DiscordAnalyzerEvent = {
    ...AnalyzerEvent
}

export const Event = {
    [Queue.SERVER_API]: ServerEvent,
    [Queue.DISCORD_BOT]: DiscordBotEvent,
    [Queue.DISCORD_ANALYZER]: DiscordAnalyzerEvent,
} as const
