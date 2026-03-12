//Alert
import Swal from "sweetalert2";

export const warning = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2992ff",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete it!",
    // title: "Are You Sure!",
    // icon: "warning",
    // dangerMode: true,
    // buttons: true,
  });
};

export const SuccessAlert = (message = "") => {
  return Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    confirmButtonColor: "#2992ff",
    confirmButtonText: "Sure",
    allowOutsideClick: false, // Prevents clicking outside to close
    showCancelButton: false, // Ensures only one button is shown
  });
};

export const alert = (title, data, type) => {
  return Swal.fire(title, data, type);
};
