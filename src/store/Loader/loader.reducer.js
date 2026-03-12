//Types
import { OPEN_LOADER, CLOSE_LOADER } from "./loader.type";

//Define InitialState
const initialState = {
  loader: false,
};

//Loader Reducer
const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    //Open Loader
    case OPEN_LOADER:
      return {
        ...state,
        loader: true,
      };

    //Close Loader
    case CLOSE_LOADER:
      return {
        ...state,
        loader: false,
      };

    default:
      return state;
  }
};

export default loaderReducer;
