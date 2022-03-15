//Add all interfaces for general use here (If an interface is used in both child & parent add it here)

export interface IApiResponse {
    results: any[] | null,
    error: string | null
}

export interface IVerifyTokenResponse {
    success: boolean,
    error: string | null,
    userType: string
}

export interface ICustomErrorHandling {
    errorMessage: string | undefined
    validated: () => boolean
}

//TODO: Why is everything strings? Is easier to work with but we are misinterpreting the data
export interface ITasklist {
    id:string,
    task_name:string,
    content:string,
    creator_id:string,
    reward_amount:string,
    assigned_to:string,
    current_status:string,
    done_status:string,
    created_date_time:string,
    img:string,
}

//TODO: Why is everything strings? Is easier to work with but we are misinterpreting the data
export interface IWishlist {
    id:string,
    creator_id:string,
    saving_name:string,
    content:string,
    target_reward_balance:string,
    current_status:string,
    done_status:string,
    img:string,
}

export enum UserType {
    parent = "parent",
    child = "child"
}

export enum InputType {
    text = "text",
    password = "password",
    email = "email",
    number = "number"
}

export enum ButtonType {
    back = "Back",
    confirm = "Confirm",
    delete = "Delete",
    cancel = "Cancel"
}