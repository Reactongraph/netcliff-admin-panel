//Types
import {
  CLOSE_CONTACT_US_TOAST,
  CLOSE_DIALOG,
  DELETE_CONTACT_US,
  GET_CONTACT_US,
  INSERT_CONTACT_US,
  OPEN_CONTACT_US_TOAST,
  OPEN_CONTACT_DIALOG,
  UPDATE_CONTACT_US,
} from "./contact.type";

//Define InitialState
const initialState = {
  contact: [],
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Contact
    case GET_CONTACT_US:
      return {
        ...state,
        contact: action.payload,
      };

    //Insert Contact
    case INSERT_CONTACT_US:
      const data = [...state.contact];
      data.unshift(action.payload);
      return {
        ...state,
        contact: data,
      };

    //Update Contact
    case UPDATE_CONTACT_US:
      return {
        ...state,
        contact: state.contact.map((contact) =>
          contact._id === action.payload.id ? action.payload.data : contact
        ),
      };

    //Delete Contact
    case DELETE_CONTACT_US:
      return {
        ...state,
        contact: state.contact.filter(
          (contact) => contact._id !== action.payload
        ),
      };

    //Open Dialog
    case OPEN_CONTACT_DIALOG:
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
    case OPEN_CONTACT_US_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_CONTACT_US_TOAST:
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

export default contactReducer;
