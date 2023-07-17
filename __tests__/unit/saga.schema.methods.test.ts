import { Event, Queue, Status } from '../../src';
import { next, start } from '../../src/models/schemas/methods/saga.schema.methods';
import RabbitMQ from '../../src';

const DEFAULT_TRANSACTION_PROPERTY = {
  message: undefined,
  start: undefined,
  end: undefined,
  runtime: undefined,
  error: undefined,
};

const discordBotFetchTransaction = (order: number, status: Status) => ({
  queue: Queue.DISCORD_BOT,
  event: Event.DISCORD_BOT.FETCH,
  order: order,
  status: status,
  ...DEFAULT_TRANSACTION_PROPERTY,
});

const discordAnalyzerRunTransaction = (order: number, status: Status) => ({
  queue: Queue.DISCORD_ANALYZER,
  event: Event.DISCORD_ANALYZER.RUN,
  order: order,
  status: status,
  ...DEFAULT_TRANSACTION_PROPERTY,
});

const serverApiUpdateGuildTransaction = (order: number, status: Status) => ({
  queue: Queue.SERVER_API,
  event: Event.SERVER_API.UPDATE_GUILD,
  order: order,
  status: status,
  ...DEFAULT_TRANSACTION_PROPERTY,
});

describe('Next function ( saga.next() )', () => {
  let saveFn: jest.Mock;
  let publishFn: jest.SpyInstance;
  let taskFn: jest.Mock;
  beforeEach(() => {
    saveFn = jest.fn();
    publishFn = jest.spyOn(RabbitMQ, 'publish').mockImplementation(() => {});
    taskFn = jest.fn(() => ({ key: 'value' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('There is no NOT_STARTED transaction', async () => {
    const that: Record<string, any> = {
      choreography: {
        transactions: [
          discordBotFetchTransaction(1, Status.SUCCESS),
          discordAnalyzerRunTransaction(2, Status.SUCCESS),
          serverApiUpdateGuildTransaction(3, Status.SUCCESS),
        ],
      },
    };

    const a = await next.call(that, () => {});
    expect(a).toBeUndefined();
  });

  it('there is an Error somewhere', async () => {
    taskFn.mockRejectedValue('error exists!');

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: '9cb127bf-e00b-44cd-926b-6f293b45ec2e',
      choreography: {
        transactions: [
          discordBotFetchTransaction(1, Status.SUCCESS),
          discordAnalyzerRunTransaction(2, Status.SUCCESS),
          serverApiUpdateGuildTransaction(3, Status.NOT_STARTED),
        ],
      },
    };

    await next.call(that, taskFn);

    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(that.choreography.transactions[2].status).toBe('FAILED');
    expect(publishFn).not.toHaveBeenCalled();
    expect(that.choreography.transactions[2].error).toBe('error exists!');
    expect(saveFn).toHaveBeenCalledTimes(2);
  });

  it('There is only one NOT_STARTED transaction', async () => {
    const that: Record<string, any> = {
      save: saveFn,
      sagaId: 'fe50ff46-f2d9-46bf-ae01-a12e01ba2192',
      choreography: {
        transactions: [
          discordBotFetchTransaction(1, Status.SUCCESS),
          discordAnalyzerRunTransaction(2, Status.SUCCESS),
          serverApiUpdateGuildTransaction(4, Status.NOT_STARTED),
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
    const that: Record<string, any> = {
      save: saveFn,
      sagaId: '6939de77-9ac4-4fd7-bea7-584920a98659',
      choreography: {
        transactions: [
          discordBotFetchTransaction(1, Status.SUCCESS),
          discordAnalyzerRunTransaction(2, Status.NOT_STARTED),
          serverApiUpdateGuildTransaction(3, Status.NOT_STARTED),
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

describe('Start function ( saga.start() )', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('`start` function should work as expected', async () => {
    const saveFn = jest.fn();
    const publishFn = jest.spyOn(RabbitMQ, 'publish').mockImplementation(() => {});

    const that: Record<string, any> = {
      save: saveFn,
      sagaId: '1139de77-9ac4-9dd7-bea7-334920a98659',
      choreography: {
        transactions: [
          discordBotFetchTransaction(1, Status.NOT_STARTED),
          discordAnalyzerRunTransaction(2, Status.NOT_STARTED),
          serverApiUpdateGuildTransaction(3, Status.NOT_STARTED),
        ],
      },
    };

    await start.call(that);

    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith(Queue.DISCORD_BOT, Event.DISCORD_BOT.FETCH, {
      uuid: '1139de77-9ac4-9dd7-bea7-334920a98659',
    });
  });
});
