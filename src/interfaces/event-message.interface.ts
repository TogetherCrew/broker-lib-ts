export interface EventMessage {
    event: string,
    date: Date,
    content: Record<string, any>
}
