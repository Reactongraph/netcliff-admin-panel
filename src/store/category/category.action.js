//Axios
import axios from "axios";

//Types
import {
  CLOSE_DIALOG,
  DELETE_CATEGORY,
  GET_CATEGORY,
  INSERT_CATEGORY,
  OPEN_CATEGORY_TOAST,
  UPDATE_CATEGORY,
} from "./category.type";
import { apiInstanceFetch } from "../../util/api";

//Get CATEGORY
export const getCategory = () => (dispatch) => {
  apiInstanceFetch
    .get(`/category`)
    .then((res) => {
      dispatch({ type: GET_CATEGORY, payload: res.category });
    })
    .then((error) => {
      console.log(error);
    });
};

//Insert CATEGORY
export const insertCategory = (data) => (dispatch) => {
  axios
    .post(`category/create`, data)
    .then((res) => {
      dispatch({ type: INSERT_CATEGORY, payload: res.data.category });
      dispatch({
        type: OPEN_CATEGORY_TOAST,
        payload: { data: "Insert Category Successful ✔", for: "insert" },
      });
    })
    .then((error) => {
      console.log(error);
    });
};

//Update category
export const updateCategory = (categoryId, data) => (dispatch) => {
  axios
    .patch(`category/update?categoryId=${categoryId}`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_CATEGORY,
        payload: { data: res.data.category, id: categoryId },
      });
      dispatch({
        type: OPEN_CATEGORY_TOAST,
        payload: { data: "Update Category Successful ✔", for: "update" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

//Delete category
export const deleteCategory = (categoryId) => (dispatch) => {
  axios
    .delete(`category/delete/?categoryId=${categoryId}`)
    .then((res) => {
      dispatch({ type: DELETE_CATEGORY, payload: categoryId });
    })
    .catch((error) => {
      console.log(error);
    });
};
