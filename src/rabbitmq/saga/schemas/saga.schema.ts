import { Schema } from 'mongoose';
import validator from 'validator';
import { IUser, UserModel } from '../../interfaces/User.interface';

const sagaSchema = new Schema<IUser, UserModel>(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) throw new Error('Email Address is not valid');
      },
      unique: true,
    },
    verified: {
      type: Boolean,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

export default userSchema;
