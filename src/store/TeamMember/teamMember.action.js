//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  GET_TEAM_MEMBER,
  INSERT_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
  OPEN_TEAM_MEMBER_TOAST,
  TEAM_MEMBER_DETAILS,
} from "./teamMember.type";
import { apiInstanceFetch } from "../../util/api";

//get TeamMember
export const getTeamMember = (dialogData) => (dispatch) => {
  apiInstanceFetch
    .get(`role/movieIdWise?movieId=${dialogData}`)
    
    .then((res) => {
      dispatch({ type: GET_TEAM_MEMBER, payload: res.role });
    })
    .catch((error) => {
      console.log(error);
    });
};

//insert TeamMember
export const insertTeamMember = (data) => (dispatch) => {
  axios
    .post(`role/create`, data)
    .then((res) => {
      dispatch({ type: INSERT_TEAM_MEMBER, payload: res.data.role });
      dispatch({
        type: OPEN_TEAM_MEMBER_TOAST,
        payload: { data: "Insert Role Successful ✔", for: "insert" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//update TeamMember
export const updateTeamMember = (mongoId, data) => (dispatch) => {
  axios
    .patch(`role/update?roleId=${mongoId}`, data)
    .then((result) => {
      dispatch({ type: CLOSE_DIALOG });
      dispatch({
        type: UPDATE_TEAM_MEMBER,
        payload: { data: result.data.role, id: mongoId },
      });
      dispatch({
        type: OPEN_TEAM_MEMBER_TOAST,
        payload: { data: "Update Role Successful ✔", for: "update" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete TeamMember
export const deleteTeamMember = (mongoId) => (dispatch) => {
  axios
    .delete(`role/delete/?roleId=${mongoId}`)
    .then((res) => {
      dispatch({ type: DELETE_TEAM_MEMBER, payload: mongoId });
    })
    .catch((error) => {
      console.log(error);
    });
};
