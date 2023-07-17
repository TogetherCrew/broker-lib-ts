import RabbitMQ from '../../../rabbitmq';
import { Status } from '../../../enums';
import { ISaga, ITransaction } from '../../../interfaces';

export async function start() {
  // @ts-ignore
  const saga = this;
  const {
    choreography: { transactions },
  }: ISaga = saga;

  sortTransactions(transactions);
  const firstTx = transactions[0];

  startSaga(saga);
  saga.save();

  RabbitMQ.publish(firstTx.queue, firstTx.event, { uuid: saga.sagaId });
}

export async function next(fn: () => any) {
  // @ts-ignore
  const saga = this;
  const {
    choreography: { transactions },
    data,
  }: ISaga = saga;

  // 1. Find the first transaction (tx) in the saga with the status NOT_STARTED
  sortTransactions(transactions);
  const currentTx = findFirstNotStartedTransaction(transactions);
  if (!currentTx) return; //TODO: should do something

  // 2. Update the tx.status to IN_PROGRESS (save to db)
  startTransaction(currentTx);

  await saga.save();

  // 3. Run the job, surround with try block.
  try {
    const result = await fn();
    // 4b. If ok, set tx.status = COMPLETED and evaluate time
    endSuccessfulTransaction(currentTx);

    // 5. Check if it was the last transaction in the choreography
    const nextTx = findNextNotStartedTransaction(currentTx, transactions);
    if (!nextTx) {
      // 6a. If last, update the saga.status = COMPLETED
      endSuccessfulSaga(saga);
    } else {
      // 6b. If not last, publish the next transaction message
      RabbitMQ.publish(nextTx.queue, nextTx.event, { uuid: saga.sagaId, data: result });
    }
    await saga.save();
  } catch (error) {
    // 4a. If error is thrown, set tx.error and tx.status = FAILED
    endFailedTransaction(currentTx, error);
    endFailedSaga(saga);

    await saga.save();
    // TODO: should we do anything here?
  }
}

/**
 * sort transactions in place with reference
 * @param transaction
 */
function sortTransactions(transactions: ITransaction[]) {
  transactions.sort((cTx: ITransaction, nTx: ITransaction) => (cTx.order > nTx.order ? 1 : -1));
}

function findFirstNotStartedTransaction(sortedTransactions: ITransaction[]) {
  const transaction = sortedTransactions.find((tx: ITransaction) => tx.status === Status.NOT_STARTED);

  return transaction;
}

function findNextNotStartedTransaction(currentTransaction: ITransaction, sortedTransactions: ITransaction[]) {
  const nextTransactions = sortedTransactions.find(
    (tx: ITransaction) => tx.status == Status.NOT_STARTED && tx.order > currentTransaction.order
  );

  return nextTransactions;
}

/**
 * update Saga with reference
 * @param saga pass an object of type ISaga
 */
function startSaga(saga: ISaga) {
  saga.status = Status.IN_PROGRESS;
}

/**
 * update Saga with reference
 * @param saga pass an object of type ISaga
 */
function endSuccessfulSaga(saga: ISaga) {
  saga.status = Status.SUCCESS;
}

/**
 * update Saga with reference
 * @param saga pass an object of type ISaga
 */
function endFailedSaga(saga: ISaga) {
  saga.status = Status.FAILED;
}

/**
 * update transaction with reference
 * @param transaction pass an object of type Itransaction
 */
function startTransaction(transaction: ITransaction) {
  transaction.status = Status.IN_PROGRESS;
  transaction.start = new Date();
}

/**
 * update transaction with reference
 * @param transaction pass an object of type Itransaction
 */
function endSuccessfulTransaction(transaction: ITransaction) {
  transaction.status = Status.SUCCESS;
  transaction.end = new Date();
  // we are sure that `transaction.start` is not undefined
  transaction.runtime = transaction.end.getTime() - transaction.start!.getTime();
}

/**
 * update transaction with reference
 * @param transaction pass an object of type Itransaction
 */
function endFailedTransaction(transaction: ITransaction, error: any) {
  transaction.error = error as string;

  if (transaction.status != Status.SUCCESS) transaction.status = Status.FAILED;
}
