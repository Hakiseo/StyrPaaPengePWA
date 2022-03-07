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
