import { User } from "./User";

export interface Team {
    _id: string;
    name: string;
    members: User[];
  }