//parent component related api-requests

import {apiFetch, apiPost} from "./apiUtils";

export function getAllParent(): Promise<any> {
    return apiFetch("parent")
}

export function postParent() {
    apiPost("parent")
}