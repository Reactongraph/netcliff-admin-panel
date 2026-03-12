import {
  CHANGE_ADBANNER_STATUS,
  CLOSE_ADBANNER_TOAST,
  DELETE_ADBANNER,
  GET_ADBANNER,
  INSERT_ADBANNER,
  OPEN_ADBANNER_TOAST,
} from "./adBanner.type";

//Define initialState
const initialState = {
  adBanners: [],
  toast: false,
  toastData: null,
  actionFor: null,
};

const subtitleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADBANNER:
      return {
        ...state,
        adBanners: action.payload,
      };
    case INSERT_ADBANNER:
      const data = [...state.adBanners];
      data.unshift(action.payload);
      return {
        ...state,
        adBanners: data,
      };

    case CHANGE_ADBANNER_STATUS:
      const updatedData = state.adBanners.map((d) => {
        if (action.payload._id === d._id) {
          return { ...d, isShow: action.payload.isShow };
        } else {
          return d;
        }
      });
      return {
        ...state,
        adBanners: updatedData,
      };

    case DELETE_ADBANNER:
      return {
        ...state,
        adBanners: state.adBanners.filter(
          (banner) => banner._id !== action.payload
        ),
      };
    case OPEN_ADBANNER_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };
    case CLOSE_ADBANNER_TOAST:
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

export default subtitleReducer;
