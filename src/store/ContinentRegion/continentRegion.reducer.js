//Types
import {
  CLOSE_CONTINENT_REGION_DIALOG,
  DELETE_CONTINENT_REGION,
  GET_CONTINENT_REGION,
  INSERT_CONTINENT_REGION,
  OPEN_CONTINENT_REGION_TOAST,
  UPDATE_CONTINENT_REGION,
  CLOSE_CONTINENT_REGION_TOAST,
  OPEN_CONTINENT_REGION_DIALOG,
} from "./continentRegion.type";

//Define InitialState
const initialState = {
  region: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const continentRegionReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Category
    case GET_CONTINENT_REGION:
      return {
        ...state,
        region: action.payload,
      };

    //Insert category
    case INSERT_CONTINENT_REGION:
      const data = [...state.region];
      data.unshift(action.payload);
      return {
        ...state,
        region: data,
      };

    //Update category
    case UPDATE_CONTINENT_REGION:
      return {
        ...state,
        region: state.region.map((region) =>
          region._id === action.payload.id ? action.payload.data : region
        ),
      };

    //Delete category
    case DELETE_CONTINENT_REGION:
      return {
        ...state,
        region: state.region.filter((region) => region._id !== action.payload),
      };

    //Open Dialog
    case OPEN_CONTINENT_REGION_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_CONTINENT_REGION_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    //Open Toast
    case OPEN_CONTINENT_REGION_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_CONTINENT_REGION_TOAST:
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

export default continentRegionReducer;
