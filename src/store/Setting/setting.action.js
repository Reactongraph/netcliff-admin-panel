import axios from "axios";

import {
  GET_SETTING,
  UPDATE_SETTING,
  OPEN_SETTING_TOAST,
  SWITCH_ACCEPT,
} from "./setting.type";
import { setToast } from "../../util/Toast";
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

/**
 * Update login screen thumbnail (image for slow networks, video for fast).
 * Accepts either files (multipart) or URLs (JSON). Omitted fields are left unchanged.
 * @param {string} mongoId - Setting document ID
 * @param {Object} payload - { imageFile?, videoFile?, loginScreenThumbnailImage?, loginScreenThumbnailVideo? }
 */
export const updateLoginScreenThumbnail = (mongoId, payload) => (dispatch) => {
  const hasFiles = payload.imageFile || payload.videoFile;

  if (hasFiles) {
    const formData = new FormData();
    formData.append("settingId", mongoId);
    if (payload.imageFile) formData.append("image", payload.imageFile);
    if (payload.videoFile) formData.append("video", payload.videoFile);
    if (payload.loginScreenThumbnailImage && !payload.imageFile)
      formData.append("loginScreenThumbnailImage", payload.loginScreenThumbnailImage);
    if (payload.loginScreenThumbnailVideo && !payload.videoFile)
      formData.append("loginScreenThumbnailVideo", payload.loginScreenThumbnailVideo);

    axios
      .patch(`setting/thumbnail?settingId=${mongoId}`, formData)
      .then((res) => {
        if (res.data.status) {
          if (res.data.setting) {
            dispatch({ type: GET_SETTING, payload: res.data.setting });
          } else {
            dispatch(getSetting());
          }
          dispatch({
            type: OPEN_SETTING_TOAST,
            payload: { data: res.data.message || "Login screen thumbnail updated successfully", for: "update" },
          });
        } else {
          setToast(res.data.message || "Update failed", "error");
        }
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message || "Update failed";
        setToast(msg, "error");
      });
  } else {
    const data = {};
    if (payload.loginScreenThumbnailImage !== undefined)
      data.loginScreenThumbnailImage = payload.loginScreenThumbnailImage;
    if (payload.loginScreenThumbnailVideo !== undefined)
      data.loginScreenThumbnailVideo = payload.loginScreenThumbnailVideo;
    if (Object.keys(data).length === 0) {
      setToast("Provide at least an image or video (file or URL)", "error");
      return;
    }

    axios
      .patch(`setting/thumbnail?settingId=${mongoId}`, data)
      .then((res) => {
        if (res.data.status) {
          if (res.data.setting) {
            dispatch({ type: GET_SETTING, payload: res.data.setting });
          } else {
            dispatch(getSetting());
          }
          dispatch({
            type: OPEN_SETTING_TOAST,
            payload: { data: res.data.message || "Login screen thumbnail updated successfully", for: "update" },
          });
        } else {
          setToast(res.data.message || "Update failed", "error");
        }
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message || "Update failed";
        setToast(msg, "error");
      });
  }
};

export const getSetting = () => (dispatch) => {
  apiInstanceFetch
    .get("setting")
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_SETTING, payload: res.setting });
        // dispatch({
        //   type: OPEN_SETTING_TOAST,
        //   payload: { data: "Inserted Successfully ✔", for: "insert" },
        // });
      } else {
        console.log("error", res.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const updateSetting = (mongoId, data) => (dispatch) => {
  axios
    .patch(`setting/update?settingId=${mongoId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_SETTING, payload: res.data.setting });
        dispatch({
          type: OPEN_SETTING_TOAST,
          payload: { data: "Updated Successfully ✔", for: "update" },
        });
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const handleSwitch = (mongoId, type, value) => (dispatch) => {
  axios
    .patch(`setting?settingId=${mongoId}&type=${type}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SWITCH_ACCEPT, payload: res.data.setting });
        dispatch({
          type: OPEN_SETTING_TOAST,
          payload: {},
        });
        Toast(
          "success",
          `${type === "IptvAPI" ? "Live TV" : type} is ${
            value !== true ? "Active" : "Enable"
          } `
        );
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};
