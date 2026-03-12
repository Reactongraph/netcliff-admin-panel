import React, { useState, useEffect } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";

// material-ui
import { DialogActions, Typography } from "@mui/material";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { getMovieCategory } from "../../store/Movie/movie.action";
import {
  updateTeamMember,
  insertTeamMember,
} from "../../store/TeamMember/teamMember.action";
import { CLOSE_DIALOG } from "../../store/TeamMember/teamMember.type";
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

//Alert

import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";

const SeriesTeamMemberForm = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const movieTitle = localStorage.getItem("seriesTitle");
  const tvSeriesId = sessionStorage.getItem("tvSeriesId");

  //Get Data from Local Storage
  const dialogData = JSON.parse(localStorage.getItem("updateTeamMemberData"));

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [movies, setMovies] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [error, setError] = useState({
    name: "",
    position: "",
    movies: "",
    image: "",
  });

  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    dispatch(getMovieCategory());
  }, [dispatch]);

  const { movie } = useSelector((state) => state.movie);
  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  //Empty Data After Insertion
  useEffect(() => {
    setName("");
    setPosition("");
    // setSeason("");
    setMovies("");
    setImagePath("");
    setError({
      name: "",
      position: "",
      // season: "",
      movies: "",
      image: "",
    });
  }, []);

  useEffect(() => {
    setImagePath(
      dialogData?.image === "https://www.themoviedb.org/t/p/originalnull"
        ? placeholderImage
        : dialogData?.image
    );

    setName(dialogData?.name);
    setPosition(dialogData?.position);
    // setSeason(dialogData.season);
    setMongoId(dialogData?._id);
    setMovies(dialogData?.movie?._id);
  }, []);

  //Insert and update Data Functionality
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mongoId) {
      if (!image || !imagePath || !name || !position) {
        const error = {};
        if (!name) error.name = "Name is Required!";
        if (!image || !imagePath) error.image = "Image is Required!";
        if (!position) error.position = "Position is Required !";

        return setError({ ...error });
      }
    } else {
      if (!image && !imagePath && !name && !position && !movies) {
        if (!name) error.name = "Name is Required!";
        if (image.length === 0 && !imagePath)
          error.image = "Image is Required!";
        if (!position) error.position = "Position is Required !";
        if (!movies) error.movies = "Movie is Required !";
        return setError({ ...error });
      }
    }

    if (mongoId) {
      if (resUrl) {
        let objData = {
          name,
          movieId: tvSeriesId,
          position,
          image: resUrl,
        };
        props.updateTeamMember(mongoId, objData);
      } else {
        let objData = {
          name,
          movieId: tvSeriesId,
          position,
        };

        props.updateTeamMember(mongoId, objData);
      }
    } else {
      let objData = {
        name,
        movieId: tvSeriesId,
        position,
        image: resUrl,
      };
      props.insertTeamMember(objData);
    }
    dispatch({ type: CLOSE_DIALOG });
    localStorage.removeItem("updateTeamMemberData");
    // history.push("/admin/web_series/cast");
    setTimeout(() => {
      history.replace("/admin/web_series/cast");
    }, [1000]);
  };

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateTeamMemberData");
    history.replace("/admin/web_series/cast");
  };

  let folderStructureMovieImage = projectName + "seriesRole";
  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResUrl(resDataUrl);

    setImagePath(imageURL);
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
            {/* <!-- start page title --> */}
            {/* <div class="row"> */}
            <div class="col-12">
              <div class="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
                <h4 class="ml-3">Role</h4>
              </div>
            </div>
          </div>
          {/* <!-- end page title --> */}

          <div className="col-lg-12">
            <div className="mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className="modal-body pt-1 px-1 pb-3">
                  <div className="d-flex flex-column">
                    <form>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-12 my-2 ">
                            <label className="float-left styleForTitle">
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="Name"
                              className="form-control form-control-line"
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
                                    name: "Name is Required!",
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
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.name}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12 my-2 ">
                            <label className="float-left styleForTitle">
                              Position
                            </label>
                            <input
                              type="text"
                              placeholder="Position"
                              className="form-control form-control-line"
                              required
                              value={position}
                              onChange={(e) => {
                                setPosition(e.target.value);

                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    position: "Position is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    position: "",
                                  });
                                }
                              }}
                            />
                            {error.position && (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  color="error"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.position}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 my-2 styleForTitle">
                            <label htmlFor="earning ">Web Series</label>

                            <input
                              type="text"
                              placeholder="Name"
                              className="form-control form-control-line"
                              value={movieTitle}
                            />
                            {error.movies && (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  color="error"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.movies}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12 my-2">
                            <label className="float-left styleForTitle">
                              Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="customFile"
                              accept="image/png, image/jpeg ,image/jpg"
                              Required=""
                              onChange={imageLoad}
                            />

                            {imagePath ? (
                              <>
                                {imagePath ? (
                                  <img
                                    height="100px"
                                    width="100px"
                                    alt="app"
                                    src={imagePath}
                                    style={{
                                      boxShadow:
                                        " rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                      border:
                                        "0.5px solid rgba(255, 255, 255, 0.2)",
                                      borderRadius: "10px",
                                      marginTop: "10px",
                                      float: "left",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}

                                <div
                                  className="img-container"
                                  style={{
                                    display: "inline",
                                    position: "relative",
                                    float: "left",
                                    objectFit: "cover",
                                  }}
                                ></div>
                              </>
                            ) : (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  color="error"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.image}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <DialogActions>
                        {dialogData ? (
                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3 py-1 mb-3"
                            onClick={handleSubmit}
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
                            onClick={handleSubmit}
                          >
                            Insert
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-3 py-1 mr-3 mb-3"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      </DialogActions>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* </div> */}
    </>
  );
};

export default connect(null, {
  insertTeamMember,
  updateTeamMember,
  getMovieCategory,
})(SeriesTeamMemberForm);
