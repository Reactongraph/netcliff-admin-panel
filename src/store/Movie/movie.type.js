//get Movie
export const GET_MOVIE = "GET_MOVIE";

//get top 10 Movie
export const GET_TOP_10_MOVIE = "GET_TOP_10_MOVIE";

//get top 10 web-series
export const GET_TOP_10_WEB_SERIES = "GET_TOP_10_WEB_SERIES";

//Movie Details
export const MOVIE_DETAILS = "MOVIE_DETAILS";

//dialog type
export const OPEN_MOVIE_DIALOG = "OPEN_MOVIE_DIALOG";
export const CLOSE_DIALOG = "CLOSE_DIALOG";

//insert
export const INSERT_MOVIE = "INSERT_MOVIE";

// id-list
export const GET_ID_LIST_MOVIE = "GET_ID_LIST_MOVIE";
export const GET_ID_LIST_WEBSERIES = "GET_ID_LIST_WEBSERIES";

//update
export const UPDATE_MOVIE = "UPDATE_MOVIE";

//delete Movie
export const DELETE_MOVIE = "DELETE_MOVIE";

//newReleased Switch
export const IS_NEW_RELEASE_SWITCH = "IS_NEW_RELEASE_SWITCH";

//get comment
export const GET_COMMENT = "GET_COMMENT";

//delete comment
export const DELETE_COMMENT = "DELETE_COMMENT";

//toast
export const OPEN_MOVIE_TOAST = "OPEN_MOVIE_TOAST";
export const CLOSE_MOVIE_TOAST = "CLOSE_MOVIE_TOAST";

//Movie Details From TMDB
export const MOVIE_DETAILS_TMDB = "MOVIE_DETAILS_TMDB";

const uploadFileTypes = {
  SET_UPLOAD_FILE: "SET_UPLOAD_FILE",

  SET_UPLOAD_PROGRESS: "SET_UPLOAD_PROGRESS",
  SUCCESS_UPLOAD_FILE: "SUCCESS_UPLOAD_FILE",
  FAILURE_UPLOAD_FILE: "FAILURE_UPLOAD_FILE",

  //manual movie
  SET_UPLOAD_FILE_MANUAL: "SET_UPLOAD_FILE_MANUAL",

  SET_UPLOAD_PROGRESS_MANUAL: "SET_UPLOAD_PROGRESS_MANUAL",
  SUCCESS_UPLOAD_FILE_MANUAL: "SUCCESS_UPLOAD_FILE_MANUAL",
  FAILURE_UPLOAD_FILE_MANUAL: "FAILURE_UPLOAD_FILE_MANUAL",
};

export const EMPTY_TMDB_MOVIES_DIALOGUE = "EMPTY_TMDB_MOVIES_DIALOGUE";

export default uploadFileTypes;

export const FILE_UPLOAD_SUCCESS = "FILE_UPLOAD_SUCCESS";
