import { Status } from "../../enums";
import { ChoreographyDict } from "./choreography";
import { ISaga } from "./interfaces/saga.interface";
import { DISCORD_UPDATE_CHANNELS_TRANSACTIONS } from './transaction';


const discordUpdateChannel: ISaga = {
    sagaId: "uuid",
    choreography: ChoreographyDict.DISCORD_UPDATE_CHANNELS,
    status: Status.NOT_STARTED,
    data: "any",
    created_at: new Date(),
    next: () => {}
}