import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import {
  insertContact,
  updateContact,
} from "../../store/Contact/contact.action";
import { CLOSE_DIALOG } from "../../store/Contact/contact.type";

//Alert

import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";

const ContactDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.contact);

  const dispatch = useDispatch();

  //define states
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [contactId, setContactId] = useState("");
  const [resURL, setResURL] = useState("");

  const [error, setError] = useState({
    name: "",
    link: "",
    image: "",
  });

  //Insert Data Functionality
  const submitInsert = () => {
    if (!name || !link || !image) {
      const error = {};
      if (!name) error.name = "Name is Required !";
      if (!link) error.link = "Link is Required !";
      if (image.length === 0) error.image = "Image is Require !";

      return setError({ ...error });
    }
    dispatch({ type: CLOSE_DIALOG });

    let contactUs = {
      name,
      link,
      image: resURL,
    };

    props.insertContact(contactUs);
  };

  //Empty Data After Insert
  useEffect(() => {
    setName("");
    setLink("");
    setImagePath("");
    setContactId("");
    setError({
      name: "",
      link: "",
      image: "",
    });
  }, [open]);

  //Set Data Value
  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name);
      setLink(dialogData.link);
      setImagePath(dialogData.image);
      setContactId(dialogData._id);
    }
  }, [dialogData]);

  //Update Function
  const submitUpdate = () => {
    if (!name || !link) {
      const error = {};
      if (!name) error.name = "Name is Required !";
      if (!link) error.link = "Link is Required !";
      if (image.length === 0) error.image = "Image is Required !";

      return setError({ ...error });
    } else {
      if (resURL) {
        let contactUs = {
          name,
          link,
          image: resURL,
        };

        props.updateContact(contactId, contactUs);
      } else {
        let contactUs = {
          name,
          link,
        };
        props.updateContact(contactId, contactUs);
      }
      dispatch({ type: CLOSE_DIALOG });
    }
  };

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DIALOG });
  };

  let folderStructure = projectName + "contactUs";

  //  Image Load fffff
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructure
    );
    setResURL(resDataUrl);
    setImagePath(imageURL);
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Contact</h5> : <h5>Add Contact</h5>}
        </DialogTitle>

        <Tooltip title="Close">
          <CancelIcon
            className="cancelButton"
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>
        {/* </IconButton> */}
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">Name</label>
                      <input
                        type="text"
                        placeholder="Name"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(
                            e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1)
                          );
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              name: "name is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                      />
                      {error.name && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{
                              fontFamily: "Circular-Loom",
                              // color: "#FF2929",
                            }}
                          >
                            {error.name}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">Link</label>
                      <input
                        type="text"
                        placeholder="Link"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={link}
                        onChange={(e) => {
                          setLink(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              link: "Link is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              link: "",
                            });
                          }
                        }}
                      />
                      {error.link && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{
                              fontFamily: "Circular-Loom",
                              // color: "#FF2929",
                            }}
                          >
                            {error.link}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">Image</label>
                      <input
                        type="file"
                        id="customFile"
                        className="form-control pt-0 pl-0 pb-0"
                        accept="image/png, image/jpeg ,image/jpg"
                        required=""
                        onChange={imageLoad}
                        // style={{
                        //   paddingTop: "0px !important",
                        //   paddingBottom: "0px !important",
                        //   paddingLeft: "0px !important",
                        // }}
                      />
                      {image.length === 0 ? (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ fontFamily: "Circular-Loom" }}
                          >
                            {error.image}
                          </Typography>
                        </div>
                      ) : (
                        ""
                      )}

                      {imagePath && (
                        <>
                          <img
                            height="100px"
                            width="100px"
                            alt="app"
                            src={imagePath}
                            style={{
                              // boxShadow: "0 0 0 1.2px #7f65ad80",
                              borderRadius: 10,
                              marginTop: "10px",
                              float: "left",
                            }}
                          />

                          <div
                            className="img-container"
                            style={{
                              display: "inline",
                              position: "relative",
                              float: "left",
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className=" dia_border w-100 mt-0"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogData ? (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitUpdate}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitInsert}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { insertContact, updateContact })(ContactDialog);
