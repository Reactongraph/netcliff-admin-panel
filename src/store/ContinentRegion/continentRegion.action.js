//Axios
import axios from "axios";

//Types
import {
  CLOSE_CONTINENT_REGION_DIALOG,
  DELETE_CONTINENT_REGION,
  GET_CONTINENT_REGION,
  INSERT_CONTINENT_REGION,
  OPEN_CONTINENT_REGION_TOAST,
  UPDATE_CONTINENT_REGION,
} from "./continentRegion.type";
import { setToast } from "../../util/Toast";
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

//Get Region
export const getRegion = () => (dispatch) => {
  apiInstanceFetch
    .get(`continentRegion`)
    .then((res) => {
      dispatch({ type: GET_CONTINENT_REGION, payload: res.region });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

//Insert Region
export const insertRegion = (data) => (dispatch) => {
  axios
    .post(`continentRegion/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_CONTINENT_REGION, payload: res.data.region });
        dispatch({ type: CLOSE_CONTINENT_REGION_DIALOG });
        dispatch({
          type: OPEN_CONTINENT_REGION_TOAST,
          payload: { data: "Insert Country Successful ✔", for: "insert" },
        });
      } else {
        Toast("error", res.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update Region
export const updateRegion = (regionId, data) => (dispatch) => {
  axios
    .patch(`continentRegion/update?regionId=${regionId}`, data)
    .then((res) => {
      if (res.data.status) {

        dispatch({ type: CLOSE_CONTINENT_REGION_DIALOG });
        dispatch({
          type: UPDATE_CONTINENT_REGION,
          payload: { data: res.data.region, id: regionId },
        });

        dispatch({
          type: OPEN_CONTINENT_REGION_TOAST,
          payload: { data: "Update Country Successful ✔", for: "update" },
        });
      } else {
        Toast("error", res.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete Region
export const deleteRegion = (regionId) => (dispatch) => {
  axios
    .delete(`continentRegion/delete/?regionId=${regionId}`)
    .then((res) => {
      dispatch({ type: DELETE_CONTINENT_REGION, payload: regionId });
    })
    .catch((error) => {
      console.log(error);
    });
};
