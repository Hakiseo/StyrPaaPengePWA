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
}
