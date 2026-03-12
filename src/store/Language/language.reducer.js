//Types
import {
  GET_LANGUAGES,
} from "./language.type";

//Define InitialState
const initialState = {
  languages: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Genre
    case GET_LANGUAGES:
      return {
        ...state,
        languages: action.payload,
      };

    default:
      return state;
  }
};

export default languageReducer;
