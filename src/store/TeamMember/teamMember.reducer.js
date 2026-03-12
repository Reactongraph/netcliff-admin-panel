//Types
import {
  GET_TEAM_MEMBER,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  INSERT_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
  CLOSE_TEAM_MEMBER_TOAST,
  OPEN_TEAM_MEMBER_TOAST,
  TEAM_MEMBER_DETAILS,
  TEAM_MEMBER_ID,
} from "./teamMember.type";

//Define InitialState
const initialState = {
  teamMember: [],
  // teamMemberDetails: {},
  id: null,
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const teamMemberReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Author
    case GET_TEAM_MEMBER:
      return {
        ...state,
        teamMember: action.payload,
      };

    //Insert TeamMember
    case INSERT_TEAM_MEMBER:
      const data = [...state.teamMember];
      data.unshift(action.payload);
      return {
        ...state,
        teamMember: data,
      };

    //Update TeamMember
    case UPDATE_TEAM_MEMBER:
      return {
        ...state,
        teamMember: state.teamMember.map((teamMember) =>
          teamMember._id === action.payload.id
            ? action.payload.data
            : teamMember
        ),
      };

    //Delete TeamMember
    case DELETE_TEAM_MEMBER:
      return {
        ...state,
        teamMember: state.teamMember.filter(
          (teamMember) => teamMember._id !== action.payload
        ),
      };

    //Open and Close Dialog
    case OPEN_DIALOG:
      return {
        ...state,
        dialogData: action.payload || null,
      };
    case CLOSE_DIALOG:
      return {
        ...state,
        dialogData: null,
      };

    //Open and Close Toast
    case OPEN_TEAM_MEMBER_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_TEAM_MEMBER_TOAST:
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

export default teamMemberReducer;
