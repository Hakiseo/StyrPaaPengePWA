//Add all interfaces directly related to parentComponents here

export interface ChildData {
    id: number,
    first_name: string,
    last_name: string,
    age: number,
    username: string,
    reward_balance: number
}

export interface MinimalChildrenData {
    id: number,
    name: string
}

export interface ParentData {
    id: number,
    first_name: string,
    last_name: string,
    age: number,
    email: string,
}