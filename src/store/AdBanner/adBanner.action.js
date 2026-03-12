//axios
import axios from "axios";

import { apiInstanceFetch } from "../../util/api";
import {
  CHANGE_ADBANNER_STATUS,
  DELETE_ADBANNER,
  GET_ADBANNER,
  INSERT_ADBANNER,
  OPEN_ADBANNER_TOAST,
} from "./adBanner.type";

export const getAdBanners = () => (dispatch) => {
  apiInstanceFetch
    .get(`ad-banner`)
    .then((result) => {
      dispatch({ type: GET_ADBANNER, payload: result.banners });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const insertAdBanner = (data, handleClose) => (dispatch) => {
  axios
    .post(`ad-banner`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_ADBANNER, payload: res.data.banner });
        dispatch({
          type: OPEN_ADBANNER_TOAST,
          payload: { data: "Insert Banner Successful ✔", for: "insert" },
        });
        handleClose();
      } else {
        dispatch({
          type: OPEN_ADBANNER_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteBanner = (mongoId) => (dispatch) => {
  axios
    .delete(`ad-banner?bannerId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_ADBANNER, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const changeAdBannerStatus = (mongoId) => (dispatch) => {
  axios
    .put(`ad-banner/change-status?bannerId=${mongoId}`)
    .then((res) => {
      dispatch({ type: CHANGE_ADBANNER_STATUS, payload: res.data.banner });
    })
    .catch((error) => {
      console.log(error);
    });
};
