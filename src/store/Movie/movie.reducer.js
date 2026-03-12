import uploadFileTypes, {
  FILE_UPLOAD_SUCCESS,
  GET_ID_LIST_MOVIE,
  GET_ID_LIST_WEBSERIES,
} from "./movie.type";

//Type
import {
  CLOSE_DIALOG,
  DELETE_MOVIE,
  GET_MOVIE,
  INSERT_MOVIE,
  OPEN_MOVIE_DIALOG,
  UPDATE_MOVIE,
  OPEN_MOVIE_TOAST,
  CLOSE_MOVIE_TOAST,
  IS_NEW_RELEASE_SWITCH,
  DELETE_SWITCH,
  MOVIE_DETAILS,
  GET_TOP_10_MOVIE,
  GET_TOP_10_WEB_SERIES,
  GET_COMMENT,
  DELETE_COMMENT,
  MOVIE_DETAILS_TMDB,
  EMPTY_TMDB_MOVIES_DIALOGUE,
} from "./movie.type";

import { modifyFiles } from "../../util/ModifyFiles";

//Define initialState
const initialState = {
  movie: [],
  web_Series: [],
  comment: [],
  movieDetails: [],
  movieDetailsTmdb: {},
  dialog: false,
  dialogData: null,
  isTost: false,
  toastData: null,
  actionFor: null,
  fileProgress: {},
  totalMovie: 0,
  fileUpload: false,
  fileUploadData: null,
  showData: false,
  idListMovie: [],
  idListWebSeries: [],
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Movie
    case GET_MOVIE:
      return {
        ...state,
        movie: action.payload.movie,
        totalMovie: action.payload.totalMoviesWebSeries,
      };

    //Get movie-detail from tmdb
    case MOVIE_DETAILS_TMDB:
      return {
        ...state,
        movieDetailsTmdb: action.payload,
        showData: true,
      };

    //Get Movie
    case GET_TOP_10_MOVIE:
      return {
        ...state,
        movie: action.payload,
      };

    //Get Movie
    case GET_TOP_10_WEB_SERIES:
      return {
        ...state,
        web_Series: action.payload,
      };

    //Get Movie Details
    case MOVIE_DETAILS:
      return {
        ...state,
        movieDetails: action.payload,
      };
    case EMPTY_TMDB_MOVIES_DIALOGUE:
      return {
        ...state,
        movieDetailsTmdb: {},
        showData: false,
      };

    //Update Movie
    case UPDATE_MOVIE:
      return {
        ...state,
        movie: state.movie.map((movie) =>
          movie._id === action.payload.id ? action.payload.data : movie
        ),
      };

    //Delete Movie
    case DELETE_MOVIE:
      return {
        ...state,
        movie: state.movie.filter((movie) => movie._id !== action.payload),
      };

    //newReleased Movie Switch
    case IS_NEW_RELEASE_SWITCH:
      return {
        ...state,
        movie: state?.movie?.map((movie) =>
          movie._id === action.payload.id ? action.payload.data : movie
        ),
      };

    //Open and Close Dialog
    case OPEN_MOVIE_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_DIALOG:
      return {
        ...state,
        dialogData: null,
      };

    //Open and Close Toast
    case OPEN_MOVIE_TOAST:
      return {
        ...state,
        isTost: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_MOVIE_TOAST:
      return {
        ...state,
        isTost: false,
        toastData: null,
        actionFor: null,
      };

    //get comment
    case GET_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };

    //delete comment
    case DELETE_COMMENT:
      return {
        ...state,
        comment: state.comment.filter(
          (comment) => comment._id !== action.payload
        ),
      };
    //Insert Movie
    case INSERT_MOVIE:
      const data = [...state.movie];
      data.unshift(action.payload);
      return {
        ...state,
        movie: data,
      };

    case GET_ID_LIST_MOVIE:
      return {
        ...state,
        idListMovie: action.payload,
      };
    case GET_ID_LIST_WEBSERIES:
      return {
        ...state,
        idListWebSeries: action.payload,
      };

    //background upload movie-video
    case uploadFileTypes.SET_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          ...modifyFiles(state.fileProgress, action.payload),
        },
      };
    case uploadFileTypes.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload.id]: {
            ...state.fileProgress[action.payload.id],
            progress: action.payload.progress,
          },
        },
      };

    case uploadFileTypes.SUCCESS_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: 1,
          },
        },
      };

    case uploadFileTypes.FAILURE_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: 0,
            progress: 0,
          },
        },
      };

    //manual movie
    case uploadFileTypes.SET_UPLOAD_FILE_MANUAL:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          ...modifyFiles(state.fileProgress, action.payload),
        },
      };

    case uploadFileTypes.SET_UPLOAD_PROGRESS_MANUAL:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload.id]: {
            ...state.fileProgress[action.payload.id],
            progress: action.payload.progress,
          },
        },
      };

    case uploadFileTypes.SUCCESS_UPLOAD_FILE_MANUAL:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: 1,
          },
        },
      };

    case uploadFileTypes.FAILURE_UPLOAD_FILE_MANUAL:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: 0,
            progress: 0,
          },
        },
      };

    case uploadFileTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        fileUpload: true,
        fileUploadData: action.payload,
      };

    default:
      return state;
  }
};

export default movieReducer;
