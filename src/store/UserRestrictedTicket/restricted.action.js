import axios from "axios";
import { Toast } from "../../util/Toast_";
import { GET_USER_RES_TICKET, USER_RES_TICKET_ACTION } from "./restricted.type";
import { apiInstanceFetch } from "../../util/api";

//get reels
export const getRaisedTicket = (page, rowsPerPage, status) => (dispatch) => {
  apiInstanceFetch
    .get(
      `ticketByUser/raisedTickets?start=${page}&limit=${rowsPerPage}&status=${status}`
    )
    .then((result) => {
      dispatch({
        type: GET_USER_RES_TICKET,
        payload: {
          ticketByUser: result.ticketByUser,
          totalTickets: result.totalTickets,
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//action for redeem request
export const action = (redeemId, comment) => (dispatch) => {
  axios
    .post(`/ticketByUser/ticketSolve?ticketId=${redeemId}`, {
      comment,
    })
    .then((result) => {
      if (result.status) {
        dispatch({ type: USER_RES_TICKET_ACTION, payload: redeemId });

        Toast("success", "Raised Ticket Request solved successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
