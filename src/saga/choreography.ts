import { IChoreography } from '../interfaces/choreography.interface';
import {
  DISCORD_FETCH_MEMBERS_TRANSACTIONS,
  DISCORD_SCHEDULED_JOB_TRANSACTIONS,
  DISCORD_UPDATE_CHANNELS_TRANSACTIONS,
} from './transaction';

/* define the DISCORD_UPDATE_CHANNELS choreography  */
const DISCORD_UPDATE_CHANNELS: IChoreography = {
  name: 'DISCORD_UPDATE_CHANNELS',
  transactions: DISCORD_UPDATE_CHANNELS_TRANSACTIONS,
};

/* define the DISCORD_SCHEDULED_JOB choreography  */
const DISCORD_SCHEDULED_JOB: IChoreography = {
  name: 'DISCORD_SCHEDULED_JOB',
  transactions: DISCORD_SCHEDULED_JOB_TRANSACTIONS,
};

const DISCORD_FETCH_MEMBERS: IChoreography = {
  name: 'DISCORD_FETCH_MEMBERS',
  transactions: DISCORD_FETCH_MEMBERS_TRANSACTIONS,
};

/* all available Choreographies, will grow overtime */
export const ChoreographyDict = {
  DISCORD_UPDATE_CHANNELS,
  DISCORD_SCHEDULED_JOB,
  DISCORD_FETCH_MEMBERS,
} as const;
