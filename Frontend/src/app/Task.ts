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
<<<<<<< HEAD
    checklist: Map<string,boolean>;
=======
    state: string;
>>>>>>> c7d037b562acc788efa2c893d8736c877cc26a5f
}