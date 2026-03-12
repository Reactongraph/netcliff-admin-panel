import {
  GET_USER_RES_TICKET,
  USER_RES_TICKET_ACTION,
  OPEN_SOLVE_DIALOG,
  CLOSE_SOLVE_DIALOG
} from "./restricted.type";

const initialState = {
  ticketByUser: [],
  totalTickets: 0,
};

const userRestrictedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_RES_TICKET:
      return {
        ...state,
        ticketByUser: action.payload.ticketByUser,
        totalTickets: action.payload.totalTickets,
      };
    case USER_RES_TICKET_ACTION:
      return {
        ...state,
        ticketByUser: state.ticketByUser.filter(
          (ticketByUser) => ticketByUser._id !== action.payload
        ),
      };
    //Open Dialog
    case OPEN_SOLVE_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    //Close Dialog
    case CLOSE_SOLVE_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    default:
      return state;
  }
};

export default userRestrictedReducer;
