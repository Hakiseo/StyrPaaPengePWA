//Child component related api-requests

import {apiFetch, apiPost} from "./apiUtils";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}

//TODO Task Calls:
//TODO SKAL KUN HENTE OPGAVER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
export function getTasklist() {
    return apiFetch("child/tasklist")
}

//TODO SKAL KUN HENTE ØNSKER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
export function getTask(id: string) {
    return apiFetch("child/task/" +id)
}

export function confirm_Task(current_status: string, id: string) {
    return apiPost("child/task/confirm/", {current_status: current_status, id: id})
}

//TODO Wish Calls:
//TODO SKAL KUN HENTE ØNSKER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
export function getWishlist() {
    return apiFetch("child/wishlist")
}

//TODO SKAL KUN HENTE ØNSKER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
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