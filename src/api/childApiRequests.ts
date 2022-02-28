//Child component related api-requests

//TODO: Change it to match your development environment
//TODO: Change it in production to match the live server when we get there
const url='http://localhost:8080/';


export async function getWishlist() {
    console.log("HET!");
    return fetch(url + 'child/wishlist', {
        method: 'GET'
    })
        .then(res => res.json())
}
