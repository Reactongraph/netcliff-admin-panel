//Types
import {
  CLOSE_BADGE_TOAST,
  CLOSE_DIALOG,
  DELETE_BADGE,
  GET_BADGE,
  INSERT_BADGE,
  OPEN_BADGE_TOAST,
  OPEN_BADGE_DIALOG,
  UPDATE_BADGE,
  OPEN_METRICS_DIALOG,
  CLOSE_METRICS_DIALOG,
  UPDATE_BADGE_METRICS,
} from "./badge.type";

//Define InitialState
const initialState = {
  badge: [],
  dialog: false,
  dialogData: null,
  metricsDialog: false,
  metricsDialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const badgeReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Badge
    case GET_BADGE:
      return {
        ...state,
        badge: action.payload,
      };

    //Insert Badge
    case INSERT_BADGE:
      const data = [...state.badge];
      data.unshift(action.payload);
      return {
        ...state,
        badge: data,
      };

    //Update Badge
    case UPDATE_BADGE:
      return {
        ...state,
        badge: state.badge.map((badge) =>
          badge._id === action.payload.id ? action.payload.data : badge
        ),
      };

    //Delete Badge
    case DELETE_BADGE:
      return {
        ...state,
        badge: state.badge.filter((badge) => badge._id !== action.payload),
      };

    //Open Dialog
    case OPEN_BADGE_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    //Open Toast
    case OPEN_BADGE_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    //Close Toast
    case CLOSE_BADGE_TOAST:
      return {
        ...state,
        toast: false,
        toastData: null,
        actionFor: null,
      };

    //Open Metrics Dialog
    case OPEN_METRICS_DIALOG:
      return {
        ...state,
        metricsDialog: true,
        metricsDialogData: action.payload || null,
      };

    //Close Metrics Dialog
    case CLOSE_METRICS_DIALOG:
      return {
        ...state,
        metricsDialog: false,
        metricsDialogData: null,
      };

    //Update Badge Metrics
    case UPDATE_BADGE_METRICS:
      return {
        ...state,
        badge: state.badge.map((badge) =>
          badge._id === action.payload.id ? action.payload.data : badge
        ),
      };

    default:
      return state;
  }
};

export default badgeReducer;