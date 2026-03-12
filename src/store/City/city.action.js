//Axios
import axios from "axios";

//Types
import {
  CLOSE_CITY_DIALOG,
  DELETE_CITY,
  GET_CITY,
  INSERT_CITY,
  OPEN_CITY_TOAST,
  UPDATE_CITY,
} from "./city.type";

import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

export const getCities = (start, limit, search) => (dispatch) => {
  let str = `city?start=${start}&limit=${limit}`
  if (search)
    str = str + `&search=${search}`

  apiInstanceFetch
    .get(str)
    .then((res) => {
      console.log('res', res)
      dispatch({ type: GET_CITY, payload: res });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

export const insertCity = (data) => (dispatch) => {
  axios
    .post(`city/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_CITY, payload: res.data.city });
        dispatch({ type: CLOSE_CITY_DIALOG });
        dispatch({
          type: OPEN_CITY_TOAST,
          payload: { data: "Insert City Successful ✔", for: "insert" },
        });
      } else {
        dispatch({
          type: OPEN_CITY_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateCity = (cityId, data) => (dispatch) => {
  axios
    .patch(`city/update?cityId=${cityId}`, data)
    .then((res) => {
      if (res.data.status) {

        dispatch({ type: CLOSE_CITY_DIALOG });
        dispatch({
          type: UPDATE_CITY,
          payload: { data: res.data.city, id: cityId },
        });

        dispatch({
          type: OPEN_CITY_TOAST,
          payload: { data: "Update City Successful ✔", for: "update" },
        });
      } else {
        Toast("error", res.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteCity = (cityId) => (dispatch) => {
  axios
    .delete(`city/delete/?cityId=${cityId}`)
    .then((res) => {
      dispatch({ type: DELETE_CITY, payload: cityId });
    })
    .catch((error) => {
      console.log(error);
    });
};
