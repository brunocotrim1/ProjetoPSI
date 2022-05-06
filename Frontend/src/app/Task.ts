import { Project } from "./Project";
import { User } from "./User";

export interface Task {
    _id:string;
    name: string;
    usersAssigned: User[] | any;
    progress: number;
    priority: string;
    linkedProject: Project;
    beginDate: Date;
    endDate: Date;
}