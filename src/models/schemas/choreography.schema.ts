import { Schema } from 'mongoose';
import { Status } from '../../enums';
import { IChoreography } from '../../interfaces';

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
          // TODO: add unique for order field
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
      },
    ],
  },
  { _id: false }
);

export default choreographySchema;
