import * as ActionType from "./tvChannel.type";

const initialState = {
  tvChannels: [],
  totalChannels: 0,
  streamChannelsForSelect: [],
  updatingTvChannel: {},

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
};

export const TvChannelReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_TV_CHANNELS:
      return {
        ...state,
        tvChannels: action.payload?.tvChannels ?? [],
        totalChannels: action.payload?.totalChannels ?? 0
      };

    case ActionType.CREATE_TV_CHANNEL:
      let array = [...state.tvChannels];
      array.unshift(action.payload);
      return {
        ...state,
        tvChannels: array,
      };

    case ActionType.UPDATING_TV_CHANNEL:
      return {
        ...state,
        tvChannels: state.tvChannels.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };

    case ActionType.DELETE_TV_CHANNEL:
      return {
        ...state,
        tvChannels: state.tvChannels.filter(
          (data) => data._id !== action.payload && data
        ),
      };


    case ActionType.GET_CHANNELS_FOR_SELECT:
      return {
        ...state,
        streamChannelsForSelect: action.payload,
      };


    default:
      return state;
  }
};
