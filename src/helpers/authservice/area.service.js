import { authHeader } from './auth-header';

export const areaService = {
    getAll,
    register
};
function getAll() {
    let entity = JSON.parse(localStorage.getItem("currentlyEntity"));
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    fetch(process.env.VUE_APP_BASE_URL + `/api/areas/` + entity.id, requestOptions)
        .then(handleResponse)
        .then(data => {
            localStorage.setItem('areas', JSON.stringify(data.data));
            return data;
        });
}
function register(kiosk) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(kiosk)
    };
    return fetch(process.env.VUE_APP_BASE_URL + `/api/kiosk`, requestOptions)
        .then(handleResponse);

}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
