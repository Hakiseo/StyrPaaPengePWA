//Add all interfaces directly related to parentComponents here

export interface IChildData {
    id: number,
    first_name: string,
    last_name: string,
    age: number,
    username: string,
    reward_balance: number,
    parent_id: number
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

// ------------------------

export interface ICreateJuniorInput {
    firstName: string,
    lastName: string,
    age: number,
    username: string,
    password: string,
    startBalance: number,
    parentId: string,
}

export interface IChangePasswordInput {
    id: string,
    newPassword: string,
    oldPassword?: string
}

export interface IEditChildInput {
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    age: number,
    balance: number
}

export interface IEditParentInput {
    id: string,
    first_name: string,
    last_name: string,
    age: number,
    email: string,
}

export interface IUpdateTaskInput {
    id: string,
    task_name: string,
    content: string,
    reward_amount: number,
    assigned_to: string
}

export interface ICreateTaskInput {
    creator_id: string,
    task_name: string,
    content: string,
    reward_amount: number,
    junior_id: string,
    img: string
}