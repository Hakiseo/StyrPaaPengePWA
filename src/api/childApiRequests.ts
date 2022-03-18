//Child component related api-requests

import {apiDelete, apiFetch, apiPost, apiPut, getCurrentUserId} from "./apiUtils";
import {ICreateWishInput, IUpdateWishInput} from "../childComponents/childInterfaces";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}

export function getChildInfo(id: string) {
    return apiFetch("child/account/info/" + id)
}

//TODO Task Calls:
export function getAssignedTasklist(id: string) {
    return apiFetch("child/tasklist/" + id)
}

export function getTask(id: string) {
    return apiFetch("child/task/" + id)
}

export function retract_Task(id: string) {
    return apiPut("child/task/retract/", {id: id})
}

export function confirm_Task(id: string) {
    return apiPut("child/task/confirm/", {id: id})
}

//TODO Wish Calls:
export function getWishlist(id: string) {
    return apiFetch("child/wishlist/" + id)
}

export function getWish(id: string) {
    return apiFetch("child/wish/" + id)
}

export function fetchApprovedWishesChild() {
    return apiFetch("child/approvedWishes/" + getCurrentUserId())
}

export function retract_Wish(id: string) {
    return apiPut("child/wish/retract/", {id: id})
}

export function confirm_Wish(id: string) {
    return apiPut("child/wish/confirm/", {id: id})
}

export function update_Wish(data: IUpdateWishInput) {
    return apiPut("child/wish/update/", data)
}

export function delete_Wish(id: string) {
    return apiDelete("child/wish/delete/" + id)
}

export function create_Wishlist(data: ICreateWishInput) {
    return apiPost("child/wish/create/", data)
}