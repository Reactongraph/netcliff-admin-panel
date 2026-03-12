//Types
import {
  GET_USER,
  USER_DETAILS,
  GET_HISTORY,
  BLOCK_UNBLOCK_SWITCH,
} from "./user.type";

//Define initialState
const initialState = {
  user: [],
  history: [],
  totalHistoryUser: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get User
    case GET_USER:
      return {
        ...state,
        user: action.payload,
      };

    //Get User Details
    case USER_DETAILS:
      return {
        ...state,
        user: action.payload,
      };

    //Get user history
    case GET_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        totalHistoryUser: action.payload.total,
      };

    case BLOCK_UNBLOCK_SWITCH:
      return {
        ...state,
        user: state?.user?.map((user) =>
          user._id === action.payload.id ? action.payload.data : user
        ),
      };

    default:
      return state;
  }
};

export default userReducer;
