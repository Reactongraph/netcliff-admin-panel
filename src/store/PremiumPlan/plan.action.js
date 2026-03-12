import axios from "axios";

import {
  CREATE_NEW_PREMIUM_PLAN,
  DELETE_PREMIUM_PLAN,
  EDIT_PREMIUM_PLAN,
  GET_PREMIUM_PLAN,
  GET_PREMIUM_PLAN_HISTORY,
  OPEN_PREMIUM_PLAN_TOAST,
} from "./plan.type";
import { apiInstanceFetch } from "../../util/api";

export const getPremiumPlan = (payload) => (dispatch) => {
  const query =
    payload?.status === "active"
      ? `premiumPlan?admin=true`
      : `premiumPlan?all=true&admin=true`;
  apiInstanceFetch
    .get(query)
    .then((res) => {
      dispatch({ type: GET_PREMIUM_PLAN, payload: res.premiumPlan });
    })
    .catch((error) => console.log("error", error.message));
};

//insert new premium plan
export const createNewPremiumPlan = (data) => (dispatch) => {
  axios
    .post(`premiumPlan/create`, data)
    .then((res) => {
      dispatch({
        type: CREATE_NEW_PREMIUM_PLAN,
        payload: res.data.premiumPlan,
      });
      dispatch({
        type: OPEN_PREMIUM_PLAN_TOAST,
        payload: { data: "Insert Premium Plan Successful ✔", for: "insert" },
      });
    })
    .catch((error) => console.log("error", error.message));
};

//update Premium plan
export const editPremiumPlan = (premiumPlanId, data) => (dispatch) => {
  axios
    .patch(`premiumPlan/update?premiumPlanId=${premiumPlanId}`, data)
    .then((res) => {
      dispatch({
        type: EDIT_PREMIUM_PLAN,
        payload: { data: res.data.premiumPlan, id: premiumPlanId },
      });
      dispatch({
        type: OPEN_PREMIUM_PLAN_TOAST,
        payload: { data: "Update Premium Plan Successful ✔", for: "update" },
      });
    })
    .catch((error) => console.log("error", error.message));
};

//delete premium plan
export const deletePremiumPlan = (premiumPlanId) => (dispatch) => {
  axios
    .delete(`premiumPlan/delete?premiumPlanId=${premiumPlanId}`)
    .then((res) => {
      dispatch({ type: DELETE_PREMIUM_PLAN, payload: premiumPlanId });
    })
    .catch((error) => console.log(error));
};

//toggle premium plan status
export const togglePremiumPlanStatus = (premiumPlanId) => (dispatch) => {
  axios
    .patch(`premiumPlan/toggleStatus?premiumPlanId=${premiumPlanId}`)
    .then((res) => {
      dispatch({
        type: EDIT_PREMIUM_PLAN,
        payload: { data: res.data.premiumPlan, id: premiumPlanId },
      });
      dispatch({
        type: OPEN_PREMIUM_PLAN_TOAST,
        payload: { data: "Status Updated Successfully ✔", for: "update" },
      });
    })
    .catch((error) => console.log("error", error.message));
};

//mark premium plan as default
export const markPremiumPlanAsDefault = (premiumPlanId) => (dispatch) => {
  axios
    .patch(`premiumPlan/setDefault?premiumPlanId=${premiumPlanId}`)
    .then((res) => {
      dispatch({
        type: EDIT_PREMIUM_PLAN,
        payload: { data: res.data.premiumPlan, id: premiumPlanId },
      });
      dispatch({
        type: OPEN_PREMIUM_PLAN_TOAST,
        payload: { data: "Plan set as default ✔", for: "update" },
      });
      dispatch(getPremiumPlan());
    })
    .catch((error) => console.log("error", error.message));
};

//get premium plan history
export const premiumPlanHistory =
  (id, start, limit, sDate, eDate) => (dispatch) => {
    const url =
      id !== null
        ? `premiumPlan/history?userId=${id}&start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`
        : `premiumPlan/history?start=${start}&limit=${limit}&startDate=${sDate}&endDate=${eDate}`;

    apiInstanceFetch
      .get(url)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_PREMIUM_PLAN_HISTORY,
            payload: { history: res.history, total: res.total },
          });
        } else {
          console.log("error", res.message);
        }
      })
      .catch((error) => console.log(error));
  };
