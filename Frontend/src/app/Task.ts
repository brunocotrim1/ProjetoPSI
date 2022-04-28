export interface Task {
    _id:string;
    name: string;
    userAssociated: string;
    progress: number;
    priority: string;
    beginDate: Date;
    endDate: Date;
}