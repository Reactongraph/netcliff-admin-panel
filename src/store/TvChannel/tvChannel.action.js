import * as ActionType from "./tvChannel.type";
import { baseURL, secretKey } from "../../util/config";
import axios from "axios";
import { Toast } from "../../util/Toast_";
import { useHistory } from "react-router-dom";
import { apiInstanceFetch } from "../../util/api";
import { SuccessAlert } from "../../util/Alert";


export const getAdminTvChannels = (start, limit, search) => (dispatch) => {
  apiInstanceFetch
    .get(`tvChannels?start=${start}&limit=${limit}&search=${search}`)
    .then((res) => {

      dispatch({
        type: ActionType.GET_TV_CHANNELS,
        payload: { tvChannels: res?.tvChannels, totalChannels: res?.totalChannels },
      });
    })
    .catch((error) => console.log(error));
};

// create live channel
export const createTvChannel = (data) => (dispatch) => {

  return axios
    .post("tvChannels", data)
    .then((res) => {

      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_TV_CHANNEL, payload: res.data.channel });
        Toast("success", res.data.message);

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

// edit live tv channel
export const updateTvChannel = (id, formData) => (dispatch) => {
  return axios
    .put(`tvChannels?tvChannelId=${id}`, formData)
    .then((res) => {

      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: ActionType.UPDATING_TV_CHANNEL,
          payload: { data: res.data.channel, id: id },
        });
      } else {
        Toast("error", res.data.message);
      }
      return res.data
    })
    .catch((error) => {
      console.log(error)
      return error?.response?.data
    });
};

export const getStreamChannelsForSelect = () => (dispatch) => {
  apiInstanceFetch
    .get("stream/admin/forSelect")
    .then((res) => {
      dispatch({
        type: ActionType.GET_CHANNELS_FOR_SELECT,
        payload: res.stream,
      });
    })
    .catch((error) => console.log(error));
};


export const deleteTvChannel = (id) => (dispatch) => {
  axios
    .delete(`tvChannels?tvChannelId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_TV_CHANNEL, payload: id });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};