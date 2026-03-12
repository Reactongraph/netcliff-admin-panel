import {
  GET_SETTING,
  UPDATE_SETTING,
  CLOSE_SETTING_TOAST,
  OPEN_SETTING_TOAST,
  SWITCH_ACCEPT,
} from "./setting.type";

const initialState = {
  setting: {},
  toast: false,
  toastData: null,
  actionFor: null,
};

const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTING:
      return {
        ...state,
        setting: action.payload,
      };

    case UPDATE_SETTING:
      return {
        ...state,
        setting: {
          ...state.setting,
        },
      };

    //Open and Close Toast
    case OPEN_SETTING_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_SETTING_TOAST:
      return {
        ...state,
        toast: false,
        toastData: null,
        actionFor: null,
      };

    case SWITCH_ACCEPT:
      return {
        ...state,
        setting: action.payload,
      };

    default:
      return state;
  }
};

export default settingReducer;
