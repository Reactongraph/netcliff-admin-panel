import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { updateCode } from "../store/Admin/admin.action";
//login form logo
import logo from "../Component/assets/images/logo.png";

const UpdateCode = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");


  useEffect(()=> {
    console.log('hellloooooooo')
  })

  const handleSubmit = () => {
    if (!email || !password || !code) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      if (!code) error.code = "purchase code is required !";

      return setError({ ...error });
    } else {
      let login = {
        email,
        password,
        code,
      };

      props.updateCode(login);
    }
  };
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
                        for="useremail"
                        className="form-label fs-5 login_label"
                      >
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
                      {error.email && (
                        <span className="error">{error.email}</span>
                      )}
                    </div>
                    <div className="sign__group">
                      <label
                        for="useremail"
                        className="form-label fs-5 login_label"
                      >
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

                    <div className="sign__group">
                      <label
                        for="useremail"
                        className="form-label fs-5 login_label"
                      >
                        Purchase code
                      </label>
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Purchase code"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              code: "Purchase code is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              code: "",
                            });
                          }
                        }}
                      />
                      {error.code && (
                        <span className="error">{error.code}</span>
                      )}
                    </div>

                    <button
                      className="sign__btn"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Sign In
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

export default connect(null, { updateCode })(UpdateCode);
