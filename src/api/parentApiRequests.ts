//parent component related api-requests

import {apiFetch} from "./apiUtils";

export function getAllParent(): Promise<any> {
    return apiFetch("parent")
}