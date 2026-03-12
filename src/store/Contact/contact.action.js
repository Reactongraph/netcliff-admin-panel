//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  DELETE_CONTACT_US,
  GET_CONTACT_US,
  INSERT_CONTACT_US,
  OPEN_CONTACT_US_TOAST,
  UPDATE_CONTACT_US,
} from "./contact.type";
import { apiInstanceFetch } from "../../util/api";

//Get contact
export const getContactUs = () => (dispatch) => {
  apiInstanceFetch
    .get(`contactus`)
    .then((res) => {
      dispatch({ type: GET_CONTACT_US, payload: res.contact });
    })
    .then((error) => {
      console.log(error);
    });
};

//Insert contact
export const insertContact = (data) => (dispatch) => {
  axios
    .post(`contactUs/create`, data)
    .then((res) => {
      dispatch({ type: INSERT_CONTACT_US, payload: res.data.contact });
      dispatch({ type: CLOSE_DIALOG });
      dispatch({
        type: OPEN_CONTACT_US_TOAST,
        payload: { data: "Insert Successfully ✔", for: "insert" },
      });
    })
    .then((error) => {
      console.log(error);
    });
};

//Update contact
export const updateContact = (contactId, data) => (dispatch) => {
  axios
    .patch(`contactUs/update?contactId=${contactId}`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_CONTACT_US,
        payload: { data: res.data.contact, id: contactId },
      });
      dispatch({ type: CLOSE_DIALOG });
      dispatch({
        type: OPEN_CONTACT_US_TOAST,
        payload: { data: "Update Successfully ✔", for: "update" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete contact
export const deleteContact = (contactId) => (dispatch) => {

  axios
    .delete(`contactUs/delete?contactId=${contactId}`)
    .then((res) => {
    
      dispatch({ type: DELETE_CONTACT_US, payload: contactId });
    })
    .catch((error) => {
      console.log(error);
    });
};
