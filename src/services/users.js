import Api from "./Api";
import store from "../state/store";

export default {
  userDetails() {
    return Api().get(`/user_details`);
  },
  getUser(id) {
    return Api().get(`/user/${id}`);
  },
  getAll(params) {
    return Api().get(`/users/${store.getters["authfack/currentEntity"].id}`, {
      params: {
        filterBy:
          Object.keys(store.getters["grid/getFilterValues"]).length > 0
            ? store.getters["grid/getFilterValues"]
            : {},
        orderBy:
          params && params.orderBy
            ? params && params.orderBy
            : { sortField: null },
        limit: params && params.limit ? params && params.limit : 10,
        page: store.getters["grid/getCurrentPage"],
      },
    });
  },
  createUser(params) {
    return Api().post("/users", params);
  },
  updateUser(params) {
    return Api().post(`/users/update/${params.id}`, params.user);
  },
  addUserWalkin(params) {
    return Api().post(`/update-user-details`, params.user);
  },
  moveUser(params) {
    return Api().put(`/users_usertype`, params);
  },
  deleteUser(id) {
    return Api().delete(`/users/${id}`, {
      params: {
        entity_id: store.getters["authfack/currentEntity"].id,
      },
    });
  },
  denyUser(params) {
    return Api().put(`/users_active`, params);
  },
  importUsers(params) {
    return Api().post("/api/users/import", params);
  },
  // roles
  getuserRoles() {
    return Api().get(`/role/${store.getters["authfack/currentEntity"].id}`);
  },
  // departments
  getDepartments() {
    return Api().get(
      `/department/${store.getters["authfack/currentEntity"].id}`
    );
  },
  // duplicated users 
  getDuplicatedUsers(params) {
    return Api().get(
      `/get_users_duplicate/${store.getters["authfack/currentEntity"].id}`,
      {
        params: { filterBy: params && params.filterBy ? params.filterBy : {} }
      }
    );
  },
  mergeDuplicatedUser(params) {
    return Api().post(`/merge_user`, params);
  },
  generateFaceIDforDuplicatedUser(params) {
    return Api().post(`/generate_faceId`, params);
  },
  // invite and invoke user 
  inviteInvokeUser(params) {
    return Api().put(`/invite_revoke`, params);
  },
  // document
  createDocument(params) {
    return Api().post(`/user_document`, params);
  },
  getDocuments() {
    return Api().get(
      `/get_type_for_user_document/${store.getters["authfack/currentEntity"].id}`
    );
  },
  // vaccine details
  userDocumentStatus(params) {
    return Api().put(`/user_document/${params.id}`, {status:params.status});
  },
};
