import uploadFileTypes, {
  GET_ID_LIST_MOVIE,
  GET_ID_LIST_WEBSERIES,
} from "./movie.type";
//Type
import {
  GET_MOVIE,
  INSERT_MOVIE,
  CLOSE_DIALOG,
  UPDATE_MOVIE,
  DELETE_MOVIE,
  OPEN_MOVIE_TOAST,
  IS_NEW_RELEASE_SWITCH,
  MOVIE_DETAILS,
  GET_TOP_10_MOVIE,
  GET_TOP_10_WEB_SERIES,
  GET_COMMENT,
  DELETE_COMMENT,
  MOVIE_DETAILS_TMDB,
} from "./movie.type";

//axios
import axios from "axios";
import { Toast } from "../../util/Toast_";
import { useHistory } from "react-router-dom";
import { baseURL, secretKey } from "../../util/config";
import { CLOSE_LOADER } from "../Loader/loader.type";
import { apiInstanceFetch } from "../../util/api";
import { setToast } from "../../util/Toast";

//get movie
export const getMovie =
  (start, limit, search, featured, newReleased) => (dispatch) => {
    apiInstanceFetch
      .get(
        `movie/all?type=MOVIE&start=${start}&limit=${limit}&search=${search}&featured=${featured}&newReleased=${newReleased}`
      )
      .then((result) => {
        if (result.status) {
          dispatch({
            type: GET_MOVIE,
            payload: {
              movie: result.movie,
              totalMoviesWebSeries: result?.totalMoviesWebSeries,
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
      dispatch({ type: GET_MOVIE, payload: res.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get top 10 movie
export const getTop10Movie = () => (dispatch) => {
  apiInstanceFetch
    .get(`movie/AllTop10?type=MOVIE`)
    .then((res) => {
      dispatch({ type: GET_TOP_10_MOVIE, payload: res.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get top 10 web-series
export const getTop10WebSeries = () => (dispatch) => {
  apiInstanceFetch
    .get(`movie/AllTop10?type=WEB-SERIES`)
    .then((res) => {
      dispatch({ type: GET_TOP_10_WEB_SERIES, payload: res.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//update movie
export const updateMovie = (data, movieId) => (dispatch) => {
  axios
    .patch(`movie/update?movieId=${movieId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Movie updated  SuccessFully");
        dispatch({
          type: UPDATE_MOVIE,
          payload: { data: res.data.movie, id: movieId },
        });
      } else {
        Toast("error", res.data.message);
        return res.data.message, "error";
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//delete movie
export const deleteMovie = (movieId) => (dispatch) => {
  axios
    .delete(`movie/delete?movieId=${movieId}`)
    .then((result) => {
      dispatch({ type: DELETE_MOVIE, payload: movieId });
    })
    .catch((error) => {
      console.log(error);
    });
};

//newReleased switch
export const newRelease = (movieId) => (dispatch) => {
  axios
    .patch(`movie/isNewRelease?movieId=${movieId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: IS_NEW_RELEASE_SWITCH,
          payload: { data: res.data.movie, id: movieId },
        });

        Toast("success", "Update Successfully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//view movie details
export const viewDetails = (movieId) => (dispatch) => {
  apiInstanceFetch
    .get(`movie/details?movieId=${movieId}`)
    .then((result) => {
      dispatch({ type: MOVIE_DETAILS, payload: result.movie });
    })
    .catch((error) => {
      console.log(error);
    });
};

//get comment
export const getComment = (movieId, type) => (dispatch) => {
  apiInstanceFetch
    .get(`comment/getComments?movieId=${movieId}`)
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

export const uploadFile = (files, data, movieId, update) => (dispatch) => {
  if (files.length && data.videoType == 7) {
    files.map((file, index) => {
      if (!movieId) {
        const formPayload = new FormData();
        formPayload.append("videoType", data.videoType);
        formPayload.append("link", file.file);
        axios
          .post(
            `movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=MOVIE`,
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
              Toast("success", "Insert Movie Successful ✔");
            } else {
              return res.data.message, "error";
            }
          })

          .catch((res) => {
            dispatch(failureUploadFile(file.id));
          });
      } else {
        const formPayload = new FormData();
        for (var i = 0; i < data.genres?.length; i++) {
          formPayload.append("genre", data.genres[i]);
        }

        formPayload.append("title", data.title);
        formPayload.append("description", data.description);
        formPayload.append("year", data.year);
        formPayload.append("image", data.image);
        formPayload.append("type", data.type);
        formPayload.append("thumbnail", data.thumbnail);
        formPayload.append("runtime", data.runtime);
        formPayload.append("videoType", data.videoType);
        formPayload.append("region", data.country);
        formPayload.append("link", file.file);

        axios
          .patch(`movie/update?movieId=${movieId}`, formPayload, {
            onUploadProgress: (progress) => {
              const { loaded, total } = progress;
              const percentageProgress = Math.floor((loaded / total) * 100);
              dispatch(setUploadProgress(file.id, percentageProgress));
            },
          })
          .then((res) => {
            dispatch(successUploadFile(file.id));

            if (res.status) {
              console.log(":::::::::::", res.data);

              dispatch({
                type: UPDATE_MOVIE,
                payload: { data: res.data.movie, id: movieId },
              });

              if (update == "update") {
                Toast("info", "Update Movie Successful ✔");
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
  if (movieId && data.videoType != 7) {
    const formPayload = new FormData();
    for (var i = 0; i < data.genres?.length; i++) {
      formPayload.append("genre", data.genres[i]);
    }

    formPayload.append("title", data.title);
    formPayload.append("description", data.description);
    formPayload.append("year", data.year);
    formPayload.append("image", data.image);
    formPayload.append("type", data.type);
    formPayload.append("thumbnail", data.thumbnail);
    formPayload.append("runtime", data.runtime);
    formPayload.append("videoType", data.videoType);
    formPayload.append("region", data.country);
    formPayload.append("TmdbMovieId", data.TmdbMovieId);
    if (data.videoType == 0) {
      formPayload.append("link", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("link", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("link", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("link", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("link", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("link", data.webmUrl);
    } else {
      formPayload.append("link", data.embedUrl);
    }

    axios
      .patch(`movie/update?movieId=${movieId}`, formPayload)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: UPDATE_MOVIE,
            payload: { data: res.data.movie, id: movieId },
          });

          if (update == "update") {
            Toast("info", "Update Movie Successful ✔");
          }
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (!movieId && data.videoType != 7 && files.length === 0) {
    const formPayload = new FormData();
    formPayload.append("videoType", data.videoType);
    if (data.videoType == 0) {
      formPayload.append("link", data.youtubeUrl);
    } else if (data.videoType == 1) {
      formPayload.append("link", data.m3u8Url);
    } else if (data.videoType == 2) {
      formPayload.append("link", data.movUrl);
    } else if (data.videoType == 3) {
      formPayload.append("link", data.mp4Url);
    } else if (data.videoType == 4) {
      formPayload.append("link", data.mkvUrl);
    } else if (data.videoType == 5) {
      formPayload.append("link", data.webmUrl);
    } else {
      formPayload.append("link", data.embedUrl);
    }

    axios
      .post(
        `movie/getStore?TmdbMovieId=${data.tmdbMovieId}&type=MOVIE`,
        formPayload
      )
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: INSERT_MOVIE, payload: res.data.movie });
          Toast("success", "Insert Movie Successful ✔");
        } else {
          return res.data.message, "error";
        }
      })
      .catch((error) => console.log(error));
  }
};

export const setUploadFileManual = (data) => ({
  type: uploadFileTypes.SET_UPLOAD_FILE_MANUAL,
  payload: data,
});

export const setUploadProgressManual = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS_MANUAL,
  payload: {
    id,
    progress,
  },
});

export const successUploadFileManual = (id) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE_MANUAL,
  payload: id,
});

export const failureUploadFileManual = (id) => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE_MANUAL,
  payload: id,
});

//create manual movie
export const manualMovie = (files, data) => (dispatch) => {
  if (files.length && data.videoType == 7) {
    files.map((file, index) => {
      const formPayload = new FormData();

      for (var i = 0; i < data.genres?.length; i++) {
        formPayload.append("genre", data.genres[i]);
      }
      formPayload.append("videoType", data.videoType);
      formPayload.append("link", file.file);
      formPayload.append("title", data.title);
      formPayload.append("description", data.description);
      formPayload.append("year", data.year);
      formPayload.append("region", data.country);
      formPayload.append("image", data.image);
      formPayload.append("type", data.type);
      formPayload.append("thumbnail", data.thumbnail);
      formPayload.append("runtime", data.runtime);
      formPayload.append("trailerName", data.trailerName);
      formPayload.append("trailerType", data.trailerType);
      formPayload.append("trailerVideoType", data.trailerVideoType);
      formPayload.append("trailerImage", data.trailerImage);
      formPayload.append(
        "trailerVideoUrl",
        data.trailerVideoType == 0 ? data.trailerVideoUrl : data.trailerVideo
      );

      axios
        .post(`movie/create`, formPayload, {
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            const percentageProgress = Math.floor((loaded / total) * 100);
            dispatch(setUploadProgressManual(file.id, percentageProgress));
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            dispatch(successUploadFileManual(file.id));
            Toast("success", "Insert Movie Successful ✔");
          } else {
            return res.data.message, "error";
          }
        })

        .catch((error) => {
          console.error("error", error);
          dispatch(failureUploadFileManual(file.id));
        });
    });
  }
};

//get movie detail from tmdb
export const loadMovieData = (tmdbId, tmdbTitle) => (dispatch) => {
  const url = tmdbId
    ? `movie/getStoredetails?IMDBid=${tmdbId}&type=MOVIE`
    : `movie/getStoredetails?title=${tmdbTitle}&type=MOVIE`;
  apiInstanceFetch
    .get(url)
    .then((res) => {
      if (res.status == true) {
        dispatch({ type: MOVIE_DETAILS_TMDB, payload: res.movie });
        Toast("success", "Data Imported Successfully ✔");
      } else {
        Toast("error", "No data found in database.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createManual = (formData, history) => (dispatch) => {
  axios
    .post("movie/create", formData)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Movie Create  SuccessFully");
        dispatch({ type: INSERT_MOVIE, payload: res.data.movie });
        if (history) {
          sessionStorage.setItem("trailerId", res.data.movie?._id);
          localStorage.setItem("trailerId", res.data.movie?._id);
          localStorage.setItem(
            "updateMovieData1",
            JSON.stringify(res.data.movie)
          );
          localStorage.setItem("trailerId", JSON.stringify(res.data.movie));
          localStorage.setItem("movieTitle", res.data.movie?.title);
          history.push("/admin/movie/trailer");
        }
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

export const ImdbMovieCreate = (data) => (dispatch) => {
  axios
    .post(`movie/getStore?TmdbMovieId=${data.tmdbId}&type=MOVIE`, data)
    .then((res) => {
      console.log("res.data", res.data);
      if (res.data.status) {
        dispatch({ type: INSERT_MOVIE, payload: res.data.movie });
        Toast("success", "Movie Create  SuccessFully");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error));
};

export const getMovieIdList = () => (dispatch) => {
  apiInstanceFetch
    .get(`movie/id-list?type=MOVIE`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_ID_LIST_MOVIE, payload: res.list });
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const getWebSeriesIdList = () => (dispatch) => {
  apiInstanceFetch
    .get(`movie/id-list?type=WEB-SERIES`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_ID_LIST_WEBSERIES, payload: res.list });
      }
    })
    .catch((error) => console.log("error", error.message));
};
