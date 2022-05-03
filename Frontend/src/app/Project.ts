import { Team } from "./Team";

export interface Project {
    _id: string;
    name: string;
    acronym: string;
    linkedTeam: string;
    beginDate: Date;
    endDate: Date;
}