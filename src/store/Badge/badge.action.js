//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  DELETE_BADGE,
  GET_BADGE,
  INSERT_BADGE,
  OPEN_BADGE_TOAST,
  UPDATE_BADGE,
  UPDATE_BADGE_METRICS,
} from "./badge.type";
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

//Get Badge
export const getBadge = (type) => (dispatch) => {
  const url = type ? `badge?type=${type}` : `badge`;
  apiInstanceFetch
    .get(url)
    .then((res) => {
      dispatch({ type: GET_BADGE, payload: res.badge });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Insert Badge
export const insertBadge = (data) => (dispatch) => {
  axios
    .post(`badge/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_BADGE, payload: res.data.badge });
        dispatch({ type: CLOSE_DIALOG });
        dispatch({
          type: OPEN_BADGE_TOAST,
          payload: { data: "Insert Badge Successful ✔", for: "insert" },
        });
      } else {
        dispatch({
          type: OPEN_BADGE_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update badge
export const updateBadge = (badgeId, data) => (dispatch) => {
  axios
    .patch(`badge/update?badgeId=${badgeId}`, data)
    .then((res) => {
      if(res.data.status){
        dispatch({
          type: UPDATE_BADGE,
          payload: { data: res.data.badge, id: badgeId },
        });
        dispatch({ type: CLOSE_DIALOG });
        dispatch({
          type: OPEN_BADGE_TOAST,
          payload: { data: "Update Badge Successful ✔", for: "update" },
        });
      }else {
        Toast("error" ,res.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete badge
export const deleteBadge = (badgeId) => (dispatch) => {
  axios
    .delete(`badge/delete/?badgeId=${badgeId}`)
    .then((res) => {
      dispatch({ type: DELETE_BADGE, payload: badgeId });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update badge metrics
export const updateBadgeMetrics = (badgeId, data) => (dispatch) => {
  axios
    .patch(`badge/updateMetrics?badgeId=${badgeId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: UPDATE_BADGE_METRICS,
          payload: { data: res.data.badge, id: badgeId },
        });
        dispatch({
          type: OPEN_BADGE_TOAST,
          payload: { data: "Badge Metrics Updated ✔", for: "update" },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", "Failed to update metrics");
    });
};