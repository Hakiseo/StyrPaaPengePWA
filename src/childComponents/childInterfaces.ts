//Add all interfaces directly related to childComponents here

export interface IAccountInfo {
    first_name:string;
    last_name:string;
    age:string;
    reward_balance:number;
}

export interface UpdateWishInput {
    id: string,
    saving_name: string,
    content: string,
    target_reward_balance: number
}

export interface CreateWishInput {
    creator_id: string,
    saving_name: string,
    content: string,
    target_reward_balance: number
}