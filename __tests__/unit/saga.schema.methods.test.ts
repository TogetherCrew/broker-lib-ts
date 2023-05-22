import { Event, Queue, Status } from '../../src';
import { next } from '../../src/models/schemas/methods/saga.schema.methods';

const DEFAULT_TRANSACTION_PROPERTY = {
  message: undefined,
  start: undefined,
  end: undefined,
  runtime: undefined,
  error: undefined,
};

describe('Next function ( saga.next() )', () => {
  it('There is no NOT_STARTED transaction', async () => {
    const that: Record<string, any> = {
      choreography: {
        transactions: [
          {
            queue: Queue.DISCORD_BOT,
            event: Event.DISCORD_BOT.FETCH,
            order: 1,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.RUN,
            order: 2,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.SAVE,
            order: 2,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 2,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    const a = await next.call(
      that,
      (a: any, b: any, c: any) => {},
      () => {}
    );
    expect(a).toBeUndefined();
  });

  it('There is more than one NOT_STARTED transaction', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.fn();
    const taskFn = jest.fn(() => ({ key: 'value' }));

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: 'sample-uuid',
      choreography: {
        transactions: [
          {
            queue: Queue.DISCORD_BOT,
            event: Event.DISCORD_BOT.FETCH,
            order: 1,
            status: Status.SUCCESS,
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
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.SAVE,
            order: 3,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 4,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    await next.call(that, publishFn, taskFn);

    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith(Queue.DISCORD_ANALYZER, Event.DISCORD_ANALYZER.SAVE, {
      uuid: 'sample-uuid',
      data: { key: 'value' },
    });
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(that.choreography.transactions[1].status).toBe('SUCCESS');
  });

  it('There is only one NOT_STARTED transaction', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.fn();
    const taskFn = jest.fn(() => ({ key: 'value' }));

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: 'sample-uuid',
      choreography: {
        transactions: [
          {
            queue: Queue.DISCORD_BOT,
            event: Event.DISCORD_BOT.FETCH,
            order: 1,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.RUN,
            order: 2,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.SAVE,
            order: 3,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 4,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    await next.call(that, publishFn, taskFn);

    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(publishFn).not.toHaveBeenCalled();
    expect(that.choreography.transactions[3].status).toBe('SUCCESS');
  });

  it('there is an Error somewhere', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.fn();
    const taskFn = jest.fn();
    taskFn.mockRejectedValue('error exists!');

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: 'sample-uuid',
      choreography: {
        transactions: [
          {
            queue: Queue.DISCORD_BOT,
            event: Event.DISCORD_BOT.FETCH,
            order: 1,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.RUN,
            order: 2,
            status: Status.SUCCESS,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.DISCORD_ANALYZER,
            event: Event.DISCORD_ANALYZER.SAVE,
            order: 3,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
          {
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 4,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    await next.call(that, publishFn, taskFn);

    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(publishFn).not.toHaveBeenCalled();
    expect(that.choreography.transactions[2].status).toBe('FAILED');
    expect(that.choreography.transactions[2].error).toBe('error exists!');
  });
});
