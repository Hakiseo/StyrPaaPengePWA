//Child component related api-requests

import {apiFetch, apiPost, apiUrl} from "./apiUtils";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}

//Task Calls:
export function getTasklist() {
    return fetch(apiUrl + 'child/tasklist', {
        method: 'GET'
    })
        .then(res => res.json())
    //.then(res => {console.log(res.json()) ; return res.json()})
}


//Wish Calls:
export function getWishlist() {
    return fetch(apiUrl + 'child/wishlist', {
        method: 'GET'
    })
        .then(res => res.json())
        //.then(res => {console.log(res.json()) ; return res.json()})
}

export function getWish(id: string) {
    return fetch(apiUrl + 'child/wish/' + id, {
        method: 'GET'
    })
        .then(res => res.json())
}

export function delete_Wish(id: string) {
    return fetch(apiUrl + 'child/wish/delete/' + id, {
        method: 'POST'
    })
        .then(res => res.json())
}

export function confirm_Wish(current_status: string, id: string) {
    return fetch(apiUrl + 'child/wish/confirm/' + current_status + '/' + id, {
        method: 'POST'
    })
        .then(res => res.json())
}

export function create_Wishlist(saving_name: string, content: string, target_reward_balance: number) {
/*    return fetch(apiUrl + 'child/wishlist/create/' + creator_id + '/' + saving_name + '/' + content + '/' + target_reward_balance, {
        method: 'POST'
    })
        .then(res => res.json())*/
    //TODO: Nat figure out how to get the ID automatically from child without having to set it manually (Not safe to set it manually)
    return apiPost("child/wishlist/create/", {saving_name: saving_name, content: content, target_reward_balance: target_reward_balance})
}