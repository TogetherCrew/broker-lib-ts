import { Status } from "src/enums";
import { ChoreographyDict } from "./choreography";
import { ISaga } from "./interfaces/saga.interface";
import { DISCORD_UPDATE_CHANNELS_TRANSACTIONS } from './transaction';


const discordUpdateChannel: ISaga = {
    uuid: "uuid",
    choreography: ChoreographyDict.DISCORD_UPDATE_CHANNELS,
    status: Status.PENDING,
    data: "any",
    created_at: new Date(),
    next: () => {}
}