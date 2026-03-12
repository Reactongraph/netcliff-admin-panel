import React, { useState, useEffect } from "react";
import $ from "jquery";
import logo from "../assets/images/movie.png";
import { projectName, baseURL } from "../../util/config";
import adminImage from "../assets/images/admin.png";

//routing
import { NavLink, useHistory } from "react-router-dom";

//react-redux
import { useSelector, connect } from "react-redux";

//action
import { getProfile } from "../../store/Admin/admin.action";

//Alert
import Swal from "sweetalert2";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { setToast } from "../../util/Toast";

import notificationIcon from "../assets/images/Notiication.png";

//axios//Alert

import axios from "axios";

//Redux - Action
import { UNSET_ADMIN } from "../../store/Admin/admin.type";
import { useDispatch } from "react-redux";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import { handleImageError } from "../../util/helperFunctions";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { admin } = useSelector((state) => state.admin);
  //get admin
  const [data, setData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [targetUserIds, setTargetUserIds] = useState("");
  const [showURL, setShowURL] = useState("");
  const [resURL, setResURL] = useState("");

  const [errors, setError] = useState({
    title: "",
    image: "",
    description: "",
    type: "",
  });

  useEffect(() => {
    if (admin?.image) {
      const fileNameWithExtension = admin?.image.split("/").pop();
      const fetchData = async () => {
        try {
          const { imageURL } = await covertURl(
            "adminImage/" + fileNameWithExtension
          );
          setShowURL(imageURL);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [admin]);

  const [open, setOpen] = React.useState(false);

  let folderStructure = projectName + "notificationImage";

  const handleInputImage = async (e) => {
    setImageData(e.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      e.target.files[0],
      folderStructure
    );
    setResURL(resDataUrl);
    setImagePath(imageURL);
  };

  const handleSubmit = (e) => {
    if (!title || !description || !type) {
      const errors = {};

      if (!title) {
        errors.title = "Title can't be a blank!";
      }
      if (!description) {
        errors.description = "Description can't be a blank!";
      }

      if (!type) {
        errors.type = "Please select type!";
      }

      return setError({ ...errors });
    }

    setError({ ...errors, image: "" });
    setOpen(false);

    let notificationData = {
      title,
      description,
      notificationType: type,
      image: resURL,
      deepLink,
      targetUserIds: targetUserIds.trim(),
    };
    axios
      .post("notification/send", notificationData)
      .then((res) => {
        if (res.data.status === true) {
          setToast("Notification sent successfully!", "insert");
          setOpen(false);

          setError({
            title: "",
            image: "",
            description: "",
            type: "",
          });
          setTitle("");
          setDescription("");
          setDeepLink("");
          setTargetUserIds("");
          setImageData(null);
          setImagePath(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    setData(admin);
  }, [admin]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError({
      title: "",
      image: "",
      description: "",
      type: "",
    });
    setTitle("");
    setDescription("");
    setDeepLink("");
    setTargetUserIds("");
    setImageData(null);
    setImagePath(null);
    $("#file").val("");
  };
  //sidebar toggle function
  const handleCollapse = () => {
    $("body").toggleClass("sidebar-main");
    $(".wrapper-menu").toggleClass("open");
  };

  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch({ type: UNSET_ADMIN });
          history.push("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div
        className="iq-top-navbar"
        style={{
          // position: 'relative',
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <div className="iq-navbar-custom">
          <ul className="navbar-list fl-left">
            <li>
              <NavLink
                to="/admin/profile/admin_info"
                className="search-toggle iq-waves-effect d-flex align-items-center"
              >
                <img
                  src={showURL || adminImage}
                  onError={(e) => handleImageError(e, adminImage)}
                  className="img-fluid"
                  alt="user"
                  style={{ objectFit: "cover" }}
                />
                <div className="caption">
                  <h6 className="mb-0 line-height text-white">{data.name}</h6>
                </div>
              </NavLink>
              <div
                className="iq-sub-dropdown iq-user-dropdown"
                style={{ width: "210px" }}
              ></div>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto navbar-list">
            <li className="nav-item">
              <a
                className="search-toggle iq-waves-effect"
                onClick={handleClickOpen}
              >
                <div className="bell_icon">
                  <img
                    src={notificationIcon}
                    width="35px"
                    height="35px"
                    alt=""
                  />
                </div>
              </a>
            </li>
          </ul>

          <div className="iq-sidebar-logo">
            <div className="top-logo">
              <a href="index.html" className="logo">
                {/* <div className="iq-light-logo">
                  <img src="images/logo.gif" className="img-fluid" alt />
                </div>*/}
                <div className="iq-dark-logo ml-3">
                  <img src={logo} className="img-fluid" alt />
                </div>
                <span>{projectName}</span>
              </a>
            </div>
          </div>
          <nav className="navbar navbar-expand-lg navbar-light p-0">
            <div className="navbar-left"></div>
            <div
              className="iq-menu-bt align-self-center"
              style={{ marginLeft: "10px" }}
            >
              <div className="wrapper-menu">
                <div onClick={() => handleCollapse}>
                  <i className="ri-menu-3-line" />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* ------------ Notification Dialog ------------------ */}
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">{"Notification"}</DialogTitle>

        <Tooltip title="Close">
          <CancelIcon
            className="cancelButton"
            style={{
              position: "absolute",
              top: "23px",
              right: "15px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>
        <DialogContent>
          {/* <div  className="modal-body mt-0 px-1 pb-3"> */}
          <div className="d-flex flex-column text-center">
            <form>
              <div className="form-group mt-3">
                <label className="float-left">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(
                      e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1)
                    );
                    if (!e.target.value) {
                      return setError({
                        ...errors,
                        title: "Title can't be a blank!",
                      });
                    } else {
                      return setError({
                        ...errors,
                        title: "",
                      });
                    }
                  }}
                />
                {errors.title && (
                  <div className="pl-1 text-left error">
                    <Typography variant="caption">{errors.title}</Typography>
                  </div>
                )}
              </div>
              <div className="form-group mt-3">
                <label className="float-left">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  required
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);

                    if (!e.target.value) {
                      return setError({
                        ...errors,
                        description: "Description can't be a blank!",
                      });
                    } else {
                      return setError({
                        ...errors,
                        description: "",
                      });
                    }
                  }}
                />
                {errors.description && (
                  <div className="pl-1 text-left error">
                    <Typography variant="caption">
                      {errors.description}
                    </Typography>
                  </div>
                )}
              </div>

              <div className="form-group mt-3">
                <label className="float-left">Notification Type</label>
                <select
                  name="type"
                  className="form-control form-control-line"
                  id="type"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);

                    if (!e.target.value) {
                      return setError({
                        ...errors,
                        type: "Notification type is Required!",
                      });
                    } else {
                      return setError({
                        ...errors,
                        type: "",
                      });
                    }
                  }}
                >
                  <option>Select Type</option>
                  <option>General Notification</option>
                  <option>App Update</option>
                  {/* {categoryData.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })} */}
                </select>
                {errors.type && (
                  <div className="pl-1 text-left error">
                    <Typography variant="caption">{errors.type}</Typography>
                  </div>
                )}
              </div>

              <div className="form-group mt-3">
                <label className="float-left">Deep Link (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., myapp://movie/123"
                  value={deepLink}
                  onChange={(e) => setDeepLink(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <label className="float-left">Target User IDs (Optional)</label>
                <textarea
                  className="form-control"
                  placeholder="Enter comma-separated user IDs (leave empty for all users)"
                  rows="3"
                  value={targetUserIds}
                  onChange={(e) => setTargetUserIds(e.target.value)}
                />
                <small className="text-muted">Example: 507f1fbcf39011, 507f1729de860ea</small>
              </div>

              <div className="form-group mt-3 mb-4 pb-3">
                <label className="float-left">Image</label>
                <input
                  className="form-control"
                  type="file"
                  id="customFile"
                  required=""
                  accept="image/png, image/jpeg ,image/jpg"
                  onChange={handleInputImage}
                />
                {/* {errors.image && (
                  <div className="pl-1 text-left">
                    <Typography variant="caption" color="error">
                      {errors.image}
                    </Typography>
                  </div> 
                )} */}
                {imagePath && (
                  <div className="row pl-3">
                    <img
                      src={imagePath}
                      style={{
                        boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                        border: "2px solid rgb(105 103 103 / 0%)",
                        borderRadius: "10px !important",
                        marginTop: 10,
                        float: "left",
                        objectFit: "cover",
                        height: "70px",
                        width: "70px",
                      }}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
        <div>
          <hr className="dia_border w-100 mt-0"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn dark-icon btn-primary float-right mr-3 mb-3"
            onClick={handleSubmit}
          >
            <i className="ri-send-plane-fill mr-1 fs-6 mb-1"></i>
            Send
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { getProfile })(Navbar);
