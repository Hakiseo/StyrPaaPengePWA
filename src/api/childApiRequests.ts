//Child component related api-requests

import {apiFetch, apiUrl} from "./apiUtils";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}

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