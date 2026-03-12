import uploadFileTypes, {
  DELETE_TV_SERIES,
  MANUAL_CREATE_SERIES,
} from "./tvSeries.type";

//Type
import {
  CLOSE_DIALOG,
  GET_TV_SERIES,
  INSERT_TV_SERIES,
  OPEN_DIALOG,
  UPDATE_TV_SERIES,
  OPEN_TV_SERIES_TOAST,
  CLOSE_TV_SERIES_TOAST,
  IS_NEW_RELEASE_SWITCH,
  TV_SERIES_DETAILS,
  GET_COMMENT,
  DELETE_COMMENT,
  TV_SERIES_DETAILS_TMDB,
  EMPTY_TMDB_SERIES_DIALOGUE,
} from "./tvSeries.type";

import { modifyFiles } from "../../util/ModifyFiles";

//Define initialState
const initialState = {
  movie: [],
  web_Series: [],
  comment: [],
  seriesDetails: {},
  seriesDetailsTmdb: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
  fileProgress: {},
  webSeriesDetails: {},
  totalSeries: 0,
  showData: false,
};

const tvSeriesReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get TV Series
    case GET_TV_SERIES:
      return {
        ...state,
        movie: action.payload.movie,
        totalSeries: action.payload.totalSeries,
      };

    //Get TV Series-detail from tmdb
    case TV_SERIES_DETAILS_TMDB:
      return {
        ...state,
        seriesDetailsTmdb: action.payload,
        showData: true,
      };

    case EMPTY_TMDB_SERIES_DIALOGUE:
      return {
        ...state,
        seriesDetailsTmdb: [],
        showData: false,
      };
    //Get TV Series Details
    case TV_SERIES_DETAILS:
      return {
        ...state,
        movieDetails: action.payload,
      };

    //Update TV Series
    case UPDATE_TV_SERIES:
      return {
        ...state,
        movie: state.movie.map((movie) =>
          movie._id === action.payload.id ? action.payload.data : movie
        ),
      };

    //Delete TV Series
    case DELETE_TV_SERIES:
      return {
        ...state,
        movie: state.movie.filter((movie) => movie._id !== action.payload),
      };

    //Is new release TV Series Switch
    case IS_NEW_RELEASE_SWITCH:
      return {
        ...state,
        movie: state?.movie?.map((movie) =>
          movie._id === action.payload.id ? action.payload.data : movie
        ),
      };

    //Open and Close Dialog
    case OPEN_DIALOG:
      return {
        ...state,
        // dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_DIALOG:
      return {
        ...state,
        dialogData: null,
      };

    //Open and Close Toast
    case OPEN_TV_SERIES_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_TV_SERIES_TOAST:
      return {
        ...state,
        toast: false,
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
    //Insert TV Series
    case INSERT_TV_SERIES:
      const data = [...state.movie];
      data.unshift(action.payload);
      return {
        ...state,
        movie: data,
      };

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
    case MANUAL_CREATE_SERIES:
      let create = [...state.movie];
      create.unshift(action.payload);
      return {
        ...state,
        movie: create,
      };
    case uploadFileTypes.FAILURE_UPLOAD_FILE:
    default:
      return state;
  }
};

export default tvSeriesReducer;
