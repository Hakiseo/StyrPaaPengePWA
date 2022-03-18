import {
    IGetTokenInput,
    IVerifyTokenResponse,
    ILoginInput,
    IRegisterParentInput
} from "../sharedComponents/sharedInterfaces";

//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there

// export const apiUrl='http://localhost:8080/';
export const apiUrl='https://api.xn--styrppenge-55a.dk/';

export const identityTokenName = "identityToken"
export const storageUserId = "userId"

const accessDenied = "Error - Access Denied!";

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
    }).then(res => res.json())
        .catch(() => verifyToken()
            .then((res: IVerifyTokenResponse) => {
                if (res.error === accessDenied) {
                    window.alert("Your token is no longer valid - the application will refresh to the login page")
                    window.location.reload()
                }
            })
        );
}

export function apiDelete(path: string): Promise<any> {
    return fetch(apiUrl + path, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + getIdentityToken()
        }
    }).then(res => res.json())
        .catch(() => verifyToken()
            .then((res: IVerifyTokenResponse) => {
                if (res.error === accessDenied) {
                    window.alert("Your token is no longer valid - the application will refresh to the login page")
                    window.location.reload()
                }
            })
        );
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
        .then(response => response.json())
        .catch(() => verifyToken()
            .then((res: IVerifyTokenResponse) => {
                if (res.error === accessDenied) {
                    window.alert("Your token is no longer valid - the application will refresh to the login page")
                    window.location.reload()
                }
            })
        );
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
        .then(response => response.json())
        .catch(() => verifyToken()
            .then((res: IVerifyTokenResponse) => {
                if (res.error === accessDenied) {
                    window.alert("Your token is no longer valid - the application will refresh to the login page")
                    window.location.reload()
                }
            })
        );
}

export function verifyToken(): Promise<any> {
    return apiPost("verifyToken", {})
}

export function registerNewUser(data: IRegisterParentInput) {
    return fetch(apiUrl + "register/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(() => {
            alert("Something went wrong please try again after the reload or restart the app")
            window.location.reload()
        })
}

export function userLogin(data: ILoginInput) {
    return fetch(apiUrl + "login/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(() => {
            alert("Something went wrong please try again after the reload or restart the app")
            window.location.reload()
        })
}

export function getToken(data: IGetTokenInput) {
    return fetch(apiUrl + "token", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(() => {
            alert("Something went wrong please try reloading or restart the app")
        })
}