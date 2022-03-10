//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there
export const apiUrl='http://localhost:8080/';

export const identityTokenName = "identityToken"
export const storageUserId = "userId"

export function getIdentityToken(): string {
    let token: string | null = localStorage.getItem(identityTokenName)
    if (token) {
        return token;
    }
    return "";
}

export function getCurrentUserId(): string {
    let token: string | null = localStorage.getItem(storageUserId)
    if (token) {
        return token;
    }
    return "";
}

export function apiFetch(path: string): Promise<any> {
    return fetch(apiUrl + path, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getIdentityToken()
        }
    }).then(res => res.json());
}

export function apiDelete(path: string): Promise<any> {
    return fetch(apiUrl + path, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + getIdentityToken()
        }
    }).then(res => res.json());
}

export function apiPost(path: string, data: {}) {
    let dataWithIdentity = Object.assign(data, {identityToken: getIdentityToken()})
    return fetch(apiUrl + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithIdentity),
    })
        .then(response => response.json());
}

export function apiPut(path: string, data: {}) {
    let dataWithIdentity = Object.assign(data, {identityToken: getIdentityToken()})
    return fetch(apiUrl + path, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithIdentity),
    })
        .then(response => response.json());
}