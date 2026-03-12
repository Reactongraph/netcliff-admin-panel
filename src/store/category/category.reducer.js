//Types
import {
  CLOSE_CATEGORY_TOAST,
  CLOSE_DIALOG,
  DELETE_CATEGORY,
  GET_CATEGORY,
  INSERT_CATEGORY,
  OPEN_CATEGORY_TOAST,
  OPEN_CATEGORY_DIALOG,
  UPDATE_CATEGORY,
} from "./category.type";

//Define InitialState
const initialState = {
  category: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Category
    case GET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };

    //Insert category
    case INSERT_CATEGORY:
      const data = [...state.category];
      data.unshift(action.payload);
      return {
        ...state,
        category: data,
      };

    //Update category
    case UPDATE_CATEGORY:
      return {
        ...state,
        category: state.category.map((category) =>
          category._id === action.payload.id ? action.payload.data : category
        ),
      };

    //Delete category
    case DELETE_CATEGORY:
      return {
        ...state,
        category: state.category.filter(
          (category) => category._id !== action.payload
        ),
      };

    //Open Dialog
    case OPEN_CATEGORY_DIALOG:
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
    case OPEN_CATEGORY_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_CATEGORY_TOAST:
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

export default categoryReducer;
