import usersService from "@/services/users";

export const state = {
  usersList: {},
  duplicatedUsers:[],
  userRoles:[],
  departments:[],
  formErrors:[],
  modalState:false,
  loading:false,
  documents:[],
  documentSelected:false,
  vaccineToggleLoading:false,
  vaccineDeleteLoading:false,
};

export const actions = {
  getAll({ commit, dispatch }, params) {
    commit("grid/setLoading", true, { root: true });
    commit("setUsers", {});
    return new Promise((resolve, reject) => {
      usersService
        .getAll(params)
        .then((data) => {
          resolve(data);
          commit("setUsers", data.data.data);
          commit("setModalState", false); 
          commit("grid/setRecordsCount", data.data.count , { root: true });
          commit("grid/setLoading", false, { root: true });
          dispatch("grid/resetSelectedRows", null, { root: true });
          commit("modal/setModalState", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  createUser({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      usersService
        .createUser(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Created");
          setTimeout(() => {
            commit("setLoading", false);
          }, 3000);
          commit("setModalState", true);
          commit("setFormErrors", []);
          dispatch("getAll");
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("setModalState", false);
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
          commit("setFormErrors", err.data.errors);
        });
    });
  },
  deleteUser({ commit, dispatch }, id) {
    commit("grid/setLoading", true, { root: true });
    return new Promise((resolve, reject) => {
      usersService
        .deleteUser(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Deleted");
          commit("grid/setLoading", false, { root: true });
          dispatch("getAll");
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  denyUser({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      usersService
        .denyUser(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Status Updated");
          dispatch("grid/resetSelectedRows", null, { root: true });
          setTimeout(() => {
              commit("setLoading", false)
            }, 3000);
          commit("setModalState", true);
          dispatch("getAll");
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setModalState", false);
          this._vm.$toast.error(err.toString());
        });
    });
  },
  moveUser({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      usersService
        .moveUser(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Moved");
          commit("setLoading", false);
          commit("modal/setModalState", true, { root: true });
          dispatch("getAll");
        })
        .catch((err) => {
          this._vm.$toast.error(err.join("\r\n"));
          commit("setLoading", false);
        });
    });
  },
  updateUserAction({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      usersService
        .updateUser(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Updated");
          commit("setLoading", false);
          commit("setModalState", true);
          commit("setFormErrors", []);
          dispatch("getAll");
          // update cuurent user details
          const userDetails = localStorage.getItem("userDetails");
          let userId = userDetails ? JSON.parse(userDetails).user_id : null;
          if (params.id == userId) {
            dispatch("authfack/fetchuserDetails", 'no-fetch-entites', { root: true });
          }
        })
        .catch((err) => {
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
          commit("setLoading", false);
          commit("setModalState", false);
        });
    });
  },
  addUserWalkin({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      usersService
        .addUserWalkin(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Updated");
          commit("setLoading", false);
          commit("setModalState", true);
          commit("setFormErrors", []);
          dispatch("getAll");
          // update cuurent user details
          const userDetails = localStorage.getItem("userDetails");
          let userId = userDetails ? JSON.parse(userDetails).user_id : null;
          if (params.id == userId) {
            dispatch("authfack/fetchuserDetails", 'no-fetch-entites', { root: true });
          }
        })
        .catch((err) => {
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
          commit("setLoading", false);
          commit("setModalState", false);
        });
    });
  },
  fetchUserRoles({ commit }) {
    commit("setLoading", false);
    commit("setFormErrors", []);
    commit("setModalState", false);
    return new Promise((resolve, reject) => {
      usersService
        .getuserRoles()
        .then((data) => {
          resolve(data);
          commit("setUserRoles", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchDepartments({ commit }) {
    return new Promise((resolve, reject) => {
      usersService
        .getDepartments()
        .then((data) => {
          resolve(data);
          commit("setDepartments", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchDuplicatedUsers({ commit }, params) {
    commit("setLoading", false);
    return new Promise((resolve, reject) => {
      usersService
        .getDuplicatedUsers(params)
        .then((data) => {
          resolve(data);
          commit("setDuplicatedUsers", data.data);
          commit("modal/setModalState", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  mergeDuplicatedUser({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      usersService
        .mergeDuplicatedUser(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Merged User");
          commit("setLoading", false);
          commit("modal/setModalState", true, { root: true });
          dispatch("fetchDuplicatedUsers");
        })
        .catch((err) => {
          commit("setLoading", false);
          this._vm.$toast.error(err.join("\r\n"));
        });
    });
  },
  generateFaceIDforDuplicatedUser({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      usersService
        .generateFaceIDforDuplicatedUser(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Generated Face ID");
          commit("setLoading", false);
          commit("modal/setModalState", true, { root: true });
          dispatch("fetchDuplicatedUsers");
        })
        .catch((err) => {
          commit("setLoading", false);
          this._vm.$toast.error(err.join("\r\n"));
        });
    });
  },
  resetUsersData({ commit }) {
    commit("setUsers", {});
  },
  inviteInvokeUser({ commit, dispatch }, params) {
    commit("setLoading", true);
    commit("modal/setModalState", true, { root: true });
    return new Promise((resolve, reject) => {
      usersService
        .inviteInvokeUser(params)
        .then((data) => {
          resolve(data);
          params.type == "invite"
            ? this._vm.$toast.success("Passport Invitation Sent")
            : this._vm.$toast.success("Passport Revoked");
          commit("setLoading", false);
          dispatch("getAll");
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  resetLoading({commit}){
    commit("setLoading", false);
    commit("setModalState", false);
    commit("setDocumentSelected", false);
    commit("setVaccineDeleteLoading", false);
    commit("setVaccineToggleLoading", false);
    commit("compliance/setComplianceList", [], {root:true});
  },
  // documents 
  createDocument({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      usersService
        .createDocument(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Document Created");
          commit("setLoading", true);
          commit("setModalState", true);
          dispatch("getAll");
          dispatch("grid/checkVaccinePCRColumnAppearance", null ,{ root :true });
        })
        .catch((err) => {
          reject(err);
          this._vm.$toast.error(Object.values(err.data.errors).join('\r\n'));
          commit("setLoading", false);
          commit("setModalState", false);
        });
    });
  },
  fetchDocuments({ commit }, ) {
    return new Promise((resolve, reject) => {
      usersService
        .getDocuments()
        .then((data) => {
          resolve(data);
          commit("setDocuments", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // vaccine details
  userDocumentStatus({ commit, dispatch }, params) {
      params.status == 'DELETED'
      ?
      commit("setVaccineDeleteLoading", true)
      :
      commit("setVaccineToggleLoading", true);
      return new Promise((resolve, reject) => {
        usersService
          .userDocumentStatus(params)
          .then((data) => {
            resolve(data);
            this._vm.$toast.success("Document Vaccine Status Updated");
            commit("setModalState", true);
            dispatch("getAll");
            dispatch("grid/checkVaccinePCRColumnAppearance",null,{root:true})
          })
          .catch((err) => {
            reject(err);
            this._vm.$toast.error(Object.values(err.data.errors).join('\r\n'));
            params.status == 'DELETED'
            ?
            commit("setVaccineDeleteLoading", false)
            :
            commit("setVaccineToggleLoading", false);
            commit("setModalState", false);
          });
      });
  },
  onSelectDocument({commit},flag){
      commit("setDocumentSelected", flag);
  },
};

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setVaccineToggleLoading(state, payload) {
    state.vaccineToggleLoading = payload;
  },
  setVaccineDeleteLoading(state, payload) {
    state.vaccineDeleteLoading = payload;
  },
  setUsers(state, payload) {
    state.usersList = payload;
  },
  setUserRoles(state, payload) {
    state.userRoles = payload;
  },
  setDepartments(state, payload) {
    state.departments = payload;
  },
  setFormErrors(state, payload) {
    state.formErrors = payload;
  },
  setModalState(state, payload) {
    state.modalState = payload;
  },
  setDuplicatedUsers(state, payload){
   state.duplicatedUsers = payload;
  },
  setDocuments(state, payload) {
    state.documents = payload;
  },
  setDocumentSelected(state, payload) {
    state.documentSelected = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getVaccineToggleLoading(state) {
    return state.vaccineToggleLoading;
  },
  getVaccineDeleteLoading(state) {
    return state.vaccineDeleteLoading;
  },
  getUsers(state) {
    return state.usersList;
  },
  getUserRoles(state) {
    return state.userRoles;
  },
  getDepartments(state) {
    return state.departments;
  },
  getFormErrors(state) {
    return state.formErrors;
  },
  getModalState(state) {
    return state.modalState;
  },
  getduplicatedUserse(state) {
    return state.duplicatedUsers;
  },
  getDocuments(state) {
    return state.documents;
  },
  getDocumentSelected(state) {
    return state.documentSelected;
  },
};
