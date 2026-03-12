//Types
import {
  GET_LANGUAGES
} from "./language.type";
import { apiInstanceFetch } from "../../util/api";

//Get Genre
export const getLanguages = () => (dispatch) => {
  apiInstanceFetch
    .get(`language`)
    .then((res) => {

      dispatch({ type: GET_LANGUAGES, payload: res.languages });
    })
    .catch((error) => {
      console.log(error);
    });
};
