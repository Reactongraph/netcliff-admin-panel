//Types
import {
  CLOSE_SEASON_DIALOG,
  DELETE_SEASON,
  GET_SEASON,
  INSERT_SEASON,
  OPEN_SEASON_DIALOG,
  UPDATE_SEASON,
} from "./season.type";

//Define InitialState
const initialState = {
  season: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const seasonReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Category
    case GET_SEASON:
      return {
        ...state,
        season: action.payload,
      };
    //Open Dialog
    case OPEN_SEASON_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_SEASON_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case INSERT_SEASON:
      let array = [...state.season];
      array.unshift(action.payload);

      return {
        ...state,
        season: array,
      };
    case UPDATE_SEASON:
      return {
        ...state,
        season: state.season.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case DELETE_SEASON:
      return {
        ...state,
        season: state.season.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    default:
      return state;
  }
};

export default seasonReducer;
