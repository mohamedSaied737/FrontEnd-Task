import qs from "qs";
import store from "../state/store";
class VisipointClient {
  _setOptions(options) {
    this.options = Object.assign(this._headers(), options);
    return this;
  }

  _getOptions() {
    return this.options;
  }

  _headers() {
    let user = JSON.parse(localStorage.getItem("user"));
    return {
      // @TODO: We may wish to use this service without a bearer token, set this another way.
      headers: {
        //'Authorization': 'Bearer fake-jwt-token',
        Authorization: "Bearer " + user.data.access_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }

  _call(uri) {
    return fetch(process.env.VUE_APP_BASE_URL + uri, this._getOptions());
  }

  get(uri) {
    this._setOptions({
      method: "GET",
    });

    return this._call(uri);
  }
  getWithEntity(uri) {
    this._setOptions({
      method: "GET",
    });
    return this._call(uri + "/" + store.getters["authfack/currentEntity"].id);
  }
  getWithParams(uri, params) {
    this._setOptions({
      method: "GET",
    });

    return this._call(
      uri +
        "/" +
        store.getters["authfack/currentEntity"].id +
        "?" +
        qs.stringify(params)
    );
  }
  put(uri, params) {
    this._setOptions({
      method: "PUT",
      body: JSON.stringify(params),
    });

    return this._call(uri);
  }
  delete(uri) {
    this._setOptions({
      method: "DELETE",
    });

    return this._call(uri);
  }
  deleteWithEntity(uri) {
    this._setOptions({
      method: "DELETE",
    });
    let params = { entity_id: store.getters["authfack/currentEntity"].id };

    return this._call(uri + "?" + qs.stringify(params));
  }

  post(uri, params) {
    this._setOptions({
      method: "POST",
      body: JSON.stringify(params),
    });

    return this._call(uri);
  }

  postFormData(uri, params) {
    this._setOptions({
      method: "POST",
      body: params,
    });

    return this._call(uri);
  }
}

let _visipointClient = null;

const initVisipointClient = (config) => {
  if (!_visipointClient) {
    _visipointClient = new VisipointClient(config);
  }

  return _visipointClient;
};

const getVisipointClient = () => {
  return _visipointClient;
};

export { initVisipointClient, getVisipointClient };
