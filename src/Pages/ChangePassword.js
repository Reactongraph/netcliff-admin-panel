import React, { useState, useEffect } from "react";
//login css
import "./login.css";

//login form logo
import logo from "../Component/assets/images/movie.png";

//router
import { Link, useParams } from "react-router-dom";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//import action
import { login } from "../store/Admin/admin.action";

//type
import { CLOSE_ADMIN_TOAST } from "../store/Admin/admin.type";

//toast
import { setToast } from "../util/Toast";
import { Toast } from "react-bootstrap";
import { forgotPassword } from "../store/Admin/admin.action";

const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const { toast, toastData, actionFor } = useSelector((state) => state.admin);

  //State Define
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    newPassword: "",
    password: "",
  });

  const { id } = useParams();

  //Submit Functionality
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !password) {
      const error = {};

      if (!newPassword) {
        error.newPassword = "New Password is required !";
      }

      if (!password) {
        error.password = "Conform Password is required !";
      }

      return setError({ ...error });
    } else {
      if (newPassword !== password) {
        return setError({
          ...error,
          password: "New Password and Conform Password doesn't match !",
        });
      }
      const details = {
        newPassword,
        confirmPassword: password,
      };
      props.forgotPassword(details, id);
      setNewPassword("");
      setPassword("");
    }
  };

  // toast;
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_ADMIN_TOAST });
    }
  }, [toast, toastData, actionFor]);
  return (
    <>
      <div className="sign section--bg sign-one-bg">
        <div className="bg-overlay">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="sign__content">
                  <form action="#" className="sign__form">
                    <a href="index.html" className="sign__logo">
                      <img src={logo} width="240px" alt />
                    </a>
                    <div className="sign__group">
                      <label
                        for="usernewPassword"
                        className="form-label fs-5 login_label"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        className="sign__input"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              newPassword: "newPassword is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              newPassword: "",
                            });
                          }
                        }}
                      />
                      {error.newPassword && (
                        <span style={{ color: "red" }}>
                          {error.newPassword}
                        </span>
                      )}
                    </div>
                    <div className="sign__group">
                      <label
                        for="usernewPassword"
                        className="form-label fs-5 login_label"
                      >
                        Conform Password
                      </label>
                      <input
                        type="password"
                        className="sign__input"
                        placeholder="Conform Password"
                        value={password}
                        // id="password-input"
                        // aria-describedby="passwordInput"

                        onChange={(e) => {
                          setPassword(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              password: "Conform Password is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              password: "",
                            });
                          }
                        }}
                      />
                      {error.password && (
                        <span style={{ color: "red" }}>{error.password}</span>
                      )}
                    </div>

                    <button
                      className="sign__btn"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { forgotPassword })(ChangePassword);
