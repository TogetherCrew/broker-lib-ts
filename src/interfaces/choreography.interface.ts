import { ITransaction } from './transaction.interface';

export interface IChoreography {
  name: string;
  transactions: ITransaction[];
}

export interface IChoreographyDict {
  [key: string]: IChoreography;
}
