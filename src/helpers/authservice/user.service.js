import { authHeader } from "./auth-header";

export const userService = {
  login,
  logout,
  userDetails,
  userEntities,
  register,
  getAll,
};

function login(email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  };

  return fetch(process.env.VUE_APP_BASE_URL + `/api/login`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      if (user.data.access_token) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return user;
    });
}

function userDetails() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(
    process.env.VUE_APP_BASE_URL + `/api/user_details`,
    requestOptions
  ).then(handleResponse);
}

function userEntities(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(
    process.env.VUE_APP_BASE_URL + `/api/users_entities/` + id,
    requestOptions
  ).then(handleResponse);
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(user),
  };
  return fetch(
    process.env.VUE_APP_BASE_URL + `/api/register`,
    requestOptions
  ).then(handleResponse);
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }
      if (response.status === 422) {
        localStorage.setItem("errors", JSON.stringify(data));
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
