//axios
import axios from "axios";

//types
import {
  CLEAR_LOGIN_ERROR,
  SET_LOGIN_ERROR,
  SET_ADMIN,
  UPDATE_PROFILE,
  UPDATE_PROFILE_NAME,
  OPEN_ADMIN_TOAST,
  FORGOT_PASSWORD,
  SIGNUP_ADMIN,
} from "./admin.type";
import { Toast } from "../../util/Toast_";

//tost
import { setToast } from "../../util/Toast";
import { apiInstanceFetch } from "../../util/api";

export const signupAdmin = (signup) => (dispatch) => {
  axios
    .post("/admin/create", signup)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        dispatch({ type: SIGNUP_ADMIN });
        Toast("success", "Signup Successfully!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error);
      console.log(error);
    });
};

//Login action
export const login = (details) => (dispatch) => {
  axios
    .post("admin/login", details)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: OPEN_ADMIN_TOAST,
          payload: {
            data: "You have successfully login.",
            for: "insert",
          },
        });

        dispatch({ type: SET_ADMIN, payload: res.data.token });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch(({ response }) => {
      if (response?.data.message) {
        console.log(response.data);
        dispatch({
          type: OPEN_ADMIN_TOAST,
          payload: { data: response.data.message, for: "error" },
        });
      }
    });
};

//Get admin Profile action
export const getProfile = () => (dispatch) => {
  apiInstanceFetch
    .get(`admin/profile`)
    .then((res) => {
      dispatch({ type: UPDATE_PROFILE, payload: res.admin });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update Image
export const updateImage = (image) => (dispatch) => {
  console.log("image", image);
  axios
    .patch(`/admin/updateImage`, image)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: UPDATE_PROFILE, payload: res.data.admin });
        dispatch({
          type: OPEN_ADMIN_TOAST,
          payload: { data: "Image Update Successfully ✔", for: "update" },
        });
      } else {
        setToast(res.data.message, "error");
      }
    })
    .then((error) => {
      console.log(error);
    });
};

//Update Email and Name
export const updateProfile = (content) => (dispatch) => {
  axios
    .patch(`/admin`, content)
    .then((res) => {
      dispatch({ type: UPDATE_PROFILE_NAME, payload: res.data.admin });
      dispatch({
        type: OPEN_ADMIN_TOAST,
        payload: { data: "Update Admin Profile Successful ✔", for: "update" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const sendEmail = (content) => (dispatch) => {
  axios
    .post("admin/forgetPassword", content)
    .then((res) => {
      if (res.data.status) {
        // dispatch({
        //   type: OPEN_ADMIN_TOAST,
        //   payload: {
        //     data: "c",
        //     for: "insert",
        //   },
        // });
        Toast("success", "Email send to registered email ID");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", "Something went wrong while sending email.");
      console.log("error", error);
    });
};

export const forgotPassword = (data, id) => (dispatch) => {
  axios
    .post(`admin/setPassword?adminId=${id}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", res.data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 3600);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateCode = (signup) => (dispatch) => {
  axios
    .patch("admin/updateCode", signup)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        console.log("res.data", res.data);
        Toast("success", "Purchase Code Update Successfully !");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error);
      console.log(error);
    });
};
