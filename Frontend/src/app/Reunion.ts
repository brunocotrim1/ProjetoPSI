import { User } from "./User";

export interface Reunion {
    _id:string;
    members: User[] | any;
    duration: string;
    beginDate: Date;
    endDate: Date;
}