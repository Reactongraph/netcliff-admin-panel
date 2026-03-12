import uploadFileTypes, { MANUAL_CREATE_SERIES } from "./tvSeries.type";
//Type
import {
  GET_TV_SERIES,
  INSERT_TV_SERIES,
  UPDATE_TV_SERIES,
  DELETE_TV_SERIES,
  OPEN_TV_SERIES_TOAST,
  IS_NEW_RELEASE_SWITCH,
  TV_SERIES_DETAILS,
  GET_COMMENT,
  DELETE_COMMENT,
  TV_SERIES_DETAILS_TMDB,
} from "./tvSeries.type";

//axios
import axios from "axios";
import { Toast } from "../../util/Toast_";
import { baseURL, secretKey } from "../../util/config";
import { CLOSE_LOADER } from "../Loader/loader.type";
import { apiInstanceFetch } from "../../util/api";

//get movie
export const getSeries =
  (start, limit, search, featured, newReleased) => (dispatch) => {
    apiInstanceFetch
      .get(
        `movie/all?type=WEBSERIES&&start=${start}&&limit=${limit}&search=${search}&featured=${featured}&newReleased=${newReleased}`
      )
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_TV_SERIES,
            payload: {
              movie: res.movie,
              totalSeries: res?.totalMoviesWebSeries,
            },
          });
          dispatch({ type: CLOSE_LOADER });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

