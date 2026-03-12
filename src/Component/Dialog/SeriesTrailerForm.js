import React, { useState, useEffect } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";

// material-ui
import { DialogActions, Typography } from "@mui/material";

//react-redux
import { useDispatch } from "react-redux";
import { connect } from "react-redux";

//action
import { getMovie } from "../../store/Movie/movie.action";
import {
  insertTrailer,
  updateTrailer,
} from "../../store/Trailer/trailer.action";

//alert

import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";
import Input from "../molecules/Input";
import Select from "../molecules/Select";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import { Toast } from "../../util/Toast_";

const SeriesTrailerForm = (props) => {
  const history = useHistory();
  const movieTitle = localStorage.getItem("seriesTitle");
  const tvSeriesId = sessionStorage.getItem("tvSeriesId");
  const dispatch = useDispatch();

  //Get Data from Local Storage
  const dialogData = JSON.parse(localStorage.getItem("updateTrailerData"));
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [setMovie] = useState("");
  const [videoType, setVideoType] = useState("");
  const [setMongoId] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [updateType, setUpdateType] = useState("");
  const [convertUpdateType, setConvertUpdateType] = useState({
    trailerImage: "",
    videoUrl: "",
  });

  const [resURL, setResURL] = useState({
    trailerImageResURL: "",
    trailerVideoResURL: "",
  });
  const [error, setError] = useState({
    name: "",
    type: "",
    video: "",
    videoUrl: "",
    videoType: "",
    movie: "",
    image: "",
  });

  // Monitor data and update state
  useEffect(() => {
    if (dialogData) {
      setName(dialogData?.name);
      setType(dialogData?.type);
      setMongoId(dialogData?._id);
      setUpdateType(dialogData?.updateType);
      setConvertUpdateType({
        trailerImage: dialogData?.convertUpdateType?.trailerImage || "",
        videoUrl: dialogData?.convertUpdateType?.videoUrl || "",
      });
      setMovie(dialogData?.movieId);
      setImagePath(dialogData?.trailerImage);
      setVideoType(dialogData?.videoType);

      if (dialogData?.videoType == 0) {
        setVideoUrl(dialogData?.videoUrl);
      } else if (dialogData?.videoType == 1) {
        setVideoPath(dialogData?.videoUrl);
      }
    }
  }, [dialogData]);

  const handleInputChange = (e, setter, fieldName) => {
    let value = e.target.value;
    if (fieldName === "name") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setter(value);
    if (value && value !== "select Trails" && value !== "select") {
      setError((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setImage(file);
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      trailerImage: 1,
    });
    setImagePath(imageURL);
    setResURL({ ...resURL, trailerImageResURL: resDataUrl });
  };

  //useEffect for getmovie
  useEffect(() => {
    dispatch(getMovie());
  }, [dispatch]);

  //Insert Data
  const insertSubmit = () => {
    if (!name || !type || type === "select Trails" || videoType == "select") {
      const error = {};
      if (!name) {
        error.name = "Name is Required !";
        Toast("error", "Name is Required !");
      }
      if (videoType == "select") {
        error.videoType = "Video Type is Required";
        Toast("error", "Video Type is Required");
      }

      if (!videoType) {
        if (!videoUrl) {
          error.videoUrl = "Youtube URL is Required !";
          Toast("error", "Youtube URL is Required !");
        }
      } else if (videoType == 1) {
        if (video.length === 0 && !videoPath) {
          error.video = "Video is Required !";
          Toast("error", "Video is Required !");
        }
      }

      if (!type || type === "select Trails") {
        error.type = "Type is Required !";
        Toast("error", "Type is Required !");
      }

      if (!imagePath) {
        error.image = "Image is Require !";
        Toast("error", "Image is Required !");
      }

      return setError({ ...error });
    } else {
      if (dialogData) {
        if (resURL?.trailerImageResURL || resURL?.trailerVideoResURL) {
          const objData = {
            name,
            type,
            videoType,
            updateType,
            convertUpdateType,
            movie: tvSeriesId,
            trailerImage: resURL?.trailerImageResURL,
            videoUrl: videoType == 0 ? videoUrl : resURL?.trailerVideoResURL,
          };
          props.updateTrailer(objData, dialogData?._id);
        } else {
          const objData = {
            name,
            type,
            videoType,
            updateType,
            convertUpdateType,
            movie: tvSeriesId,
          };

          props.updateTrailer(objData, dialogData?._id);
          localStorage.removeItem("updateTrailerData");
        }
      } else {
        const objData = {
          name,
          type,
          videoType,
          updateType,
          convertUpdateType,
          movie: tvSeriesId,
          trailerImage: resURL?.trailerImageResURL,
          videoUrl: videoType == 0 ? videoUrl : resURL?.trailerVideoResURL,
        };
        props.insertTrailer(objData);
      }

      history.push("/admin/web_series/trailer");
    }
  };

  let folderStructureTrailerVideo = projectName + "trailerVideo";

  //Video Load
  const videoLoad = async (event) => {
    setVideo(event.target.files[0]);
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      videoUrl: 1,
    });
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureTrailerVideo
    );

    setResURL({ ...resURL, trailerVideoResURL: resDataUrl });
    // setShowURL({ ...showURL, trailerVideoShowURL: imageURL });

    setVideoPath(URL.createObjectURL(event.target.files[0]));
  };

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateTrailerData");
    history.replace("/admin/web_series/trailer");
  };

  return (
    <>
      <div
        id="content-page"
        class="content-page"
        style={{ marginRight: "0px" }}
      >
        <div class="container-fluid">
          <div class="row">
            <div class="row">
              <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
                  <h4 class="ml-3">Trailer </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <div className="modal-body pt-1 px-1 pb-3">
                    <div className="d-flex flex-column">
                      <div className="row">
                        <Input
                          label="Name"
                          placeholder="Name"
                          required
                          name="name"
                          value={name}
                          onChange={(e) => handleInputChange(e, setName, "name")}
                          error={error.name}
                          className="col-md-12 my-2"
                        />
                      </div>

                      <div className="row">
                        <Select
                          label="Type"
                          name="type"
                          value={type}
                          options={[
                            { value: "select Trails", label: "Select Type" },
                            { value: "trailer", label: "Trailer" },
                            { value: "teaser", label: "Teaser" },
                            { value: "clip", label: "Clip" }
                          ]}
                          onChange={(e) => handleInputChange(e, setType, "type")}
                          error={error.type}
                          className="col-md-12 my-2"
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 my-2">
                          <Input
                            label="Movie"
                            name="movie"
                            value={movieTitle}
                            readOnly
                          />
                        </div>
                        <Select
                          label="Video Type"
                          name="videoType"
                          value={videoType}
                          options={[
                            { value: "select", label: "Select Video Type" },
                            { value: "0", label: "Youtube Url" },
                            { value: "1", label: "File (MP4/MOV/MKV/WEBM)" }
                          ]}
                          onChange={(e) => handleInputChange(e, setVideoType, "videoType")}
                          error={error.videoType}
                          className="col-md-6 my-2"
                        />
                      </div>

                      <div className="row">
                        <ImageVideoFileUpload
                          label="Image"
                          imagePath={imagePath}
                          error={error.image}
                          folderStructure={projectName + "trailerImage"}
                          onUploadSuccess={handleImageSuccess}
                          className="col-md-6 my-2"
                        />

                        <div className="col-md-6 my-2">
                          {videoType == "0" && (
                            <Input
                              label="Video URL"
                              placeholder="Link"
                              name="videoUrl"
                              value={videoUrl}
                              onChange={(e) => handleInputChange(e, setVideoUrl, "videoUrl")}
                              error={error.videoUrl}
                            />
                          )}
                          {videoType == "1" && (
                            <div className="form-group">
                              <label>Video File</label>
                              <input
                                type="file"
                                className="form-control"
                                accept="video/*"
                                onChange={videoLoad}
                              />
                              {videoPath && (
                                <video
                                  height="100px"
                                  width="100px"
                                  controls
                                  src={videoPath}
                                  style={{
                                    boxShadow: "rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                    border: "0.5px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: "10px",
                                    marginTop: "10px",
                                  }}
                                />
                              )}
                              {error.video && (
                                <div className="pl-1 text-left">
                                  <Typography variant="caption" color="error">
                                    {error.video}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <DialogActions>
                        <button
                          type="button"
                          className={`btn ${dialogData ? 'btn-success' : 'btn-primary'} btn-sm px-3 py-1`}
                          onClick={insertSubmit}
                        >
                          {dialogData ? "Update" : "Insert"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-3 py-1"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      </DialogActions>
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
  insertTrailer,
  updateTrailer,
  getMovie,
})(SeriesTrailerForm);
