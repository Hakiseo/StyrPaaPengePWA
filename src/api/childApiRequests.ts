//Child component related api-requests

import {apiFetch, apiPost} from "./apiUtils";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}



//TODO CHILD INFO:
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

export function confirm_Task(current_status: string, id: string) {
    return apiPost("child/task/confirm/", {current_status: current_status, id: id})
}

//TODO Wish Calls:
export function getWishlist(id: string) {
    return apiFetch("child/wishlist/" + id)
}

export function getWish(id: string) {
    return apiFetch("child/wish/" + id)
}

export function confirm_Wish(current_status: string, id: string) {
    return apiPost("child/wish/confirm/", {current_status: current_status, id: id})
}

export function update_Wish(id: string, saving_name: string, content: string, target_reward_balance: number) {
    return apiPost("child/wish/update/", {id: id, saving_name: saving_name, content: content, target_reward_balance: target_reward_balance})
}

export function delete_Wish(id: string) {
    return apiPost("child/wish/delete/", {id: id})
}

export function create_Wishlist(creator_id: string, saving_name: string, content: string, target_reward_balance: number) {
    return apiPost("child/wish/create/", {creator_id: creator_id, saving_name: saving_name, content: content, target_reward_balance: target_reward_balance})
}