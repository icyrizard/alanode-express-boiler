import { Request } from "express";
import { FileArray } from "express-fileupload";

export interface Params {
    [key: string]: any;
}

export type Task = () => Promise<any>;
export type TaskList = Array<Task[]>