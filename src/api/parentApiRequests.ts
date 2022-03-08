//parent component related api-requests

import {apiDelete, apiFetch, apiPost, apiPut, getCurrentUserId} from "./apiUtils";

export function getAllParent(): Promise<any> {
    return apiFetch("parent")
}

export function getCurrentParent() {
    return apiFetch("parent/" + getCurrentUserId())
}

export function createJuniorUser(data: {}) {
    return apiPost("parent/createChild", data)
}

export function fetchJuniors(id: string) {
    return apiFetch("parent/children/" + id)
}

export function changePasswordParent(data: {}) {
    return apiPut("parent/changePassword/parent", data)
}

export function changePasswordChild(data: {}) {
    return apiPut("parent/changePassword/child", data)
}

export function fetchChild(id: string) {
    return apiFetch("parent/child/" + id)
}

export function editChild(data: {}) {
    return apiPut("parent/editChild/", data)
}

export function editParent(data: {}) {
    return apiPut("parent/editParent/", data)
}

export function deleteChild(id: string) {
    return apiDelete("parent/deleteChild/" + id)
}

export function deleteParent() {
    return apiDelete("parent/deleteParent/" + getCurrentUserId())
}



//TODO WISH:
export function getWishParent(id: string) {
    return apiFetch("parent/wish/" + id)
}

export function getConfirmedWishlistParent(id: string): Promise<any> {
    return apiFetch("parent/wishlist/" + id)
}

export function reject_WishParent(current_status: string, id: string) {
    return apiPost("parent/wish/reject/", {current_status: current_status, id: id})
}

//TODO TASK:
export function getTaskParent(id: string) {
    return apiFetch("parent/task/" + id)
}

export function getConfirmedTasklistParent(id: string) {
    return apiFetch("parent/tasklist/" + id)
}

export function reject_TaskParent(current_status: string, id: string) {
    return apiPost("parent/task/reject/", {current_status: current_status, id: id})
}

export function getCompleteTasklistParent(id: string) {
    return apiFetch("parent/CompleteTasklist/" + id)
}

export function delete_Task(id: string) {
    return apiPost("parent/task/delete/", {id: id})
}

export function update_Task(id: string, task_name: string, content: string, reward_amount: number) {
    return apiPost("parent/task/update/",
        {id: id, task_name: task_name, content: content, reward_amount: reward_amount})
}


//TODO SKAL HAVE ID'ET MED PÅ DEN JUNIOR-KONTO, SOM OPGAVEN SKAL TILFØJES TIL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//TODO SKAL HAVE ID'ET MED PÅ DEN JUNIOR-KONTO, SOM OPGAVEN SKAL TILFØJES TIL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//TODO SKAL HAVE ID'ET MED PÅ DEN JUNIOR-KONTO, SOM OPGAVEN SKAL TILFØJES TIL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function create_Task(creator_id: string, task_name: string, content: string, reward_amount: number) {
    return apiPost("parent/task/create/", {creator_id: creator_id, task_name: task_name, content: content, reward_amount: reward_amount})
}

//TODO SKAL HAVE ID'ET MED PÅ DEN JUNIOR-KONTO, SOM OPGAVEN SKAL TILFØJES TIL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//TODO SKAL HAVE ID'ET MED PÅ DEN JUNIOR-KONTO, SOM OPGAVEN SKAL TILFØJES TIL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//TODO SKAL HAVE ID'ET MED PÅ DEN JUNIOR-KONTO, SOM OPGAVEN SKAL TILFØJES TIL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
