//parent component related api-requests

import {apiFetch, apiPost, apiPut, getCurrentUserId} from "./apiUtils";

export function getAllParent(): Promise<any> {
    return apiFetch("parent")
}

export function getCurrentParent() {
    return apiFetch("parent/" + getCurrentUserId())
}

export function createJuniorUser(data: {}) {
    return apiPost("parent/createChild", data)
}

export function fetchJuniors(id: number) {
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