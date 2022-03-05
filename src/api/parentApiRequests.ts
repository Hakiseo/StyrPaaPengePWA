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

export function fetchJuniors(id: number) {
    return apiFetch("parent/children/" + id)
}