import {
  GET_DASHBOARD,
  CLOSE_DASHBOARD_TOAST,
  OPEN_DASHBOARD_TOAST,
  GET_ANALYTIC,
  GET_COUNTRY_WISE_USER,
  MOVIE_SERIES_ANACLITIC_DATA,
} from "./dashboard.type";

const initialState = {
  analytic: [],
  movieAnalytic: [],
  revenueAnatytic: [],
  dashboard: {},
  user: [],
  toast: false,
  toastData: null,
  actionFor: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Dashboard
    case GET_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload,
      };

    //Get user Revenue Analytic
    case GET_ANALYTIC:
      return {
        ...state,
        analytic: action.payload,
      };

    //Get movie Series Analytic
    case MOVIE_SERIES_ANACLITIC_DATA:
      return {
        ...state,
        movieAnalytic: action.payload,
      };

    //Get CountryWise User
    case GET_COUNTRY_WISE_USER:
      return {
        ...state,
        user: action.payload,
      };

    //Toast
    case OPEN_DASHBOARD_TOAST:
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    case CLOSE_DASHBOARD_TOAST:
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

export default dashboardReducer;
