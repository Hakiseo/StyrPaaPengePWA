//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there
export const apiUrl='http://localhost:8080/';

export function apiFetch(path: string): Promise<any> {
    return fetch(apiUrl + path).then(res => res.json());
}