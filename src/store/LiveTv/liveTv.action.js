import * as ActionType from "./liveTv.type";
import { baseURL, secretKey } from "../../util/config";
import axios from "axios";
import { Toast } from "../../util/Toast_";
import { useHistory } from "react-router-dom";
import { apiInstanceFetch } from "../../util/api";
import { SuccessAlert } from "../../util/Alert";

export const getCountry = () => (dispatch) => {
  apiInstanceFetch
    .get("countryLiveTV")
    .then((res) => {

      dispatch({
        type: ActionType.GET_COUNTRY,
        payload: res.countryLiveTV,
      });
    })
    .catch((error) => console.log(error));
};

export const getLiveTvData = (country) => (dispatch) => {

  console.log("country", country);
  //   const request = {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json", key: secretKey },
  //   };
  //   fetch(
  //     `${baseURL}countryLiveTV/getStoredetails?countryName=${country}`,
  //     request
  //   )
  //     .then((response) => response.json())
  //     .then((res) => {
  //       console.log(res);
  //       dispatch({ type: ActionType.GET_LIVE_TV, payload: res });
  //     })
  //     .catch((error) => console.log(error));

  apiInstanceFetch
    .get(`countryLiveTV/getStoredetails?countryName=${country}`)
    .then((res) => {

      dispatch({ type: ActionType.GET_LIVE_TV, payload: res.streamData });
    })
    .catch((error) => console.log(error));
};

// create live channel
export const createLiveChannel = (data) => (dispatch) => {

  return axios
    .post("stream/create", data)
    .then((res) => {

      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_LIVE_TV, payload: res.data.stream });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
      return res.data
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data
    });
};

// admin CreateLiveChannel Get
export const getAdminCreateLiveTv = () => (dispatch) => {
  apiInstanceFetch
    .get("stream/admin")
    .then((res) => {

      dispatch({
        type: ActionType.GET_LIVE_TV_CREATE_BY_ADMIN,
        payload: res.stream,
      });
    })
    .catch((error) => console.log(error));
};

// edit live tv channel

export const updateLiveTvChannel = (id, formData) => (dispatch) => {
  axios
    .patch(`stream/update?streamId=${id}`, formData)
    .then((res) => {

      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: ActionType.EDIT_LIVETV_CHANNEL,
          payload: { data: res.data.stream, id: id },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const deleteLiveChannel = (id) => (dispatch) => {
  axios
    .delete(`stream/delete?streamId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_LIVETV_CHANNEL, payload: id });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// create manual live tv

// create live channel
export const createManualLiveChannel = (data) => (dispatch) => {

  return axios
    .post("stream/manualCreate", data)
    .then((res) => {

      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_LIVE_TV, payload: res.data.stream });
        Toast("success", res.data.message);

        // if (data?.streamType === "INTERNAL") {
        //   setTimeout(() => {
        //     SuccessAlert().then((result) => {
        //       if (result.isConfirmed) {
        //         // moving to tv page
        //         localStorage.removeItem("createChannelData");
        //         localStorage.removeItem("updateChannelData");
        //         window.location.href = "/admin/live_tv";

        //       }
        //     });
        //   }, 1200);
        // }

        return res.data
      } else {
        Toast("error", res.data.message);
        return res.data
      }
    })
    .catch((error) => {
      console.log(error);
      return error?.response?.data
    });
};

export const getFlag = () => (dispatch) => {

  apiInstanceFetch
    .get("flag")
    .then((res) => {


      dispatch({ type: ActionType.GET_FLAG, payload: res.flag })
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateSingleLiveTv = (_id, updateData) => ({
  type: ActionType.UPDATE_SINGLE_LIVE_TV,
  payload: {
    _id,
    updateData
  }
});

export const createLiveTvProgram = (programData) => (dispatch) => {
  dispatch({ type: ActionType.CREATE_PROGRAM_REQUEST });

  return axios
    .post('stream/program', programData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_PROGRAM_SUCCESS,
          payload: res.data.data
        });

        Toast('success', res.data.message || 'Program created successfully');

        return res.data
      } else {
        dispatch({
          type: ActionType.CREATE_PROGRAM_FAILURE,
          payload: res.data.message
        });

        Toast('error', res.data.message);

        return res.data
      }
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Failed to create program';

      dispatch({
        type: ActionType.CREATE_PROGRAM_FAILURE,
        payload: errorMessage
      });

      Toast('error', errorMessage);

      return {
        success: false,
        error: error,
        message: errorMessage
      };
    });
};

export const updateLiveTvProgram = (programId, updateData) => (dispatch) => {
  dispatch({ type: ActionType.UPDATE_PROGRAM_REQUEST });

  return axios
    .put(`stream/program/${programId}`, updateData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_PROGRAM_SUCCESS,
          payload: res.data.data
        });

        Toast('success', res.data.message || 'Program updated successfully');

        return res.data
      } else {
        dispatch({
          type: ActionType.UPDATE_PROGRAM_FAILURE,
          payload: res.data.message
        });

        Toast('error', res.data.message);

        return res.data
      }
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message || 'Failed to update program';

      dispatch({
        type: ActionType.UPDATE_PROGRAM_FAILURE,
        payload: errorMessage
      });

      Toast('error', errorMessage);

      return {
        status: false,
        error: error,
        message: errorMessage
      };
    });
};

export const deleteProgram = async (id) => {
  return axios
    .delete(`stream/program/${id}`)
};

export const getChannelIdList = () => (dispatch) => {
  apiInstanceFetch
    .get(`stream/id-list`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: ActionType.GET_ID_LIST, payload: res.list });
      }
    })
    .catch((error) => console.log("error", error.message));
};