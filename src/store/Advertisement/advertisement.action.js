import axios from "axios";
import { setToast } from "../../util/Toast";
import * as ActionType from "./advertisement.type";
import { apiInstanceFetch } from "../../util/api";

// get advertise
export const getAdvertise = () => (dispatch) => {
  apiInstanceFetch
    .get(`advertisement`)
    .then((res) => {
      dispatch({
        type: ActionType.GET_ADVERTISEMENT,
        payload: res.advertisement,
      });
    })
    .catch((error) => console.log(error));
};

// update advertise
export const updateAdvertise = (data, id) => (dispatch) => {
  axios
    .patch(`advertisement/update?addId=${id}`, data)
    .then((res) => {
      if (res.data.status) {
        console.log("advertisement....", res.data);
        dispatch({
          type: ActionType.UPDATE_ADVERTISE,
          payload: res.data.advertisement,
        });
        dispatch({
          type: ActionType.OPEN_ADS_TOAST,
          payload: { data: "Advertise update Successfully!", for: "update" },
        });
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// advertisement active deActive

export const advertisementSwitch = (id) => (dispatch) => {
  axios
    .patch(`advertisement/googleAdd?addId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.ACTIVE_ADVERTISE,
          payload: res.data,
        });
        dispatch({
          type: ActionType.OPEN_ADS_TOAST,
          payload: {
            data: `Advertisement is ${
              res.data.advertisement?.isGoogleAdd === true
                ? "Active"
                : "Deactive"
            }`,
            for: "update",
          },
        });
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
