//Types
import {
  CLOSE_FAQ_TOAST,
  CLOSE_DIALOG,
  DELETE_FAQ,
  GET_FAQ,
  INSERT_FAQ,
  OPEN_FAQ_TOAST,
  OPEN_FAQ_DIALOG,
  UPDATE_FAQ,
} from "./faq.type";

//Define InitialState
const initialState = {
  FaQ: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const faqReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get FaQ
    case GET_FAQ:
      return {
        ...state,
        FaQ: action.payload,
      };

    //Insert FaQ
    case INSERT_FAQ:
      const data = [...state.FaQ];
      data.push(action.payload);
      return {
        ...state,
        FaQ: data,
      };

    //Update FaQ
    case UPDATE_FAQ:
      return {
        ...state,
        FaQ: state.FaQ.map((FaQ) =>
          FaQ._id === action.payload.id ? action.payload.data : FaQ
        ),
      };

    //Delete FaQ
    case DELETE_FAQ:
      return {
        ...state,
        FaQ: state.FaQ.filter((FaQ) => FaQ._id !== action.payload),
      };

    //Open Dialog
    case OPEN_FAQ_DIALOG:
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
    case OPEN_FAQ_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_FAQ_TOAST:
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

export default faqReducer;
