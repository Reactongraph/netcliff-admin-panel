import React, { useState, useRef, useEffect } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { DialogActions, Typography } from "@mui/material";
import noImage from "../assets/images/noImage.png";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getMovieIdList,
  getWebSeriesIdList,
} from "../../store/Movie/movie.action";
import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";
import { handleImageError } from "../../util/helperFunctions";
import { getChannelIdList } from "../../store/LiveTv/liveTv.action";
import { insertAdBanner } from "../../store/AdBanner/adBanner.action";

const AdBannerForm = (props) => {
  const history = useHistory();
  const editor = useRef(null);
  const imageRef = useRef();
  const [description, setDescription] = useState("");

  const handlePaste = (e) => {
    const bufferText = (e?.originalEvent || e).clipboardData.getData(
      "text/plain"
    );
    e.preventDefault();
    document.execCommand("insertText", false, bufferText);
  };
  const [editorOptions] = useState({
    buttonList: [
      ["undo", "redo"],
      ["font", "fontSize", "formatBlock"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["removeFormat"],
      ["outdent", "indent"],
      ["align", "horizontalRule", "list", "table"],
      ["link", "image", "video"],
      ["fullScreen", "showBlocks", "codeView"],
      ["preview", "print"],
      ["save"],
    ],
    onPaste: handlePaste,
  });

  const handleClickImage = (e) => {
    imageRef.current.click();
  };

  const dispatch = useDispatch();
  const { idListMovie, idListWebSeries } = useSelector((state) => state.movie);
  const { idListChannel } = useSelector((state) => state.liveTv);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentId, setContentId] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState("");
  const [resURL, setResURL] = useState("");

  useEffect(() => {
    setError({});
  }, []);
  useEffect(() => {
    dispatch(getChannelIdList());
    dispatch(getMovieIdList());
    dispatch(getWebSeriesIdList());
  }, [dispatch]);

  const handleClose = () => {
    history.goBack();
  };

  let folderStructureMovieImage = projectName + "bannerImage";
  const imageLoad = async (event) => {
    const file = event.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width === 1920 && img.height === 1080) {
        const { resDataUrl, imageURL } = await uploadFile(
          file,
          folderStructureMovieImage
        );

        setResURL(resDataUrl);
        setImagePath(imageURL);
        setError((prev) => ({
          ...prev,
          image: null,
        }));
      } else {
        setError((prev) => ({
          ...prev,
          image: "Please upload an image with dimensions 1920x1080.",
        }));
      }
    };
  };

  const handleSubmit = async () => {
    if (!title) {
      setError((prev) => ({ ...prev, title: "Title is required." }));
    }
    if (!description) {
      setError((prev) => ({
        ...prev,
        description: "Description is required.",
      }));
    }
    if (!contentType || contentType === "select_Content_type") {
      setError((prev) => ({
        ...prev,
        contentType: "Content type is required.",
      }));
    }
    if (!contentId || contentId === "select_content_id") {
      setError((prev) => ({ ...prev, contentId: "Content Id is required." }));
    }
    if (!resURL) {
      setError((prev) => ({ ...prev, image: "Image is required." }));
    }

    const objData = {
      title,
      description,
      contentType,
      contentId,
      image: resURL,
    };

    props.insertAdBanner(objData, handleClose);
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="header_heading p_zero">
                <div className="d-flex align-items-center">
                  <NavLink to="/admin/banner">
                    <i class="fa-solid fa-angles-left  p-2" />
                  </NavLink>
                  <h3>Create Banner</h3>
                </div>
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <div className="row my-4">
                    <div className="col-md-6 iq-item-product-left">
                      <div className="iq-image-container">
                        <div className="iq-product-cover">
                          <div class="custom_field_col wdt100">
                            <label>Title</label>
                            <input
                              type="text"
                              name="title"
                              placeholder="Title"
                              className="form-control form-control-line"
                              Required
                              value={title}
                              onChange={(e) => {
                                setTitle(e.target.value);
                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    title: "Title is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    title: "",
                                  });
                                }
                              }}
                            />

                            {error.title && (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.title}
                                </Typography>
                              </div>
                            )}
                          </div>

                          <div class="custom_field_col wdt100">
                            <label htmlFor="description">Description</label>

                            <SunEditor
                              value={description}
                              setContents={description}
                              ref={editor}
                              height={150}
                              onChange={(e) => {
                                setDescription(e);

                                if (!e) {
                                  return setError({
                                    ...error,
                                    description: "Description is Required !",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    description: "",
                                  });
                                }
                              }}
                              placeholder="Description"
                              setOptions={editorOptions}
                            />

                            {error.description && (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.description}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 iq-item-product-right">
                      <div className="product-additional-details">
                        <div class="custom_field_col wdt100">
                          <label>Image</label>

                          <div className="d-flex ">
                            {imagePath ? (
                              <>
                                <input
                                  ref={imageRef}
                                  type="file"
                                  className="form-control"
                                  id="customFile"
                                  accept="image/png, image/jpeg ,image/jpg"
                                  Required=""
                                  onChange={imageLoad}
                                  style={{ display: "none" }}
                                  enctype="multipart/form-data"
                                />
                                <img
                                  onClick={handleClickImage}
                                  alt="app"
                                  src={imagePath}
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                    borderRadius: "0.25rem",

                                    maxWidth: "200px",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                  onError={(e) => handleImageError(e, noImage)}
                                />
                              </>
                            ) : (
                              <>
                                {imagePath ? (
                                  <img
                                    alt=""
                                    src={imagePath || noImage}
                                    onClick={handleClickImage}
                                    style={{
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                      borderRadius: "0.25rem",
                                      width: "745px",
                                      height: "270px",
                                    }}
                                    onError={(e) =>
                                      handleImageError(e, noImage)
                                    }
                                  />
                                ) : (
                                  <div class="select_image">
                                    <i
                                      className="fas fa-plus"
                                      style={{
                                        paddingTop: 56,
                                        fontSize: 165,
                                        fontWeight: 400,
                                        color: "#4d848f",
                                      }}
                                    />

                                    <input
                                      autocomplete="off"
                                      tabIndex="-1"
                                      style={{
                                        position: "absolute",
                                        top: 112,
                                        transform: "scale(3.5)",
                                        opacity: 0,
                                      }}
                                      type="file"
                                      className="form-control"
                                      id="customFile"
                                      accept="image/png, image/jpeg ,image/jpg"
                                      Required=""
                                      onChange={imageLoad}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {error.image ? (
                            <div className="pl-1 text-left">
                              <Typography
                                variant="caption"
                                style={{
                                  fontFamily: "Circular-Loom",
                                  color: "#ee2e47",
                                }}
                              >
                                {error.image}
                              </Typography>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div class="custom_field_col wdt100">
                          <label>Content Type</label>

                          <select
                            name="contentType"
                            className="form-control form-control-line selector"
                            id="contentType"
                            value={contentType}
                            onChange={(e) => {
                              setContentType(e.target.value);
                            }}
                          >
                            <option value="select_Content_type">Select</option>
                            <option value="movie">Movie</option>
                            <option value="web-series">Web Series</option>
                            <option value="channel">TV Channel</option>
                          </select>

                          {error.contentType && (
                            <div className="pl-1 text-left">
                              <Typography
                                variant="caption"
                                style={{
                                  fontFamily: "Circular-Loom",
                                  color: "#ee2e47",
                                }}
                              >
                                {error.contentType}
                              </Typography>
                            </div>
                          )}
                        </div>

                        <div class="custom_field_col wdt100">
                          {contentType === "movie" && (
                            <>
                              <label>Select Movie</label>
                              <select
                                name="contentId"
                                className="form-control form-control-line selector"
                                id="contentId"
                                value={contentId}
                                onChange={(e) => {
                                  setContentId(e.target.value);
                                }}
                              >
                                <option value="select_content_id">
                                  Select
                                </option>
                                {idListMovie.map((idl) => {
                                  return (
                                    <option key={idl._id} value={idl._id}>
                                      {idl.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </>
                          )}
                          {contentType === "web-series" && (
                            <>
                              <label>Select Web Series</label>
                              <select
                                name="contentId"
                                className="form-control form-control-line selector"
                                id="contentId"
                                value={contentId}
                                onChange={(e) => {
                                  setContentId(e.target.value);
                                }}
                              >
                                <option value="select_content_id">
                                  Select
                                </option>
                                {idListWebSeries.map((idl) => {
                                  return (
                                    <option key={idl._id} value={idl._id}>
                                      {idl.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </>
                          )}
                          {contentType === "channel" && (
                            <>
                              <label>Select TV Channel</label>
                              <select
                                name="contentId"
                                className="form-control form-control-line selector"
                                id="contentId"
                                value={contentId}
                                onChange={(e) => {
                                  setContentId(e.target.value);
                                }}
                              >
                                <option value="select_content_id">
                                  Select
                                </option>
                                {idListChannel.map((idl) => {
                                  return (
                                    <option key={idl._id} value={idl._id}>
                                      {idl.channelName}
                                    </option>
                                  );
                                })}
                              </select>
                            </>
                          )}

                          {error.contentId && (
                            <div className="pl-1 text-left">
                              <Typography
                                variant="caption"
                                style={{
                                  fontFamily: "Circular-Loom",
                                  color: "#ee2e47",
                                }}
                              >
                                {error.contentId}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogActions className="button_wrapper">
                    <button
                      type="button"
                      className="defualt_btn "
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="defualt_btn whte_btn"
                      onClick={handleSubmit}
                    >
                      Insert
                    </button>
                  </DialogActions>
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
  insertAdBanner,
})(AdBannerForm);
