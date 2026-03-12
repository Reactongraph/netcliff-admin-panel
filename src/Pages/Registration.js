import React, { useState } from "react";
import { connect } from "react-redux";
import { signupAdmin } from "../store/Admin/admin.action";
//login form logo
import logo from "../Component/assets/images/logo.png";
//login css
import "./login.css";
import { Link, NavLink } from "react-router-dom/cjs/react-router-dom.min";

const Registration = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const isEmail = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
    return validNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !email ||
      !password ||
      !code ||
      !newPassword ||
      !isEmail(email) ||
      newPassword !== password
    ) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      if (!newPassword) error.newPassword = "new password is required !";

      if (newPassword !== password)
        error.newPassword = "New Password and Confirm Password doesn't match !";
      if (!code) error.code = "purchase code is required !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        password,
        code,
      };

      props.signupAdmin(login);
    }
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
                  type="email"
                  class="sign__input"
                  id="floatingInput"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        email: "Email is Required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        email: "",
                      });
                    }
                  }}
                />

                <div class="mt-2 ml-2 ">
                  {error.email && <span className="error">{error.email}</span>}
                </div>
              </div>
              <div className="sign__group">
                <label
                  for="floatingPassword"
                  className="form-label fs-5 login_label"
                >
                  Password
                </label>

                <input
                  type="password"
                  class="sign__input"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        password: "Password is Required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        password: "",
                      });
                    }
                  }}
                />

                <div class="mt-2 ml-2 ">
                  {error.password && (
                    <span className="error">{error.password}</span>
                  )}
                </div>
              </div>

              <div class="sign__group">
                <label
                  for="floatingPassword"
                  className="form-label fs-5 login_label"
                >
                  {" "}
                  Confirm Password
                </label>
                <input
                  type="password"
                  class="sign__input"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Confirm Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        newPassword: "Password is Required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        newPassword: "",
                      });
                    }
                  }}
                />

                <div class="mt-2 ml-2">
                  {error.newPassword && (
                    <span className="error">{error.newPassword}</span>
                  )}
                </div>
              </div>

              <div class="sign__group">
                <label
                  for="floatingPassword"
                  className="form-label fs-5 login_label"
                >
                  {" "}
                  Purchase Code
                </label>
                <input
                  type="text"
                  class="sign__input"
                  id="code"
                  name="code"
                  placeholder="Purchase code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        code: "purchase Code  is Required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        code: "",
                      });
                    }
                  }}
                />

                <div class="mt-2 ml-2 ">
                  {error.code && <span className="error">{error.code}</span>}
                </div>
              </div>

              <div className="sign_btn_wrapper">
                <button type="submit" class="sign__btn" onClick={handleSubmit}>
                  Sign Up
                </button>
                <span className="sign__text">
                  <NavLink
                    to="/login"
                    className="fw-semibold text-decoration-underline fs-5 justify-content-center border-bottom"
                  >
                    Login?
                  </NavLink>
                </span>
              </div>

              <div class="authent-reg">
                <p></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { signupAdmin })(Registration);
