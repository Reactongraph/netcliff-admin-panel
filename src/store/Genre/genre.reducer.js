//Types
import {
  CLOSE_GENRE_TOAST,
  CLOSE_DIALOG,
  DELETE_GENRE,
  GET_GENRE,
  INSERT_GENRE,
  OPEN_GENRE_TOAST,
  OPEN_GENRE_DIALOG,
  UPDATE_GENRE,
} from "./genre.type";

//Define InitialState
const initialState = {
  genre: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const genreReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Genre
    case GET_GENRE:
      return {
        ...state,
        genre: action.payload,
      };

    //Insert Genre
    case INSERT_GENRE:
      const data = [...state.genre];
      data.unshift(action.payload);
      return {
        ...state,
        genre: data,
      };

    //Update Genre
    case UPDATE_GENRE:
      return {
        ...state,
        genre: state.genre.map((genre) =>
          genre._id === action.payload.id ? action.payload.data : genre
        ),
      };

    //Delete Genre
    case DELETE_GENRE:
      return {
        ...state,
        genre: state.genre.filter((genre) => genre._id !== action.payload),
      };

    //Open Dialog
    case OPEN_GENRE_DIALOG:
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
    case OPEN_GENRE_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    //Close Toast
    case CLOSE_GENRE_TOAST:
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

export default genreReducer;
