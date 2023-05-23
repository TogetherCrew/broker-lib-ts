import { IChoreography } from './choreography.interface';
import { Model } from 'mongoose';

export interface ISaga {
  sagaId: string;
  choreography: IChoreography;
  status: string;
  data: any;
  created_at: Date;
  next: (fn: Function) => void;
}

export interface SagaModel extends Model<ISaga> {
  paginate(filter: object, options: object): any;
}
