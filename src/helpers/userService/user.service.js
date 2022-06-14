import { getVisipointClient } from "@/helpers/visipoint-client";
import handleResponse from "@/helpers/http/response.service";
const client = getVisipointClient();

export const userService = {
    getUser,
    getAll,
    updateUser,
    deleteUser,
    denyUser,
    createUser,
    importUsers
}

function createUser(data) {
    return client.post('/api/users', data)
        .then(handleResponse);
}

function getUser(id) {
    return client.get(`/api/user/${id}`)
        .then(handleResponse);
}

function getAll(params) {
    return client.getWithParams('/api/users', params)
        .then(handleResponse);
}

function updateUser(id, params) {
    return client.put(`/api/users/${id}`, params)
        .then(handleResponse);
}

function deleteUser(id) {
    return client.deleteWithEntity(`/api/users/${id}`)
        .then(handleResponse);
}

function denyUser(id, params) {
    return client.put(`/api/user_deny/${id}`,params)
        .then(handleResponse);
}

function importUsers(params)
{
    return client.postFormData('/api/users/import', params).then(handleResponse);
}
