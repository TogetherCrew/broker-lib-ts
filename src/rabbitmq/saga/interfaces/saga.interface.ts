import { Status } from "src/enums"
import { IChoreography } from "./choreography.interface"

export interface ISaga {
    uuid: string
    choreography: IChoreography
    status: Status
    data: any
    created_at: Date
    next: () => void
}
