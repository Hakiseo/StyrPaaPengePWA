//Add all interfaces directly related to parentComponents here

export interface IChildData {
    id: number,
    first_name: string,
    last_name: string,
    age: number,
    username: string,
    reward_balance: number
}

export interface IMinimalChildrenData {
    id: number,
    firstName: string,
    lastName: string
}

export interface IParentData {
    id: number,
    first_name: string,
    last_name: string,
    age: number,
    email: string,
}

export interface ITaskCreate {
    creator_id: string,
    task_name: string,
    content: string,
    reward_amount: number,
    junior_id: number,
    img: string
}

export enum ApprovedType {
    wish,
    task
}