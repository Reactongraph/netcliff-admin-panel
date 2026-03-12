//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  DELETE_TAGS,
  GET_TAGS,
  INSERT_TAGS,
  OPEN_TAGS_TOAST,
  UPDATE_TAGS,
} from "./tags.type";
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

//Get Tags
export const getTags = () => (dispatch) => {
  apiInstanceFetch
    .get(`tags`)
    .then((res) => {
      dispatch({ type: GET_TAGS, payload: res.tags.map(t => ({...t, name: t.name.toLowerCase()})) });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Insert Tags
export const insertTags = (data) => (dispatch) => {
  axios
    .post(`tags/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_TAGS, payload: res.data.tags });
        dispatch({ type: CLOSE_DIALOG });
        dispatch({
          type: OPEN_TAGS_TOAST,
          payload: { data: "Insert Tag Successful ✔", for: "insert" },
        });
      } else {
        dispatch({
          type: OPEN_TAGS_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update tags
export const updateTags = (tagsId, data) => (dispatch) => {
  axios
    .patch(`tags/update?tagsId=${tagsId}&&name=${data}`)
    .then((res) => {
      if(res.data.status){
        dispatch({
          type: UPDATE_TAGS,
          payload: { data: res.data.tags, id: tagsId },
        });
        dispatch({ type: CLOSE_DIALOG });
        dispatch({
          type: OPEN_TAGS_TOAST,
          payload: { data: "Update Tag Successful ✔", for: "update" },
        });
      }else {
        Toast("error" ,res.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete tags
export const deleteTags = (tagsId) => (dispatch) => {
  axios
    .delete(`tags/delete/?tagsId=${tagsId}`)
    .then((res) => {
      dispatch({ type: DELETE_TAGS, payload: tagsId });
    })
    .catch((error) => {
      console.log(error);
    });
};