import { getVisipointClient } from "@/helpers/visipoint-client";
import handleResponse from "@/helpers/http/response.service";
const client = getVisipointClient();

export const roleService = {
    getAll,
    
}



function getAll() {
    
    return client.getWithEntity('/api/role')
        .then(handleResponse);
}