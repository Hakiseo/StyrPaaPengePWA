//Child component related api-requests

//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there
const url='http://localhost:4000/';

export async function getWishlist() {
    return fetch(url + 'get-wishlist', {
        method: 'GET'
    })
        .then(res => res.json())
}