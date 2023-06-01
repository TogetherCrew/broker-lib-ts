import { Schema } from 'mongoose';
import { v1 as uuidV1 } from 'uuid';
import { ISaga, SagaModel } from '../../interfaces/saga.interface';
import { Status } from '../../enums';
import choreographySchema from './choreography.schema';
import { next, start } from './methods/saga.schema.methods';

const sagaSchema = new Schema<ISaga, SagaModel>(
  {
    sagaId: {
      type: String,
      required: true,
      unique: true,
      default: uuidV1,
    },
    choreography: choreographySchema,
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

sagaSchema.method('next', next);
sagaSchema.method('start', start);

export default sagaSchema;
