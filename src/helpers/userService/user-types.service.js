import { getVisipointClient } from "@/helpers/visipoint-client";

const client = getVisipointClient();

export const userTypesService = {
    getUserTypes,
}

function getUserTypes() {
    return client.get('/api/user-types');
}
