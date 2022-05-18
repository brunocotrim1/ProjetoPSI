import { Team } from "./Team";
import { User } from "./User";

export interface Reunion {
    _id: string;
    members: User[] | any;
    beginDate: Date;
    endDate: Date;
    possibleTeam: Team;
}