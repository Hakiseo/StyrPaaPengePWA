//parent component related api-requests

import {apiFetch, apiPost} from "./apiUtils";

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



//TODO WISH:
export function getWishParent(id: string) {
    return apiFetch("parent/wish/" + id)
}

export function getWishlistParent(id: string): Promise<any> {
    return apiFetch("parent/wishlist/" + id)
}

export function reject_WishParent(current_status: string, id: string) {
    return apiPost("parent/wish/reject/", {current_status: current_status, id: id})
}

//TODO TASK:
export function getTasklistParent(id: string) {
    return apiFetch("parent/tasklist/" + id)
}

export function reject_TaskParent(current_status: string, id: string) {
    return apiPost("parent/task/reject/", {current_status: current_status, id: id})
}

export function getCompleteTasklistParent(id: string) {
    return apiFetch("parent/CompleteTasklist/" + id)
}
