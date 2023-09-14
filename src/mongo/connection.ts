import mongoose, { Connection } from 'mongoose';
import { sagaSchema } from '../models';
import { ISaga } from '../interfaces';

class MBConnection {
  // make the class Singleton
  private static instance: MBConnection;
  private constructor() {}
  public static getInstance(): MBConnection {
    if (!MBConnection.instance) {
      MBConnection.instance = new MBConnection();
    }

    return MBConnection.instance;
  }

  connectionUri!: string;

  connect(uri: string) {
    this.connectionUri = uri;
    // TODO: check if connection is success 
  }

  get models() {
    const connectionUri = this.connectionUri;
    if (!connectionUri) throw 'You must call Connect function first.';

    const connection = mongoose.createConnection(connectionUri, { dbName: 'Saga' });
    connection.model<ISaga>('Saga', sagaSchema);

    return connection.models;
  }
}

export default MBConnection.getInstance();
