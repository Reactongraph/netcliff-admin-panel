import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const setToast = (toastData, actionFor) => {
  const options = {
    autoClose: 2000,
    position: "top-right",
    pauseOnHover: true,
    hideProgressBar: false,
    progress: undefined,
    draggable: true,
  };

  if (actionFor === "insert") {
    toast.success(toastData, options);
  } else if (actionFor === "update") {
    toast.info(toastData, options);
  } else {
    toast.error(toastData, options);
  }
};
