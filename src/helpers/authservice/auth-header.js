export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.data.access_token) {
        return { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + user.data.access_token };
    } else {
        return {};
    }
}