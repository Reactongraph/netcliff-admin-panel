//React
import React, { useEffect, useState } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

import $ from "jquery";

//types
import {
  CLOSE_ADMIN_TOAST,
  OPEN_ADMIN_TOAST,
  UNSET_ADMIN,
} from "../store/Admin/admin.type";

//action
import {
  getProfile,
  updateImage,
  updateProfile,
} from "../store/Admin/admin.action";

//axios
import axios from "axios";

//toast
import { setToast } from "../util/Toast";

import { projectName } from "../util/config";

//Toast
import { Toast } from "../util/Toast_";

import male from "../../src/Component/assets/images/admin.png";

import { uploadFile } from "../util/AwsFunction";
import { handleImageError } from "../util/helperFunctions";

const Profile = (props) => {
  //define dispatch and history
  const dispatch = useDispatch();
  const history = useHistory();

  //Define States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resURL, setResURL] = useState("");

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  //confirm password error
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const { admin, toast, toastData, actionFor } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    setData(admin);
  }, [admin]);

  useEffect(() => {
    setEmail(data.email);
    setName(data.name);
    setImagePath(data.image);
  }, [data]);

  const updateNameAndEmail = () => {
    if (!name || !email) {
      const errors = {};
      //for name validation
      if (!name) errors.name = "Name is Require!";
      //for email validation
      if (!email) errors.email = "Email is Require!";

      return setErrors({ ...errors });
    }

    const content = {
      name: name,
      email: email,
    };
    props.updateProfile(content);
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_ADMIN_TOAST });
    }
  }, [toast, toastData, actionFor]);

  const [fileUrl, setFileUrl] = useState("");

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      const errors = {};

      if (!oldPassword) errors.oldPassword = "Old Password is Required!";
      if (!newPassword) errors.newPassword = "New Password is Required!";
      if (!confirmPassword)
        errors.confirmPassword = "Confirm Password is Required!";

      return setErrors({ ...errors });
    } else {
      setError("");
      if (confirmPassword !== newPassword) {
        return setError("Password & Confirm Password do not match ❌");
      }

      axios
        .put("admin/updatePassword", {
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
    }
  };

  let folderStructure = projectName + "adminImage";

  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructure
    );
    setResURL(resDataUrl);
  };

  const handleChangeImage = (e) => {
    if (image?.length === 0 && !resURL) {
      Toast("info", "Please select image");
    } else {
      let imageURL = { image: resURL };
      props.updateImage(imageURL);
    }
  };

  return (
    <>
      <div id="content-page" class="content-page">
        <div class="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="iq-card">
                <h4 className="pt-3 pl-5">Admin Profile</h4>
                <div className="iq-card-body profile-page p-0">
                  <div className="profile-info p-4">
                    <div className="row">
                      <div className="col-sm-12 col-md-4">
                        <div className="pt-3  mb-4 card-background">
                          <div className="card-body">
                            <center className="mt-2">
                              <img
                                alt=""
                                src={imagePath ? imagePath : male}
                                width="150"
                                style={{
                                  width: "100%",
                                  height: "267px",
                                  objectFit: "cover",
                                }}
                                onError={(e) => handleImageError(e, male)}
                              />
                              <h4 className="card-title mt-3 text-capitalize">
                                {admin.name}
                              </h4>
                              <div className="row justify-content-center">
                                <div className="col-4">
                                  <a
                                    href={() => false}
                                    className="link justify-content-center"
                                  >
                                    <label for="fileupload">
                                      <i
                                        className="ri-image-2-fill fs-3"
                                        aria-hidden="true"
                                        style={{ color: "#fff" }}
                                      ></i>
                                    </label>
                                    <input
                                      type="file"
                                      id="fileupload"
                                      accept="image/png, image/jpeg ,image/jpg"
                                      hidden
                                      onChange={imageLoad}
                                    />
                                  </a>
                                </div>
                              </div>
                              <div className="col-sm-12 d-flex align-item-center justify-content-center">
                                <button
                                  className="btn btn-primary mb-3 mt-1 "
                                  type="button"
                                  style={{
                                    background:
                                      "rgba(34, 31, 58, 1) !important",
                                  }}
                                  onClick={handleChangeImage}
                                >
                                  Update Image
                                </button>
                              </div>
                            </center>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-8">
                        <div
                          className="cardBoader card-background"
                          style={{ borderRadius: "1.50rem !important" }}
                        >
                          <div className="card-body py-2">
                            <form>
                              <p class="heading-small text-muted my-4 adminInfo">
                                Admin information
                              </p>
                              <div class="pl-lg-4">
                                <div class="row">
                                  <div class="col-lg-6 pl-0">
                                    <div class="form-group">
                                      <label
                                        class="form-control-label"
                                        for="input-username"
                                      >
                                        Full Name
                                      </label>
                                      <input
                                        type="text"
                                        id="input-username"
                                        class="form-control"
                                        value={name}
                                        onChange={(event) => {
                                          setName(event.target.value);
                                          if (!event.target.value) {
                                            return setErrors({
                                              ...errors,
                                              name: "Name is Required!",
                                            });
                                          } else {
                                            return setErrors({
                                              ...errors,
                                              name: "",
                                            });
                                          }
                                        }}
                                      />
                                      {errors.name && (
                                        <span style={{ color: "#ee2e47" }}>
                                          {errors.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div class="col-lg-6">
                                    <div class="form-group">
                                      <label
                                        class="form-control-label"
                                        for="input-email"
                                      >
                                        Email address
                                      </label>
                                      <input
                                        type="email"
                                        id="input-email"
                                        class="form-control"
                                        value={email}
                                        onChange={(event) => {
                                          setEmail(event.target.value);
                                          if (!event.target.value) {
                                            return setErrors({
                                              ...errors,
                                              email: "Email is Required!",
                                            });
                                          } else {
                                            return setErrors({
                                              ...errors,
                                              email: "",
                                            });
                                          }
                                        }}
                                        name="example-email"
                                      />
                                      {errors.email && (
                                        <span style={{ color: "#ee2e47" }}>
                                          {errors.email}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-lg-12">
                                  <button
                                    className="btn btn-primary  mb-1 float-right"
                                    type="button"
                                    onClick={updateNameAndEmail}
                                  >
                                    Update Profile
                                  </button>
                                </div>
                              </div>
                              <hr
                                class="my-4"
                                style={{
                                  border:
                                    " 0.08px solid rgba(255, 255, 255, 0.2)",
                                }}
                              />
                              {/* <!-- Address --> */}
                              <p class="heading-small text-muted mb-4 adminInfo">
                                Change Password
                              </p>
                              <div class="pl-lg-4 ">
                                <div class="row">
                                  <div class="col-lg-4 pl-0">
                                    <div class="form-group">
                                      <label
                                        class="form-control-label"
                                        for="input-city"
                                      >
                                        Old Password
                                      </label>
                                      <input
                                        type="password"
                                        id="input-city"
                                        class="form-control"
                                        value={oldPassword}
                                        onChange={(event) => {
                                          setOldPassword(event.target.value);
                                          if (!event.target.value) {
                                            return setErrors({
                                              ...errors,
                                              oldPassword:
                                                "Old Password is Required!",
                                            });
                                          } else {
                                            return setErrors({
                                              ...errors,
                                              oldPassword: "",
                                            });
                                          }
                                        }}
                                      />
                                      {errors.oldPassword && (
                                        <span style={{ color: "#ee2e47" }}>
                                          {errors.oldPassword}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div class="col-lg-4">
                                    <div class="form-group">
                                      <label
                                        class="form-control-label"
                                        for="input-country"
                                      >
                                        New Password
                                      </label>
                                      <input
                                        type="password"
                                        id="input-country"
                                        class="form-control"
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
                                      />
                                      {errors.newPassword && (
                                        <span style={{ color: "#ee2e47" }}>
                                          {errors.newPassword}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div class="col-lg-4">
                                    <div class="form-group">
                                      <label
                                        class="form-control-label"
                                        for="input-country"
                                      >
                                        Confirm Password
                                      </label>
                                      <input
                                        type="password"
                                        id="input-postal-code"
                                        class="form-control"
                                        value={confirmPassword}
                                        onChange={(event) => {
                                          setConfirmPassword(
                                            event.target.value
                                          );
                                          if (!event.target.value) {
                                            return setErrors({
                                              ...errors,
                                              confirmPassword:
                                                "Confirm Password is Required!",
                                            });
                                          } else {
                                            return setErrors({
                                              ...errors,
                                              confirmPassword: "",
                                            });
                                          }
                                        }}
                                        name="example-email"
                                      />
                                      {errors.confirmPassword && (
                                        <span style={{ color: "#ee2e47" }}>
                                          {errors.confirmPassword}
                                        </span>
                                      )}
                                      {error && (
                                        <span style={{ color: "#ee2e47" }}>
                                          {error}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-lg-12">
                                  <button
                                    className="btn btn-primary mb-3 float-right"
                                    type="button"
                                    onClick={changePassword}
                                  >
                                    Set Password
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
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

export default connect(null, {
  getProfile,
  updateImage,
  updateProfile,
})(Profile);
