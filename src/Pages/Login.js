import React, { useState, useEffect } from "react";
//login css
import "./login.css";

//login form logo
import logo from "../Component/assets/images/logo.png";

//router
import { NavLink } from "react-router-dom";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//import action
import { login } from "../store/Admin/admin.action";

//type
import { CLOSE_ADMIN_TOAST } from "../store/Admin/admin.type";

//toast
import { setToast } from "../util/Toast";

const Login = (props) => {
  const dispatch = useDispatch();
  const { toast, toastData, actionFor } = useSelector((state) => state.admin);

  //State Define
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //toast;
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_ADMIN_TOAST });
    }
  }, [toast, toastData, actionFor]);

  //Submit Functionality
  const handleSubmit = () => {
    if (!email || !password) {
      const error = {};
      if (!email) {
        error.email = "Email is required !";
      }
      if (!password) {
        error.password = "Password is required !";
      }
      return setError({ ...error });
    }
    const details = {
      email,
      password,
    };
    props.login(details);
  };

  return (
    <>
      <div className="login_wrapper">
        <div className="login_left_col sign-one-bg"></div>
        <div className="login_right_col">
          <div className="sign__content">
            <form action="#" className="sign__form">
              <a href="index.html" className="sign__logo">
                <img src={logo} width="240px" alt />
              </a>
              <div className="sign__group">
                <label for="useremail" className="form-label fs-5 login_label">
                  Email
                </label>
                <input
                  type="text"
                  className="sign__input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (!e.target.value) {
                      return setError({
                        ...error,
                        email: "Email is required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        email: "",
                      });
                    }
                  }}
                />
                {error.email && <span className="error">{error.email}</span>}
              </div>
              <div className="sign__group">
                <label for="useremail" className="form-label fs-5 login_label">
                  Password
                </label>
                <input
                  type="password"
                  className="sign__input"
                  placeholder="Password"
                  value={password}
                  // id="password-input"
                  // aria-describedby="passwordInput"

                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (!e.target.value) {
                      return setError({
                        ...error,
                        password: "Password is required !",
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
                  <span className="error">{error.password}</span>
                )}
              </div>

              <div className="sign_btn_wrapper">
                <button
                  className="sign__btn"
                  type="button"
                  onClick={handleSubmit}
                >
                  Log In
                </button>
                <span className="sign__text">
                  <NavLink
                    to="/forgotPassword"
                    className="fw-semibold text-decoration-underline fs-5 justify-content-center"
                  >
                    Forgot password?
                  </NavLink>
                </span>
              </div>

              {/* <span className="sign__text register_link">
                <span>Don’t an have account?</span>
                <NavLink
                  to="/"
                  className="fw-semibold text-decoration-underline fs-5 justify-content-center "
                >
                  Register?
                </NavLink>
              </span> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { login })(Login);
