//axios
import axios from "axios";

//Type
import {
  DELETE_SUBTITLE,
  GET_SUBTITLE,
  INSERT_SUBTITLE,
  OPEN_SUBTITLE_TOAST,
} from "./subtitle.type";
import { apiInstanceFetch } from "../../util/api";

export const getSubtitle = (dialogData) => (dispatch) => {
  apiInstanceFetch
    .get(`subtitle/movieIdWise?movie=${dialogData}`)
    .then((result) => {
      dispatch({ type: GET_SUBTITLE, payload: result.subtitle });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const insertSubtitle = (data) => (dispatch) => {
  axios
    .post(`subtitle/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_SUBTITLE, payload: res.data.subtitle });
        dispatch({
          type: OPEN_SUBTITLE_TOAST,
          payload: { data: "Insert Subtitle Successful ✔", for: "insert" },
        });
      } else {
        dispatch({
          type: OPEN_SUBTITLE_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};


export const deleteSubtitle = (mongoId) => (dispatch) => {
  axios
    .delete(`subtitle/delete?subtitleId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_SUBTITLE, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};
