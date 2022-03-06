//Add all interfaces directly related to parentComponents here

export interface IWishlist {
    id:string;
    creator_id:string;
    saving_name:string;
    content:string;
    target_reward_balance:string;
    current_status:string;
    img:string;
}

export interface ITasklist {
    id:string;
    task_name:string;
    content:string;
    creator_id:string;
    reward_amount:string;
    assigned_to:string;
    current_status:string;
    created_date_time:string;
    img:string;
}
