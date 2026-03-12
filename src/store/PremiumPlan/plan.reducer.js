import {
  GET_PREMIUM_PLAN,
  CREATE_NEW_PREMIUM_PLAN,
  EDIT_PREMIUM_PLAN,
  OPEN_PREMIUM_PLAN_DIALOG,
  CLOSE_PREMIUM_PLAN_DIALOG,
  // RENEWAL_SWITCH,
  DELETE_PREMIUM_PLAN,
  GET_PREMIUM_PLAN_HISTORY,
  OPEN_PREMIUM_PLAN_TOAST,
  CLOSE_PREMIUM_PLAN_TOAST,
} from "./plan.type";

const initialState = {
  premiumPlan: [],
  history: [],
  totalPlan: 0,
  dialog: false,
  dialogData: null,
  toast: false,
  toastData: null,
  actionFor: null,
};

const premiumPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PREMIUM_PLAN:
      return {
        ...state,
        premiumPlan: action.payload,
      };

    case CREATE_NEW_PREMIUM_PLAN:
      const data = [...state.premiumPlan];
      data.unshift(action.payload);
      return {
        ...state,
        premiumPlan: data,
      };

    case EDIT_PREMIUM_PLAN:
      return {
        ...state,
        premiumPlan: state.premiumPlan.map((premiumPlan) => {
          if (premiumPlan._id === action.payload.id) return action.payload.data;
          else return premiumPlan;
        }),
      };

    case DELETE_PREMIUM_PLAN:
      return {
        ...state,
        premiumPlan: state.premiumPlan.filter(
          (premiumPlan) => premiumPlan._id !== action.payload
        ),
      };
    // case RENEWAL_SWITCH:
    //   return {
    //     ...state,
    //     vipPlan: state.vipPlan.map((vipPlan) => {
    //       if (vipPlan._id === action.payload._id)
    //         return {
    //           ...vipPlan,
    //           isAutoRenew: action.payload.isAutoRenew,
    //         };
    //       else return vipPlan;
    //     }),
    //   };

    case OPEN_PREMIUM_PLAN_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_PREMIUM_PLAN_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    //Open Toast
    case OPEN_PREMIUM_PLAN_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    //Close Toast
    case CLOSE_PREMIUM_PLAN_TOAST:
      return {
        ...state,
        toast: false,
        toastData: null,
        actionFor: null,
      };

    //get history
    case GET_PREMIUM_PLAN_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        totalPlan: action.payload.total,
      };

    default:
      return state;
  }
};

export default premiumPlanReducer;
