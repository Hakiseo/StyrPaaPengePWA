//parent component related api-requests

import {apiDelete, apiFetch, apiPost, apiPut, getCurrentUserId} from "./apiUtils";
import {
    IChangePasswordInput,
    ICreateJuniorInput, ICreateTaskInput,
    IEditChildInput,
    IEditParentInput, IUpdateTaskInput
} from "../parentComponents/parentInterfaces";

export function getAllParent(): Promise<any> {
    return apiFetch("parent")
}

export function getCurrentParent() {
    return apiFetch("parent/" + getCurrentUserId())
}

export function createJuniorUser(data: ICreateJuniorInput) {
    return apiPost("parent/createChild", data)
}

export function fetchJuniors(id: string) {
    return apiFetch("parent/children/" + id)
}

export function changePasswordParent(data: IChangePasswordInput) {
    return apiPut("parent/changePassword/parent", data)
}

export function changePasswordChild(data: IChangePasswordInput) {
    return apiPut("parent/changePassword/child", data)
}

export function fetchMinimalChild(id: string) {
    return apiFetch("parent/minimal/child/" + id)
}

export function fetchChild(id: string) {
    return apiFetch("parent/child/" + id)
}

export function editChild(data: IEditChildInput) {
    return apiPut("parent/editChild/", data)
}

export function editParent(data: IEditParentInput) {
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

export function getConfirmedWishlistParent(id: string) {
    return apiFetch("parent/wishlist/" + id)
}

export function fetchApprovedWishesParent() {
    return apiFetch("parent/approvedWishes/" + getCurrentUserId())
}

export function reject_WishParent(id: string) {
    return apiPut("parent/wish/reject/", {id: id})
}

export function confirm_WishParent(id: string) {
    return apiPut("parent/wish/confirm/", {id: id})
}

//TODO TASK:
export function getTaskParent(id: string) {
    return apiFetch("parent/task/" + id)
}

export function getConfirmedTasklistParent(id: string) {
    return apiFetch("parent/tasklist/" + id)
}

export function fetchApprovedTasksParent() {
    return apiFetch("parent/approvedTasks/" + getCurrentUserId())
}

export function reject_TaskParent(id: string) {
    return apiPut("parent/task/reject/", {id: id})
}

export function confirm_TaskParent(id: string) {
    return apiPut("parent/task/confirm/", {id: id})
}

export function getCompleteTasklistParent(id: string) {
    return apiFetch("parent/CompleteTasklist/" + id)
}

export function delete_Task(id: string) {
    return apiDelete("parent/task/delete/" + id)
}

export function update_Task(data: IUpdateTaskInput) {
    return apiPut("parent/task/update/",data)
}

export function create_Task(data: ICreateTaskInput) {
    return apiPost("parent/task/create/", data)
}

export function reOpenTask(id: string) {
    return apiPut("parent/reOpenTask/", {id: id})
}

export function fetchChildTaskList(childId: string) {
    return apiFetch("parent/specificTaskList/" + childId)
}