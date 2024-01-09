import { ChoreographyDict, IChoreography } from '../../src';

function checkChoreography(
  choreography: IChoreography,
  toBe: { choreographyName: string; transactionsLength: number }
) {
  it('exists', () => {
    expect(choreography).toBeDefined();
  });

  it('have proper name', () => {
    expect(choreography.name).toBe(toBe.choreographyName);
  });

  it('have expected steps', () => {
    expect(choreography.transactions.length).toBe(toBe.transactionsLength);
  });
}

describe('choreography exists', () => {
  describe('DISCORD_UPDATE_CHANNELS', () => {
    checkChoreography(ChoreographyDict.DISCORD_UPDATE_CHANNELS, {
      choreographyName: 'DISCORD_UPDATE_CHANNELS',
      transactionsLength: 3,
    });
  });

  describe('DISCORD_SCHEDULED_JOB', () => {
    checkChoreography(ChoreographyDict.DISCORD_SCHEDULED_JOB, {
      choreographyName: 'DISCORD_SCHEDULED_JOB',
      transactionsLength: 1,
    });
  });

  describe('DISCORD_FETCH_MEMBERS', () => {
    checkChoreography(ChoreographyDict.DISCORD_FETCH_MEMBERS, {
      choreographyName: 'DISCORD_FETCH_MEMBERS',
      transactionsLength: 1,
    });
  });

  describe('ANNOUNCEMENT_SEND_MESSAGE_TO_USER', () => {
    checkChoreography(ChoreographyDict.ANNOUNCEMENT_SEND_MESSAGE_TO_USER, {
      choreographyName: 'ANNOUNCEMENT_SEND_MESSAGE_TO_USER',
      transactionsLength: 1,
    });
  });

  describe('ANNOUNCEMENT_SEND_MESSAGE_TO_CHANNEL', () => {
    checkChoreography(ChoreographyDict.ANNOUNCEMENT_SEND_MESSAGE_TO_CHANNEL, {
      choreographyName: 'ANNOUNCEMENT_SEND_MESSAGE_TO_CHANNEL',
      transactionsLength: 1,
    });
  });
});
