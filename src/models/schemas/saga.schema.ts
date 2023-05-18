import { Schema } from 'mongoose';
import { v1 as uuidV1 } from 'uuid';
import RabbitMQ from '../../rabbitmq';
import { IChoreography } from '../../interfaces/choreography.interface';
import { ISaga, SagaModel } from '../../interfaces/saga.interface';
import { Status } from '../../enums';
import { ITransaction } from '../../interfaces';

const choreographySchema = new Schema<IChoreography>(
  {
    name: {
      type: String,
      required: true,
    },
    transactions: [
      {
        queue: {
          type: String,
          required: true,
        },
        event: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: Object.values(Status),
          required: true,
        },
        message: {
          type: String,
          required: false,
        },
        start: {
          type: Date,
          required: false,
        },
        end: {
          type: Date,
          required: false,
        },
        runtime: {
          type: Number,
          required: false,
        },
        error: {
          type: String,
          required: false,
        },
      }
    ]
  },
  { _id: false}
)

const sagaSchema = new Schema<ISaga, SagaModel>(
  {
    sagaId: {
      type: String,
      required: true,
      unique: true,
      default: uuidV1
    },
    choreography: choreographySchema,
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    data: {
      type: Map,
      of: String
    },
  },
  { 
    timestamps: true, 
  },
);

sagaSchema.method('next', async function next(publishMethod, fn){
  const saga = this;
  const { choreography, data } = saga;
  const { transactions } = choreography;

  // 1. Find the first transaction (tx) in the saga with the status NOT_STARTED
  transactions.sort((cTx: ITransaction, nTx: ITransaction) => cTx.order < nTx.order ? 1 : -1)
  const currentTx = transactions.find((tx: ITransaction) => tx.status === Status.NOT_STARTED);
  if(!currentTx) return //TODO: should do something


  // 2. Update the tx.status to IN_PROGRESS (save to db)
  currentTx.status = Status.IN_PROGRESS
  currentTx.start = new Date()
  await saga.save()


  // 3. Run the job, surround with try block.
  try {
    const result = await fn()
    // 4b. If ok, set tx.status = COMPLETED
    currentTx.status = Status.SUCCESS
    currentTx.end = new Date()
    currentTx.runtime = currentTx.end.getTime() - currentTx.start.getTime()

    
    // 5. Check if it was the last transaction in the choreography
    const nextTx = transactions.find((tx: ITransaction) => tx.status == Status.NOT_STARTED && tx.order > currentTx.order)
    if (!nextTx) {
      // 6a. If last, update the saga.status = COMPLETED
      saga.status = Status.SUCCESS
    } else {
      // 6b. If not last, publish the next transaction message
      RabbitMQ.publish(nextTx.queue, nextTx.event, { uuid: saga.sagaId, data: result })
    }
    await saga.save()
  
  } catch (error) {
    // 4a. If error is thrown, set tx.error and tx.status = FAILED
    currentTx.error = error as string
    currentTx.status = Status.FAILED
    await saga.save()
    // TODO: should we do anything here?
  }
})

export default sagaSchema;
