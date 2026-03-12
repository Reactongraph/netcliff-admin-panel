//axios

import axios from "axios";
import uploadFileTypes, { CLOSE_EPISODE_TOAST } from "./episode.type";

//Type
import {
  DELETE_EPISODE,
  GET_EPISODE,
  INSERT_EPISODE,
  OPEN_EPISODE_TOAST,
  UPDATE_EPISODE,
  UPDATE_EPISODE_STATUS,
} from "./episode.type";

//toast
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

//get Episode
export const getEpisode = () => (dispatch) => {
  apiInstanceFetch
    .get(`episode`)
    .then((result) => {
      dispatch({ type: GET_EPISODE, payload: result.episode });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get Episode
export const getAllEpisode = (mongoId, seasons) => (dispatch) => {
  // axios
  //   .get(`episode/seasonWiseEpisodes?movieId=${mongoId}&season=${seasons}`)
  //   .then((result) => {
  //     console.log(result.data);
  //     dispatch({ type: GET_EPISODE, payload: result.data.episode });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

//get season wise episode
export const getMovieEpisode = (dialogData, seasons) => (dispatch) => {
  apiInstanceFetch
    .get(`episode/seasonWiseEpisode?movieId=${dialogData}&seasonId=${seasons}`)
    .then((res) => {
      dispatch({ type: GET_EPISODE, payload: res.episode });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Insert Episode
export const insertEpisode = (formData) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`episode/create`, formData)
      .then((res) => {
        if (res.data.status === true) {
          dispatch({ type: INSERT_EPISODE, payload: res.data.Episode });

          dispatch({
            type: OPEN_EPISODE_TOAST,
            payload: { data: "Insert Episode Successful ✔", for: "insert" },
          });
          resolve(res.data);
        } else {
          dispatch({
            type: CLOSE_EPISODE_TOAST,
            payload: { data: res.data.message, for: "insert" },
          });
          Toast("error", res.data.message);
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        Toast("error", errorMessage);
        reject(error);
      });
  });
};

//Update Episode
export const updateEpisode = (data, mongoId) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(`episode/update?episodeId=${mongoId}`, data)
      .then((res) => {
        if (res?.data?.status) {
          dispatch({
            type: UPDATE_EPISODE,
            payload: { data: res.data.episode, id: mongoId },
          });

          dispatch({
            type: OPEN_EPISODE_TOAST,
            payload: { data: "Update Episode Successful ✔", for: "update" },
          });
          resolve(res.data);
        } else {
          Toast("error", res.data.message);
          reject(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        Toast("error", errorMessage);
        reject(error);
      });
  });
};

//Delete Episode
export const deleteEpisode = (mongoId) => (dispatch) => {
  axios
    .delete(`episode/delete?episodeId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_EPISODE, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Update episode status
export const updateEpisodeStatus = (episodeId, status) => (dispatch) => {
  axios
    .patch(`episode/updateStatus?episodeId=${episodeId}`, { status })
    .then((res) => {
      if (res.data.status) {
        // Update the episode status locally in the state
        dispatch({
          type: UPDATE_EPISODE_STATUS,
          payload: { episodeId, status }
        });
        dispatch({
          type: OPEN_EPISODE_TOAST,
          payload: { data: "Status updated successfully ✔", for: "update" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", "Failed to update status");
    });
};

export const setUploadFile = (data) => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: data,
});

export const setUploadProgress = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
});

export const successUploadFile = (id) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
});

export const failureUploadFile = (id) => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE,
  payload: id,
});

export const uploadFile = (files, data, mongoId, update) => (dispatch) => {
  if (!mongoId && files.length && data.videoType == 7) {
    files.map((file, index) => {
      const formPayload = new FormData();
      formPayload.append("videoUrl", file.file);
      formPayload.append("name", data.name);
      formPayload.append("movie", data.movies);
      formPayload.append("image", data.image);
      formPayload.append("episodeNumber", data.episodeNumber);
      formPayload.append("season", data.seasonNumber);
      formPayload.append("videoType", data.videoType);

      axios
        .post(`episode/create`, formPayload, formPayload, {
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            const percentageProgress = Math.floor((loaded / total) * 100);
            dispatch(setUploadProgress(file.id, percentageProgress));
          },
        })
        .then((res) => {
          if (res.data.status === true) {
            dispatch(successUploadFile(file.id));
            Toast("success", "Insert Episode Successful ✔");
          } else {
            Toast("error", res.data.message);
            return res.data.message, "error";
          }
        })

        .catch((res) => {
          dispatch(failureUploadFile(file.id));
        });
    });
  }
  if (mongoId && files.length && data.videoType == 7) {
    files.map((file, index) => {
      const formPayload = new FormData();
      formPayload.append("videoUrl", file.file);
      formPayload.append("name", data.name);
      formPayload.append("movie", data.movies);
      formPayload.append("image", data.image);
      formPayload.append("episodeNumber", data.episodeNumber);
      formPayload.append("season", data.seasonNumber);
      formPayload.append("videoType", data.videoType);

      axios
        .patch(`episode/update?episodeId=${mongoId}`, formPayload, {
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            const percentageProgress = Math.floor((loaded / total) * 100);
            dispatch(setUploadProgress(file.id, percentageProgress));
          },
        })
        .then((res) => {
          dispatch(successUploadFile(file.id));

          if (res.status) {
            console.log("::: ", res.data);
            dispatch({
              type: UPDATE_EPISODE,
              payload: { data: res.data.episode, id: mongoId },
            });

            if (update == "update") {
              Toast("info", "Update Episode Successful ✔");
            }
          } else {
            Toast("error", res.data.message);
            return res.data.message, "error";
          }
        })
        .catch((error) => {
          // dispatch(failureUploadFile(file.id));
          console.log(error);
        });
    });
  }
  if (mongoId && data.videoType != 7) {
    const formPayload = new FormData();
    formPayload.append("name", data.name);

    formPayload.append("movie", data.movies);
    formPayload.append("image", data.image);
    formPayload.append("episodeNumber", data.episodeNumber);
    formPayload.append("season", data.seasonNumber);
    formPayload.append("videoType", data.videoType);

    if (data.videoType == 0) {
      formPayload.append("videoUrl", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("videoUrl", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("videoUrl", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("videoUrl", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("videoUrl", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("videoUrl", data.webmUrl);
    } else {
      formPayload.append("videoUrl", data.embedUrl);
    }

    axios
      .patch(`episode/update?episodeId=${mongoId}`, formPayload)
      .then((res) => {
        if (res.data.status === true) {
          dispatch({
            type: UPDATE_EPISODE,
            payload: { data: res.data.episode, id: mongoId },
          });

          if (update == "update") {
            Toast("info", "Update Episode Successful ✔");
          }
        } else {
          Toast("error", res.data.message);
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (!mongoId && data.videoType != 7) {
    const formPayload = new FormData();
    formPayload.append("name", data.name);

    formPayload.append("movie", data.movies);
    formPayload.append("image", data.image);
    formPayload.append("episodeNumber", data.episodeNumber);
    formPayload.append("season", data.seasonNumber);
    formPayload.append("videoType", data.videoType);

    if (data.videoType == 0) {
      formPayload.append("videoUrl", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("videoUrl", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("videoUrl", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("videoUrl", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("videoUrl", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("videoUrl", data.webmUrl);
    } else {
      formPayload.append("videoUrl", data.embedUrl);
    }
    axios
      .post(`episode/create`, formPayload)
      .then((res) => {
        if (res.data.status === true) {
          dispatch({
            type: INSERT_EPISODE,
            payload: { data: res.data.episode },
          });

          if (update == "update") {
            Toast("success", "Insert Episode Successful ✔");
          }
        } else {
          Toast("error", res.data.message);
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
