//Axios
import axios from "axios";

//Types
import {
  GET_USER,
  USER_DETAILS,
  GET_HISTORY,
  BLOCK_UNBLOCK_SWITCH,
} from "./user.type";

//Toast
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

//Get User
export const getUser = (page = 1, limit = 10) => (dispatch) => {
  apiInstanceFetch
    .get(`user?page=${page}&limit=${limit}`)
    .then((res) => {
      dispatch({ type: GET_USER, payload: res });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Get User Details
export const getUserDetails = (id) => (dispatch) => {
  apiInstanceFetch
    .get(`/user/details?userId=${id}`)
    .then((res) => {
      dispatch({ type: USER_DETAILS, payload: res.user });
    })
    .catch((error) => {
      console.log(error);
    });
};

//user History
export const userHistory = (data) => (dispatch) => {
  axios

    .post(`history`, data)
    // .post(
    //   `history?userId=${id}&start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`
    // )
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_HISTORY, payload: res.data });
      } else {
      }
    })
    .catch((error) => console.log("error", error.message));
};

//Block switch
export const handleBlockUnblockSwitch = (userId) => (dispatch) => {
  axios
    .patch(`user/blockUnblock?userId=${userId}`)
    .then((res) => {
      dispatch({
        type: BLOCK_UNBLOCK_SWITCH,
        payload: { data: res.data.user, id: userId },
      });
      Toast(
        "success",
        `${res.data.user?.fullName} is ${
          res.data.user?.isBlock === true ? "Block" : "Unblock"
        }`
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
