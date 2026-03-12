//Types
import {
  CLOSE_TRAILER_DIALOG,
  CLOSE_TRAILER_TOAST,
  DELETE_TRAILER,
  GET_TRAILER,
  INSERT_TRAILER,
  OPEN_TRAILER_DIALOG,
  OPEN_TRAILER_TOAST,
  UPDATE_TRAILER,
} from "./trailer.type";

//Define initialState
const initialState = {
  trailer: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const trailerReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Trailer
    case GET_TRAILER:
      return {
        ...state,
        trailer: action.payload,
      };
    //Insert Trailer
    case INSERT_TRAILER:

      const data = [...state.trailer];
      data.unshift(action.payload);
      return {
        ...state,
        trailer: data,
      };

    //Update Trailer
    case UPDATE_TRAILER:
      return {
        ...state,
        trailer: state.trailer.map((trailer) =>
          trailer._id === action.payload.id ? action.payload.data : trailer
        ),
      };

    //Delete Trailer
    case DELETE_TRAILER:
      return {
        ...state,
        trailer: state.trailer.filter(
          (trailer) => trailer._id !== action.payload
        ),
      };

    //OPen Dialog
    case OPEN_TRAILER_DIALOG:
      return {
        ...state,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_TRAILER_DIALOG:
      return {
        ...state,
        dialogData: null,
      };

    //Open and Close Toast
    case OPEN_TRAILER_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_TRAILER_TOAST:
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

export default trailerReducer;
