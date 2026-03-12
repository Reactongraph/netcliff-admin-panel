//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  DELETE_FAQ,
  GET_FAQ,
  INSERT_FAQ,
  OPEN_FAQ_TOAST,
  UPDATE_FAQ,
} from "./faq.type";
import { apiInstanceFetch } from "../../util/api";

//Get Faq
export const getFaQ = () => (dispatch) => {
  apiInstanceFetch
    .get(`FAQ`)
    .then((res) => {
      dispatch({ type: GET_FAQ, payload: res.FaQ });
    })
    .then((error) => {
      console.log(error);
    });
};

//Insert Faq
export const insertFaQ = (data) => (dispatch) => {
  axios
    .post(`FAQ/create`, data)
    .then((res) => {
      dispatch({ type: INSERT_FAQ, payload: res.data.FaQ });
      dispatch({ type: CLOSE_DIALOG });
      dispatch({
        type: OPEN_FAQ_TOAST,
        payload: { data: "Insert FAQ Successfully ✔", for: "insert" },
      });
    })
    .then((error) => {
      console.log(error);
    });
};

//Update Faq
export const updateFaQ = (faqId, data) => (dispatch) => {
  axios
    .patch(`FAQ/update?FaQId=${faqId}`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_FAQ,
        payload: { data: res.data.FaQ, id: faqId },
      });
      dispatch({ type: CLOSE_DIALOG });
      dispatch({
        type: OPEN_FAQ_TOAST,
        payload: { data: "Update FAQ Successfully ✔", for: "update" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete Faq
export const deleteFaQ = (mongoId) => (dispatch) => {
  axios
    .delete(`FAQ/delete?FaQId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_FAQ, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};
