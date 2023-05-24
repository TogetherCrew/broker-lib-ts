import { IChoreography, IChoreographyDict } from '../interfaces/choreography.interface';
import { DISCORD_UPDATE_CHANNELS_TRANSACTIONS } from './transaction';

/* define the DISCORD_UPDATE_CHANNELS choreography  */
const DISCORD_UPDATE_CHANNELS: IChoreography = {
  name: 'DISCORD_UPDATE_CHANNELS',
  transactions: DISCORD_UPDATE_CHANNELS_TRANSACTIONS,
};

/* all available Choreographies, will grow overtime */
export const ChoreographyDict: IChoreographyDict = {
  DISCORD_UPDATE_CHANNELS: DISCORD_UPDATE_CHANNELS,
} as const;
