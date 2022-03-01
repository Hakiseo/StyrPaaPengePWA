//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there
export const apiUrl='http://localhost:8080/';

export function apiFetch(path: string): Promise<any> {
    return fetch(apiUrl + path).then(res => res.json());
}

export function apiPost(path: string) {
    const data = { username: 'example' };

    console.log("DATA: ", data)

    fetch(apiUrl + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}