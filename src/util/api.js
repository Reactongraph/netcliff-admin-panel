import { CLOSE_LOADER, OPEN_LOADER } from "../store/Loader/loader.type";
import { baseURL, secretKey } from "./config";
import store from "../store/Provider";

export const openSpinner = () => {
  return store.dispatch({ type: OPEN_LOADER });
};

export const closeSpinner = () => {
  return store.dispatch({ type: CLOSE_LOADER });
};

// Helper function to get latest headers
const getUpdatedHeaders = () => ({
  "Content-Type": "application/json",
  key: secretKey, // Will always use the latest secretKey
  Authorization: `Bearer ${localStorage.getItem("token")}`, // Gets fresh token
});

export const apiInstanceFetch = {
  baseURL: `${baseURL}`, // Set your default base URL here
  headers: {
    "Content-Type": "application/json",
    key: `${secretKey}`,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  get: (url) => {
    openSpinner();
    return fetch(`${apiInstanceFetch?.baseURL}${url}`, {
      method: "GET",
      headers: getUpdatedHeaders(),
    })
      .then(handleErrors)
      .finally(() => {
        if (url && typeof url === 'string' && url.includes('city?regionId='))
          setTimeout(() => {
            closeSpinner()
          }, 800);
        else
          closeSpinner()
      });
  },

  post: (url, data) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "POST",
      headers: getUpdatedHeaders(),
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  patch: (url, data) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "PATCH",
      headers: getUpdatedHeaders(),
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  put: (url, data) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "PUT",
      headers: getUpdatedHeaders(),
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  delete: (url) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "DELETE",
      headers: getUpdatedHeaders(),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },
};

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response?.status}`);
  }
  return response.json();
}
