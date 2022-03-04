//Add all interfaces for general use here (If an interface is used in both child & parent add it here)

export interface ApiResponse {
    results: any[] | null,
    error: string | null
}

export interface VerifyTokenResponse {
    success: boolean,
    error: string | null,
    userType: string
}

export enum UserType {
    parent = "parent",
    child = "child"
}