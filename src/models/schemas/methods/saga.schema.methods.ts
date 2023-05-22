import { Status } from '../../../enums';
import { ITransaction } from '../../../interfaces';

export async function next(publishMethod: (queueName: string, event: string, content: Object) => void, fn: () => any) {
  // @ts-ignore
  const saga = this;
  const { choreography, data } = saga;
  const { transactions } = choreography;

  // 1. Find the first transaction (tx) in the saga with the status NOT_STARTED
  transactions.sort((cTx: ITransaction, nTx: ITransaction) => (cTx.order > nTx.order ? 1 : -1));
  const currentTx = transactions.find((tx: ITransaction) => tx.status === Status.NOT_STARTED);
  if (!currentTx) return; //TODO: should do something

  // 2. Update the tx.status to IN_PROGRESS (save to db)
  currentTx.status = Status.IN_PROGRESS;
  currentTx.start = new Date();
  await saga.save();

  // 3. Run the job, surround with try block.
  try {
    const result = await fn();
    // 4b. If ok, set tx.status = COMPLETED
    currentTx.status = Status.SUCCESS;
    currentTx.end = new Date();
    currentTx.runtime = currentTx.end.getTime() - currentTx.start.getTime();

    // 5. Check if it was the last transaction in the choreography
    const nextTx = transactions.find(
      (tx: ITransaction) => tx.status == Status.NOT_STARTED && tx.order > currentTx.order
    );
    if (!nextTx) {
      // 6a. If last, update the saga.status = COMPLETED
      saga.status = Status.SUCCESS;
    } else {
      // 6b. If not last, publish the next transaction message
      publishMethod(nextTx.queue, nextTx.event, { uuid: saga.sagaId, data: result });
    }
    await saga.save();
  } catch (error) {
    // 4a. If error is thrown, set tx.error and tx.status = FAILED
    currentTx.error = error as string;
    currentTx.status = Status.FAILED;
    await saga.save();
    // TODO: should we do anything here?
  }
}
