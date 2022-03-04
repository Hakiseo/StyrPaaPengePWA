//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there
export const apiUrl='http://localhost:8080/';

export const identityTokenName = "identityToken"

export function apiFetch(path: string): Promise<any> {
    let token = localStorage.getItem(identityTokenName)
    return fetch(apiUrl + path, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json());
}

export function apiPost(path: string, data: {}) {
    let dataWithIdentity = Object.assign(data, {identityToken: localStorage.getItem(identityTokenName)})
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