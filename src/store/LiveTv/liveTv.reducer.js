import * as ActionType from "./liveTv.type";

const initialState = {
  liveTv: [],
  dialogue: false,
  dialogueData: null,
  //actions dialogue
  actionDialogue: false,
  actionDialogueData: null,
  //info dialogue
  infoDialogue: false,
  country: [],
  adminCreateLiveTv: [],
  flag: [],
  idListChannel: [],
};

export const liveTvReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_LIVE_TV:
      return {
        ...state,
        liveTv: action.payload,
      };
    case ActionType.OPEN_LIVE_TV_DIALOGUE:
      return {
        ...state,
        dialogue: true,
        dialogueData: action.payload || null,
      };
    case ActionType.CLOSE_LIVE_TV_DIALOGUE:
      return {
        ...state,
        dialogue: false,
        dialogueData: null,
      };

    case ActionType.OPEN_LIVE_TV_ACTION_DIALOGUE:
      return {
        ...state,
        actionDialogue: true,
        actionDialogueData: action.payload || null,
      };
    case ActionType.CLOSE_LIVE_TV_ACTION_DIALOGUE:
      return {
        ...state,
        actionDialogue: false,
        dialogueData: null,
      };

    case ActionType.OPEN_LIVE_TV_INFO_DIALOGUE:
      return {
        ...state,
        infoDialogue: true,
      };
    case ActionType.CLOSE_LIVE_TV_INFO_DIALOGUE:
      return {
        ...state,
        infoDialogue: false,
      };
    case ActionType.GET_COUNTRY:
      return {
        ...state,
        country: action.payload,
      };
    case ActionType.GET_LIVE_TV_CREATE_BY_ADMIN:
      return {
        ...state,
        adminCreateLiveTv: action.payload,
      };
    case ActionType.CREATE_LIVE_TV:
      let array = [...state.adminCreateLiveTv];
      array.unshift(action.payload);
      return {
        ...state,
        adminCreateLiveTv: array,
      };

    case ActionType.GET_ID_LIST:
      return {
        ...state,
        idListChannel: action.payload,
      };

    case ActionType.EDIT_LIVETV_CHANNEL:
      return {
        ...state,
        adminCreateLiveTv: state.adminCreateLiveTv.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.UPDATE_SINGLE_LIVE_TV:
      return {
        ...state,
        adminCreateLiveTv: state.adminCreateLiveTv.map((item) =>
          item._id === action?.payload?._id && action.payload.updateData
            ? { ...item, ...action.payload.updateData }
            : item
        ),
      };
    case ActionType.DELETE_LIVETV_CHANNEL:
      return {
        ...state,
        adminCreateLiveTv: state.adminCreateLiveTv.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.GET_FLAG:
      return {
        ...state,
        flag: action.payload,
      };

    default:
      return state;
  }
};
