import React, { useState, useEffect } from "react";

//react-router-dom
import { Link, useHistory, NavLink } from "react-router-dom";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { OPEN_ADMIN_TOAST, UNSET_ADMIN } from "../store/Admin/admin.type";

//axios
import axios from "axios";

const AdminInfo = () => {
  //define dispatch and history
  const dispatch = useDispatch();
  const history = useHistory();

  const [data, setData] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  //confirm password error
  const [error, setError] = useState("");

  const { admin, toast, toastData, actionFor } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    setData(admin);
  }, [admin]);

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      const errors = {};

      if (!oldPassword) errors.oldPassword = "Old Password is Required!";
      if (!newPassword) errors.newPassword = "New Password is Required!";
      if (!confirmPassword)
        errors.confirmPassword = "Confirm Password is Required!";

      return setErrors({ ...errors });
    }

    setError("");
    if (confirmPassword !== newPassword) {
      return setError("Password & Confirm Password do not match ❌");
    }

    axios
      .put("/admin", {
        oldPass: oldPassword,
        newPass: newPassword,
        confirmPass: confirmPassword,
      })
      .then((res) => {
        if (res.data.status) {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          dispatch({
            type: OPEN_ADMIN_TOAST,
            payload: {
              data: "Change Admin Password Successful ✔",
              for: "insert",
            },
          });
          setTimeout(() => {
            dispatch({ type: UNSET_ADMIN });
            history.push("/");
          }, 3000);
        } else {
          dispatch({
            type: OPEN_ADMIN_TOAST,
            payload: {
              data: "Oops ! Old Password doesn't match",
              for: "error",
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div id="content-page" class="content-page">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="iq-card">
                <div class="iq-card-body admininfo">
                  <div class="iq-edit-list">
                    <ul class="iq-edit-profile d-flex nav nav-pills">
                      <li class="col-md-6 p-0">
                        <NavLink
                          class="nav-link"
                          data-toggle="pill"
                          to="/admin/profile"
                        >
                          Admin Information
                        </NavLink>
                      </li>
                      <li class="col-md-6 p-0">
                        <a
                          href="#personal-information"
                          class="nav-link active"
                          data-toggle="pill"
                        >
                          Change Password
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-12 col-xlg-12 col-md-12"
              style={{ marginTop: "32px" }}
            >
              <div className="iq-card">
                <div className="iq-card-body">
                  <div className="form-group pt-4">
                    <label className="col-md-12">Old Password</label>
                    <div className="col-md-12">
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(event) => {
                          setOldPassword(event.target.value);
                          if (!event.target.value) {
                            return setErrors({
                              ...errors,
                              oldPassword: "Old Password is Required!",
                            });
                          } else {
                            return setErrors({
                              ...errors,
                              oldPassword: "",
                            });
                          }
                        }}
                        className="form-control form-control-line mb-1  "
                      />
                      {errors.oldPassword && (
                        <span style={{ color: "red" }}>
                          {errors.oldPassword}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="example-email" className="col-md-12">
                      New Password
                    </label>
                    <div className="col-md-12">
                      <input
                        type="password"
                        className="form-control form-control-line mb-2"
                        value={newPassword}
                        onChange={(event) => {
                          setNewPassword(event.target.value);
                          if (!event.target.value) {
                            return setErrors({
                              ...errors,
                              newPassword: "New is Required!",
                            });
                          } else {
                            return setErrors({
                              ...errors,
                              newPassword: "",
                            });
                          }
                        }}
                        name="example-email"
                        // id="example-email"
                      />
                      {errors.newPassword && (
                        <span style={{ color: "red" }}>
                          {errors.newPassword}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="example-email" className="col-md-12">
                      Confirm Password
                    </label>
                    <div className="col-md-12">
                      <input
                        type="password"
                        className="form-control form-control-line mb-2"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          if (!event.target.value) {
                            return setErrors({
                              ...errors,
                              confirmPassword: "Confirm Password is Required!",
                            });
                          } else {
                            return setErrors({
                              ...errors,
                              confirmPassword: "",
                            });
                          }
                        }}
                        name="example-email"
                        // id="example-email"
                      />
                      {errors.confirmPassword && (
                        <span style={{ color: "red" }}>
                          {errors.confirmPassword}
                        </span>
                      )}
                      {error && <span style={{ color: "red" }}>{error}</span>}
                    </div>
                  </div>

                  <div className="row justify-content-start">
                    <div className="form-group p-3 ">
                      <div className="col-sm-12 d-flex ">
                        <button
                          className="btn dark-icon btn-primary mb-3"
                          type="button"
                          onClick={changePassword}
                        >
                          Set Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminInfo;
