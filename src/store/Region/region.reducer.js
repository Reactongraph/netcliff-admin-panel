//Types
import {
  CLOSE_REGION_TOAST,
  CLOSE_DIALOG,
  DELETE_REGION,
  GET_REGION,
  INSERT_REGION,
  OPEN_REGION_TOAST,
  OPEN_REGION_DIALOG,
  UPDATE_REGION,
} from "./region.type";

//Define InitialState
const initialState = {
  region: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const regionReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Category
    case GET_REGION:
      return {
        ...state,
        region: action.payload,
      };

    //Insert category
    case INSERT_REGION:
      const data = [...state.region];
      data.unshift(action.payload);
      return {
        ...state,
        region: data,
      };

    //Update category
    case UPDATE_REGION:
      return {
        ...state,
        region: state.region.map((region) =>
          region._id === action.payload.id ? action.payload.data : region
        ),
      };

    //Delete category
    case DELETE_REGION:
      return {
        ...state,
        region: state.region.filter((region) => region._id !== action.payload),
      };

    //Open Dialog
    case OPEN_REGION_DIALOG:
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
    case OPEN_REGION_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_REGION_TOAST:
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

export default regionReducer;
