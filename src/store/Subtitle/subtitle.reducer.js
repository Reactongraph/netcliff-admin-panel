//Types
import {
  CLOSE_SUBTITLE_DIALOG,
  CLOSE_SUBTITLE_TOAST,
  DELETE_SUBTITLE,
  GET_SUBTITLE,
  INSERT_SUBTITLE,
  OPEN_SUBTITLE_DIALOG,
  OPEN_SUBTITLE_TOAST,
} from "./subtitle.type";

//Define initialState
const initialState = {
  subtitle: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const subtitleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBTITLE:
      return {
        ...state,
        subtitle: action.payload,
      };
    case INSERT_SUBTITLE:
      const data = [...state.subtitle];
      data.unshift(action.payload);
      return {
        ...state,
        subtitle: data,
      };

    case DELETE_SUBTITLE:
      return {
        ...state,
        subtitle: state.subtitle.filter(
          (subtitle) => subtitle._id !== action.payload
        ),
      };
    case OPEN_SUBTITLE_DIALOG:
      return {
        ...state,
        dialogData: action.payload || null,
      };
    case CLOSE_SUBTITLE_DIALOG:
      return {
        ...state,
        dialogData: null,
      };
    case OPEN_SUBTITLE_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_SUBTITLE_TOAST:
      return {
        ...state,
        toast: false,
        toastData: null,
        actionFor: null,
      };

    default:
      return state;
  }
};

export default subtitleReducer;
