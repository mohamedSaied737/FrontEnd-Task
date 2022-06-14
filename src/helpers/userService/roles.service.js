import { getVisipointClient } from "@/helpers/visipoint-client";

const client = getVisipointClient();

export const rolesService = {
    getRoles,
}

function getRoles() {
    return client.get('/api/roles');
}
