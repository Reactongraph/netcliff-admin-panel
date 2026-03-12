import {
  GET_DASHBOARD,
  GET_ANALYTIC,
  OPEN_DASHBOARD_TOAST,
  GET_COUNTRY_WISE_USER,
  MOVIE_SERIES_ANACLITIC_DATA,
} from "./dashboard.type";
import { apiInstanceFetch } from "../../util/api";

//get dashboard
export const getDashboard = () => (dispatch) => {
  apiInstanceFetch
    .get("dashboard/admin")
    .then((res) => {
      dispatch({ type: GET_DASHBOARD, payload: res.dashboard });
    })
    .catch((error) => console.log(error));
};

//get user Revenue analytic
export const getAnalytic = (type, start, end) => (dispatch) => {
  apiInstanceFetch
    .get(
      `dashboard/userAnalytic?type=${type}&startDate=${start}&endDate=${end}`
    )
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_ANALYTIC, payload: res.analytic });
      } else {
        dispatch({
          type: OPEN_DASHBOARD_TOAST,
          payload: { data: res.message },
        });
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });
};

export const getMovieSeriesAnalytic = (chartType, start, end) => (dispatch) => {
  apiInstanceFetch
    .get(
      `dashboard/movieAnalytic?type=${chartType}&startDate=${start}&endDate=${end}`
    )
    .then((res) => {
      if (res.status) {
        dispatch({
          type: MOVIE_SERIES_ANACLITIC_DATA,
          payload: res.analytic,
        });
      } else {
        dispatch({
          type: OPEN_DASHBOARD_TOAST,
          payload: { data: res.message },
        });
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });
};
//Get countryWise user
export const getCountryWiseUser = () => (dispatch) => {
  apiInstanceFetch
    .get("user/countryWiseUser")
    .then((res) => {
      dispatch({ type: GET_COUNTRY_WISE_USER, payload: res.user });
    })
    .catch((error) => console.log(error));
};
