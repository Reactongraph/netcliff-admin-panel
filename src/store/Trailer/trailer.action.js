//axios
import axios from "axios";

//Type
import {
  DELETE_TRAILER,
  GET_TRAILER,
  INSERT_TRAILER,
  OPEN_TRAILER_TOAST,
  UPDATE_TRAILER,
} from "./trailer.type";
import { apiInstanceFetch } from "../../util/api";

//get Trailer
export const getTrailer = (dialogData) => (dispatch) => {
  apiInstanceFetch
    .get(`trailer/movieIdWise?movieId=${dialogData}`)
    .then((result) => {
      dispatch({ type: GET_TRAILER, payload: result.trailer });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Insert Trailer
export const insertTrailer = (data) => (dispatch) => {
  axios
    .post(`trailer/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_TRAILER, payload: res.data.trailer });
        dispatch({
          type: OPEN_TRAILER_TOAST,
          payload: { data: "Insert Trailer Successful ✔", for: "insert" },
        });
      } else {
        dispatch({
          type: OPEN_TRAILER_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update Trailer
export const updateTrailer = (data, mongoId) => (dispatch) => {
  axios
    .patch(`trailer/update?trailerId=${mongoId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: UPDATE_TRAILER,
          payload: { data: res.data.trailer, id: mongoId },
        });

        dispatch({
          type: OPEN_TRAILER_TOAST,
          payload: { data: "Update Trailer Successful ✔", for: "update" },
        });
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete Trailer
export const deleteTrailer = (mongoId) => (dispatch) => {
  axios
    .delete(`trailer/delete?trailerId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_TRAILER, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};
