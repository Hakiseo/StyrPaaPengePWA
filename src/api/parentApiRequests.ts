//parent component related api-requests

import {apiFetch, apiPost, apiUrl} from "./apiUtils";

export function getAllParent(): Promise<any> {
    return apiFetch("parent")
}

//Make post parent properly
export function postParent() {
    apiPost("parent", {data: "tester"})
}

export function createJuniorUser(data: {}) {
    return apiPost("parent/createChild", data)
}






//TODO WISH-TESTER!!!!!!!:
export function getWishlistTEST() {
    return fetch(apiUrl + 'parent/wishlist', {
        method: 'GET'
    })
        .then(res => res.json())
}

//TODO TASK-TESTER!!!!!!!:
export function getTasklistTEST() {
    return fetch(apiUrl + 'parent/tasklist', {
        method: 'GET'
    })
        .then(res => res.json())
}

//TODO getCompleteTasklist-TESTER!!!!!!!:
export function getCompleteTasklistTEST() {
    return fetch(apiUrl + 'parent/CompleteTasklist', {
        method: 'GET'
    })
        .then(res => res.json())
}


//TODO WISH:
//export function getWishlist(id: string): Promise<any> {
    //return apiFetch("parent/wishlist/" + id)
export function getWishlist(id: string) {
    return fetch(apiUrl + 'parent/wishlist' + id, {
        method: 'GET'
    })
        .then(res => res.json())
}

export function reject_Wish(current_status: string, id: string) {
    return apiPost("parent/wish/reject/", {current_status: current_status, id: id})
}

//TODO TASK:
export function getTasklist(id: string) {
    return fetch(apiUrl + 'parent/tasklist' + id, {
        method: 'GET'
    })
        .then(res => res.json())
}

export function reject_Task(current_status: string, id: string) {
    return apiPost("parent/task/reject/", {current_status: current_status, id: id})
}

export function getCompleteTasklist(id: string) {
    return fetch(apiUrl + 'parent/CompleteTasklist' + id, {
        method: 'GET'
    })
        .then(res => res.json())
}
