import * as ActionType from "./advertisement.type";

const initialState = {
  advertisement: {},
  toast: false,
  toastData: null,
  actionFor: null,
};

export const advertiseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_ADVERTISEMENT:
      return {
        ...state,
        advertisement: action.payload,
      };

    case ActionType.UPDATE_ADVERTISE:
      return {
        ...state,
        advertisement: action.payload,
      };
    case ActionType.ACTIVE_ADVERTISE:
      console.log(action.payload);
      return {
        ...state,
        advertisement: action.payload.advertisement,
      };
    //Open admin Toast
    case ActionType.OPEN_ADS_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    //Close admin Toast
    case ActionType.CLOSE_ADS_TOAST:
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