//get movie only if category web series
export const getMovieCategory = () => (dispatch) => {
  apiInstanceFetch
    .get(`episode/series?type=SERIES`)
    .then((res) => {
      dispatch({ type: GET_TV_SERIES, payload: res.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get top 10 movie
// export const getTop10Movie = () => (dispatch) => {
//   axios
//     .get(`movie/AllTop10?type=MOVIE`)
//     .then((res) => {
//
//       dispatch({ type: GET_TOP_10_MOVIE, payload: res.data.movie });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

//get top 10 web-series
// export const getTop10WebSeries = () => (dispatch) => {
//   axios
//     .get(`movie/AllTop10?type=WEB-SERIES`)
//     .then((res) => {
//
//       dispatch({ type: GET_TOP_10_WEB_SERIES, payload: res.data.movie });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

//update movie
// export const updateMovie = (data, movieId) => (dispatch) => {
//   console.log(movieId);

//   axios
//     .patch(`movie/movieId?movieId=${movieId}`, data)
//     .then((res) => {
//       if (res.status) {
//
//         dispatch({
//           type: UPDATE_MOVIE,
//           payload: { data: res.data.movie, id: movieId },
//         });

//         dispatch({
//           type: OPEN_MOVIE_TOAST,
//           payload: { data: "Update Movie Successful ✔", for: "update" },
//         });
//       } else {
//         return res.data.message, "error";
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

//delete movie
export const deleteSeries = (seriesId) => (dispatch) => {
  axios
    .delete(`movie/delete?movieId=${seriesId}`)
    .then((result) => {
      dispatch({ type: DELETE_TV_SERIES, payload: seriesId });
    })
    .catch((error) => {
      console.log(error);
    });
};

//newReleased switch
export const newRelease = (seriesId) => (dispatch) => {
  axios
    .patch(`movie/isNewRelease?movieId=${seriesId}`)
    .then((res) => {
      dispatch({
        type: IS_NEW_RELEASE_SWITCH,
        payload: { data: res.data.movie, id: seriesId },
      });
      Toast("success", "New release update successfully..");
    })
    .catch((error) => {
      console.log(error);
    });
};

//view movie details
export const viewDetails = (seriesId) => (dispatch) => {
  apiInstanceFetch
    .get(`movie/details?movieId=${seriesId}`)
    .then((result) => {
      dispatch({ type: TV_SERIES_DETAILS, payload: result.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get comment
export const getComment = (seriesId, type) => (dispatch) => {
  apiInstanceFetch
    .get(`comment/getComments?movieId=${seriesId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_COMMENT, payload: res.comment });
      } else {
        dispatch({ type: GET_COMMENT, payload: res.comment });
      }
    })
    .catch((error) => console.log("error", error.message));
};

//delete comment
export const deleteComment = (commentId) => (dispatch) => {
  axios
    .delete(`comment?commentId=${commentId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: DELETE_COMMENT, payload: commentId });
      } else {
        console.log("error", res.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const setUploadTvFile = (data) => ({
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

//   const formPayload = new FormData();
//   for (var i = 0; i < data.genres?.length; i++) {
//     formPayload.append("genre", data.genres[i]);
//   }
//   formPayload.append("title", data.title);
//   formPayload.append("description", data.description);
//   formPayload.append("year", data.year);
//   formPayload.append("image", data.image);
//   formPayload.append("type", data.type);
//   formPayload.append("thumbnail", data.thumbnail);
//   formPayload.append("runtime", data.runtime);
//   formPayload.append("region", data.country);

//   if (!seriesId && !files?.length && data) {
//     ;
//     axios
//       .post(`movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=WEBSERIES`)
//       .then((res) => {
//         if (res.data.status === true) {
//           ;
//
//           dispatch(successUploadFile());

//           dispatch({
//             type: OPEN_TV_SERIES_TOAST,
//             payload: { data: "Insert TV Series Successful ✔", for: "insert" },
//           });
//         } else {
//           return res.data.message, "error";
//         }
//       })
//       .catch((error) => {
//
//       });
//   } else {
//     ;
//     axios
//       .patch(`movie/movieId?movieId=${seriesId}`, formPayload)
//       .then((res) => {
//         ;
//         if (res.status) {
//
//           dispatch({
//             type: UPDATE_TV_SERIES,
//             payload: { data: res.data.movie, id: seriesId },
//           });

//           dispatch({
//             type: OPEN_TV_SERIES_TOAST,
//             payload: { data: "Update TV Series Successful ✔", for: "update" },
//           });
//         } else {
//           return res.data.message, "error";
//         }
//       })
//       .catch((error) => {
//       });
//   }
// };

export const uploadTvFile = (files, data, seriesId, update) => (dispatch) => {
  if (files.length) {
    files.map((file) => {
      const formPayload = new FormData();

      // Only append genres if they exist
      if (data.genres && data.genres.length > 0) {
        for (var i = 0; i < data.genres.length; i++) {
          formPayload.append("genre", data.genres[i]);
        }
      }

      formPayload.append("title", data.title);
      formPayload.append("description", data.description || "");
      formPayload.append("year", data.year || "");
      formPayload.append("image", data.image);
      formPayload.append("type", data.type || "Premium");
      formPayload.append("thumbnail", data.thumbnail);
      formPayload.append("runtime", data.runtime || "");
      formPayload.append("region", data.country || "");

      if (!seriesId) {
        axios
          .post(
            `movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=WEBSERIES`,
            formPayload,
            {
              onUploadProgress: (progress) => {
                const { loaded, total } = progress;
                const percentageProgress = Math.floor((loaded / total) * 100);
                dispatch(setUploadProgress(file.id, percentageProgress));
              },
            }
          )
          .then((res) => {
            if (res.data.status) {
              dispatch(successUploadFile(file.id));

              dispatch({
                type: OPEN_TV_SERIES_TOAST,
                payload: {
                  data: "Insert TV Series Successful ✔",
                  for: "insert",
                },
              });
            } else {
              return res.data.message, "error";
            }
          })
          .catch((res) => {
            dispatch(failureUploadFile(file.id));
          });
      } else {
        axios
          .patch(`movie/movieId?movieId=${seriesId}`, formPayload, {
            onUploadProgress: (progress) => {
              const { loaded, total } = progress;
              const percentageProgress = Math.floor((loaded / total) * 100);
              dispatch(setUploadProgress(file.id, percentageProgress));
            },
          })
          .then((res) => {
            dispatch(successUploadFile(file.id));

            if (res.status) {
              dispatch({
                type: UPDATE_TV_SERIES,
                payload: { data: res.data.movie, id: seriesId },
              });

              if (update == "update") {
                dispatch({
                  type: OPEN_TV_SERIES_TOAST,
                  payload: {
                    data: "Update TV Series Successful ✔",
                    for: "update",
                  },
                });
              }
            } else {
              return res.data.message, "error";
            }
          })
          .catch((error) => {
            dispatch(failureUploadFile(file.id));
            console.log(error);
          });
      }
    });
  }
  if (seriesId && files?.length === 0) {
    const formPayload = new FormData();

    // Only append genres if they exist
    if (data.genres && data.genres.length > 0) {
      for (var i = 0; i < data.genres.length; i++) {
        formPayload.append("genre", data.genres[i]);
      }
    }

    formPayload.append("title", data.title);
    formPayload.append("description", data.description || "");
    formPayload.append("year", data.year || "");
    formPayload.append("image", data.image);
    formPayload.append("type", data.type || "Premium");
    formPayload.append("thumbnail", data.thumbnail);
    formPayload.append("runtime", data.runtime || "");
    formPayload.append("region", data.country || "");

    axios
      .patch(`movie/movieId?movieId=${seriesId}`, formPayload)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: UPDATE_TV_SERIES,
            payload: { data: res.data.movie, id: seriesId },
          });

          if (update === "update") {
            dispatch({
              type: OPEN_TV_SERIES_TOAST,
              payload: { data: "Update TV Series Successful ✔", for: "update" },
            });
          }
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!seriesId && files.length === 0) {
    const formData = new FormData();

    axios
      .post(
        `movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=WEBSERIES`,
        formData
      )
      .then((res) => {
        if (res.data.status) {
          dispatch(successUploadFile());

          dispatch({
            type: OPEN_TV_SERIES_TOAST,
            payload: { data: "Insert TV Series Successful ✔", for: "insert" },
          });
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

//get movie detail from tmdb
export const loadSeriesData = (tmdbId, tmdbTitle) => (dispatch) => {
  const url = tmdbId
    ? `movie/getStoredetails?IMDBid=${tmdbId}&type=WEBSERIES`
    : `movie/getStoredetails?title=${tmdbTitle}&type=WEBSERIES`;
  apiInstanceFetch
    .get(url)
    .then((res) => {
      if (res.status === true) {
        dispatch({ type: TV_SERIES_DETAILS_TMDB, payload: res.series });
        Toast("success", "Data Imported Successfully ✔");
      } else {
        Toast("error", "No data found in database.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createManualSeries = (fromData) => (dispatch) => {
  return axios
    .post(`movie/createSeries`, fromData)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        dispatch({ type: MANUAL_CREATE_SERIES, payload: res.data.movie });
        Toast("success", "Insert TV Series Successful ✔");
        return { status: true, data: res.data };
      } else {
        Toast("error", res.data.message);
        return { status: false, error: res.data.message };
      }
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to create series";
      Toast("error", errorMessage);
      return { status: false, error: errorMessage };
    });
};

export const updateTvSeries = (seriesId, data) => (dispatch) => {
  return axios
    .patch(`movie/update?movieId=${seriesId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: UPDATE_TV_SERIES,
          payload: { data: res.data.movie, id: seriesId },
        });
        Toast("success", "Update Successful ✔");
        return { status: true, data: res.data };
      } else {
        Toast("error", res.data.message);
        return { status: false, error: res.data.message };
      }
    })
    .catch((error) => {
      console.log("error", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to update series";
      return { status: false, error: errorMessage };
    });
};

export const ImdbSeriesCreate = (data) => (dispatch) => {
  axios
    .post(`movie/getStore?TmdbMovieId=${data?.tmdbId}&type=WEBSERIES`, data)
    .then((res) => {
      console.log("res.data", res.data);
      if (res.data.status) {
        dispatch({ type: INSERT_TV_SERIES, payload: res.data.movie });
        Toast("success", "Movie Create  SuccessFully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

// Update series status
export const updateSeriesStatus = (seriesId, status) => (dispatch) => {
  axios
    .patch(`movie/updateStatus?movieId=${seriesId}`, { status })
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: UPDATE_TV_SERIES,
          payload: { data: res.data.movie, id: seriesId },
        });
        dispatch({
          type: OPEN_TV_SERIES_TOAST,
          payload: { data: "Status updated successfully ✔", for: "update" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast("error", "Failed to update status");
    });
};
