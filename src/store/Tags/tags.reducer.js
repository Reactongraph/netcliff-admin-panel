import {
  CLOSE_DIALOG,
  CLOSE_TAGS_TOAST,
  DELETE_TAGS,
  GET_TAGS,
  INSERT_TAGS,
  OPEN_TAGS_DIALOG,
  OPEN_TAGS_TOAST,
  UPDATE_TAGS,
} from "./tags.type";

const initialState = {
  tags: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS:
      return {
        ...state,
        tags: action.payload,
      };

    case INSERT_TAGS:
      const data = [...state.tags];
      data.unshift(action.payload);
      return {
        ...state,
        tags: data,
      };

    case UPDATE_TAGS:
      return {
        ...state,
        tags: state.tags.map((tags) =>
          tags._id === action.payload.id ? action.payload.data : tags
        ),
      };

    case DELETE_TAGS:
      return {
        ...state,
        tags: state.tags.filter((tags) => tags._id !== action.payload),
      };

    case OPEN_TAGS_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    case OPEN_TAGS_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data,
        actionFor: action.payload.for,
      };

    case CLOSE_TAGS_TOAST:
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

export default tagsReducer;