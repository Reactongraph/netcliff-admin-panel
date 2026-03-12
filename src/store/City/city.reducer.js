//Types
import {
  GET_CITY,
  INSERT_CITY,
  UPDATE_CITY,
  DELETE_CITY,
  OPEN_CITY_DIALOG,
  CLOSE_CITY_DIALOG,
  OPEN_CITY_TOAST,
  CLOSE_CITY_TOAST,
} from "./city.type";

//Define InitialState
const initialState = {
  cities: [],
  totalCities: 0,
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const CityReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Category
    case GET_CITY:
      return {
        ...state,
        cities: action.payload?.cities ?? [],
        totalCities: action.payload?.totalCities ?? 0
      };

    //Insert category
    case INSERT_CITY:
      const data = [...state.cities];
      data.unshift(action.payload);
      return {
        ...state,
        cities: data,
      };

    //Update category
    case UPDATE_CITY:
      return {
        ...state,
        cities: state.cities.map((city) =>
          city._id === action.payload.id ? action.payload.data : city
        ),
      };

    //Delete category
    case DELETE_CITY:
      return {
        ...state,
        cities: state.cities.filter((city) => city._id !== action.payload),
      };

    //Open Dialog
    case OPEN_CITY_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_CITY_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    //Open Toast
    case OPEN_CITY_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_CITY_TOAST:
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

export default CityReducer;
