//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  DELETE_GENRE,
  GET_GENRE,
  INSERT_GENRE,
  OPEN_GENRE_TOAST,
  UPDATE_GENRE,
} from "./genre.type";
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";

//Get Genre
export const getGenre = () => (dispatch) => {
  apiInstanceFetch
    .get(`genre`)
    .then((res) => {
     
      dispatch({ type: GET_GENRE, payload: res.genre.map(g => ({...g, name: g.name.toLowerCase()})) });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Insert Genre
export const insertGenre = (data) => (dispatch) => {
  axios
    .post(`genre/create`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_GENRE, payload: res.data.genre });
        dispatch({ type: CLOSE_DIALOG });
        dispatch({
          type: OPEN_GENRE_TOAST,
          payload: { data: "Insert Genre Successful ✔", for: "insert" },
        });
      } else {
        dispatch({
          type: OPEN_GENRE_TOAST,
          payload: { data: res.data.message, for: "error" },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Update genre
export const updateGenre = (genreId, data) => (dispatch) => {
  axios
    .patch(`genre/update?genreId=${genreId}&&name=${data}`)
    .then((res) => {
      if(res.data.status){
        dispatch({
          type: UPDATE_GENRE,
          payload: { data: res.data.genre, id: genreId },
        });
        dispatch({ type: CLOSE_DIALOG });
        dispatch({
          type: OPEN_GENRE_TOAST,
          payload: { data: "Update Genre Successful ✔", for: "update" },
        });
      }else {
        Toast("error" ,res.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete genre
export const deleteGenre = (genreId) => (dispatch) => {
  axios
    .delete(`genre/delete/?genreId=${genreId}`)
    .then((res) => {
      dispatch({ type: DELETE_GENRE, payload: genreId });
    })
    .catch((error) => {
      console.log(error);
    });
};
