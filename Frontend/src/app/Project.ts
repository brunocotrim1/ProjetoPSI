import { Team } from "./Team";

export interface Project {
    _id: string;
    name: string;
    acronym: string;
    linkedTeam: string;
    linkedTasks: Task[] | any;
    beginDate: Date;
    endDate: Date;
}