//Child component related api-requests

import {apiFetch, apiUrl} from "./apiUtils";

export function getAllChildren(): Promise<any> {
    return apiFetch("child")
}

export async function getWishlist() {
    return fetch(apiUrl + 'get-wishlist', {
        method: 'GET'
    })
        .then(res => res.json())
}