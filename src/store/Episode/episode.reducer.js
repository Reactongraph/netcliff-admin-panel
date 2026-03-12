//Types
import {
  CLOSE_INSERT_DIALOG,
  CLOSE_EPISODE_TOAST,
  DELETE_EPISODE,
  GET_EPISODE,
  INSERT_EPISODE,
  OPEN_INSERT_DIALOG,
  OPEN_EPISODE_TOAST,
  UPDATE_EPISODE,
  UPDATE_EPISODE_STATUS,
  OPEN_DRM_DIALOG,
  CLOSE_DRM_DIALOG,
} from "./episode.type";

import uploadFileTypes from "./episode.type";
import { modifyFiles } from "../../util/ModifyFiles";

//Define initialState
const initialState = {
  episode: [],
  dialog: false,
  dialogData: null,
  drmDialog: false,
  drmDialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const episodeReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Episode
    case GET_EPISODE:
      return {
        ...state,
        episode: action.payload,
      };

    //Insert Episode
    case INSERT_EPISODE:
      const data = [...state.episode];
      data.unshift(action.payload);
      return {
        ...state,
        episode: data,
      };

    //Update Episode
    case UPDATE_EPISODE:
      return {
        ...state,
        episode: state.episode.map((episode) =>
          episode._id === action.payload.id ? action.payload.data : episode
        ),
      };

    //Update Episode Status Only
    case UPDATE_EPISODE_STATUS:
      return {
        ...state,
        episode: state.episode.map((episode) =>
          episode._id === action.payload.episodeId 
            ? { ...episode, status: action.payload.status }
            : episode
        ),
      };

    //Delete Episode
    case DELETE_EPISODE:
      return {
        ...state,
        episode: state.episode.filter(
          (episode) => episode._id !== action.payload
        ),
      };

    //Open Dialog
    case OPEN_INSERT_DIALOG:
  
      return {
        ...state,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_INSERT_DIALOG:
      return {
        ...state,
        dialogData: null,
      };

    //Open DRM Dialog
    case OPEN_DRM_DIALOG:
      return {
        ...state,
        drmDialog: true,
        drmDialogData: action.payload || null,
      };

    //Close DRM Dialog
    case CLOSE_DRM_DIALOG:
      return {
        ...state,
        drmDialog: false,
        drmDialogData: null,
      };

    //Open and Close Toast
    case OPEN_EPISODE_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_EPISODE_TOAST:
      return {
        ...state,
        toast: false,
        toastData: null,
        actionFor: null,
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

    case uploadFileTypes.FAILURE_UPLOAD_FILE:
    default:
      return state;
  }
};

export default episodeReducer;
