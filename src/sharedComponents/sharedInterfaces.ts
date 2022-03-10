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

export enum IUserType {
    parent = "parent",
    child = "child"
}

export interface ICustomErrorHandling {
    errorMessage: string
    validated: () => boolean
}