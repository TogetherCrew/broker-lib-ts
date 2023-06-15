import { ChoreographyDict } from '../../src';

describe('choreography exists', () => {

    describe("DISCORD_UPDATE_CHANNELS", () => {
        it("exists", () => {
            expect(ChoreographyDict.DISCORD_UPDATE_CHANNELS).toBeDefined()
        })
        it("have proper name", () => {
            expect(ChoreographyDict.DISCORD_UPDATE_CHANNELS.name).toBe("DISCORD_UPDATE_CHANNELS")
        })
        it("have expected steps", () => {
            expect(ChoreographyDict.DISCORD_UPDATE_CHANNELS.transactions.length).toBe(2)
        })
    })

    describe("DISCORD_SCHEDULED_JOB", () => {
        it("exists", () => {
            expect(ChoreographyDict.DISCORD_SCHEDULED_JOB).toBeDefined()
        })
        it("have proper name", () => {
            expect(ChoreographyDict.DISCORD_SCHEDULED_JOB.name).toBe("DISCORD_SCHEDULED_JOB")
        })
        it("have expected steps", () => {
            expect(ChoreographyDict.DISCORD_SCHEDULED_JOB.transactions.length).toBe(1)
        })
    })

    describe("DISCORD_FETCH_MEMBERS", () => {
        it("exists", () => {
            expect(ChoreographyDict.DISCORD_FETCH_MEMBERS).toBeDefined()
        })
        it("have proper name", () => {
            expect(ChoreographyDict.DISCORD_FETCH_MEMBERS.name).toBe("DISCORD_FETCH_MEMBERS")
        })
        it("have expected steps", () => {
            expect(ChoreographyDict.DISCORD_FETCH_MEMBERS.transactions.length).toBe(1)
        })
    })
    
})

