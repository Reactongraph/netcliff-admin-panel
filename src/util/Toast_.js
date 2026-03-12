// Alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = (type, data) => {
  console.log('type', type, data)
  return toast(data, {
    type: type,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
