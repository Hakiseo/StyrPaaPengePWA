//Child component related api-requests

import {apiFetch, apiPost, apiUrl} from "./apiUtils";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}

//TODO Task Calls:

//TODO SKAL KUN HENTE OPGAVER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
//TODO SKAL KUN HENTE OPGAVER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
export function getTasklist() {
    return fetch(apiUrl + 'child/tasklist', {
        method: 'GET'
    })
        .then(res => res.json())
    //.then(res => {console.log(res.json()) ; return res.json()})
}

export function getTask(id: string) {
    return fetch(apiUrl + 'child/task/' + id, {
        method: 'GET'
    })
        .then(res => res.json())
}

export function confirm_Task(current_status: string, id: string) {
    return apiPost("child/task/confirm/", {
        current_status: current_status,
        id: id
    })
}

//TODO Wish Calls:

//TODO SKAL KUN HENTE ØNSKER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
//TODO SKAL KUN HENTE ØNSKER NED, SOM ER KNYTTET TIL DEN SPECIFIKKE JUNIOR-KONTO!!!!!!!!!!!!!!!
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

export function confirm_Wish(current_status: string, id: string) {
    /*
    return fetch(apiUrl + 'child/wish/confirm/' + current_status + '/' + id, {
        method: 'POST'
    })
        .then(res => res.json())
    */
    return apiPost("child/wish/confirm/", {current_status: current_status, id: id})
}

export function update_Wish(id: string, saving_name: string, content: string, target_reward_balance: number) {
    /*
    return fetch(apiUrl + 'child/wish/delete/' + id, {
        method: 'POST'
    })
        .then(res => res.json())
    */
    return apiPost("child/wish/update/", {id: id, saving_name: saving_name, content: content, target_reward_balance: target_reward_balance})
}

export function delete_Wish(id: string) {
    /*
    return fetch(apiUrl + 'child/wish/delete/' + id, {
        method: 'POST'
    })
        .then(res => res.json())
    */
    return apiPost("child/wish/delete/", {id: id})
}

export function create_Wishlist(creator_id: string, saving_name: string, content: string, target_reward_balance: number) {
    /*
    return fetch(apiUrl + 'child/wishlist/create/' + creator_id + '/' + saving_name + '/' + content + '/' + target_reward_balance, {
        method: 'POST'
    })
        .then(res => res.json())
    */
    return apiPost("child/wish/create/", {creator_id: creator_id, saving_name: saving_name, content: content, target_reward_balance: target_reward_balance})
}