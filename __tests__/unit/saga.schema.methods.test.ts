import { Event, Queue, Status } from '../../src';
import { next } from '../../src/models/schemas/methods/saga.schema.methods';
import RabbitMQ from '../../src';


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
      () => {}
    );
    expect(a).toBeUndefined();
  });

  it('there is an Error somewhere', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.spyOn(RabbitMQ, 'publish').mockImplementation(() => {})
    const taskFn = jest.fn();
    taskFn.mockRejectedValue('error exists!');

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: '9cb127bf-e00b-44cd-926b-6f293b45ec2e',
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
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 4,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    await next.call(that, taskFn);

    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(publishFn).not.toHaveBeenCalled();
    expect(that.choreography.transactions[2].status).toBe('FAILED');
    expect(that.choreography.transactions[2].error).toBe('error exists!');
  });

  it('There is only one NOT_STARTED transaction', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.spyOn(RabbitMQ, 'publish').mockImplementation(() => {})
    const taskFn = jest.fn(() => ({ key: 'value' }));

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: 'fe50ff46-f2d9-46bf-ae01-a12e01ba2192',
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
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 4,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    await next.call(that, taskFn);

    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(publishFn).not.toHaveBeenCalled();
    expect(that.choreography.transactions[2].status).toBe('SUCCESS');
  });

  it('There is more than one NOT_STARTED transaction', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.spyOn(RabbitMQ, 'publish').mockImplementation(() => {})
    const taskFn = jest.fn(() => ({ key: 'value' }));

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: '6939de77-9ac4-4fd7-bea7-584920a98659',
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
            queue: Queue.SERVER_API,
            event: Event.SERVER_API.UPDATE_GUILD,
            order: 3,
            status: Status.NOT_STARTED,
            ...DEFAULT_TRANSACTION_PROPERTY,
          },
        ],
      },
    };

    await next.call(that, taskFn);

    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith(Queue.SERVER_API, Event.SERVER_API.UPDATE_GUILD, {
      uuid: '6939de77-9ac4-4fd7-bea7-584920a98659',
      data: { key: 'value' },
    });
    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(that.choreography.transactions[1].status).toBe('SUCCESS');
  });
 
});
