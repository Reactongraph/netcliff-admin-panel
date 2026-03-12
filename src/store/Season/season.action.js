//Axios
import axios from "axios";
import { Toast } from "../../util/Toast_";

//Types
import {
  DELETE_SEASON,
  GET_SEASON,
  INSERT_SEASON,
  UPDATE_SEASON,
} from "./season.type";
import { apiInstanceFetch } from "../../util/api";
import { setToast } from "../../util/Toast";

//Get Region
export const getSeason = (id) => (dispatch) => {
  apiInstanceFetch
    .get(`season/movieIdWise?movieId=${id}`)
    .then((res) => {
      dispatch({ type: GET_SEASON, payload: res.season });
    })
    .then((error) => {
      console.log(error);
    });
};

//Create  Season
export const CreateSeason = (formData) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`season/create`, formData)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: INSERT_SEASON, payload: res.data.season });
          Toast("success", res.data.message);
          resolve(res.data);
        } else {
          Toast("error", res.data.message);
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        Toast("error", errorMessage);
        reject(error);
      });
  });
};

//Update  Season
export const updateSeason = (formData, id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/season/update?seasonId=${id}`, formData)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: UPDATE_SEASON,
            payload: { data: res.data.season, id },
          });
          Toast("success", res.data.message);
          resolve(res.data);
        } else {
          Toast("error", res.data.message);
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        Toast("error", errorMessage);
        reject(error);
      });
  });
};

// delete season
export const deleteSeason = (id) => (dispatch) => {
  axios
    .delete(`/season/delete?seasonId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_SEASON, payload: id });
        Toast("success", "Delete Season Successfully ");
      } else {
        Toast("error", res.data.message);
      }
    })
    .then((error) => {
      console.log(error);
    });
};
