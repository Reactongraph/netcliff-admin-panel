import React, { useState, useEffect } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";

// material-ui
import { DialogActions, Typography } from "@mui/material";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { getMovie } from "../../store/Movie/movie.action";
import {
  updateTeamMember,
  insertTeamMember,
} from "../../store/TeamMember/teamMember.action";
import { CLOSE_DIALOG } from "../../store/TeamMember/teamMember.type";

//Alert

import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

const TeamMemberForm = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  //Get Data from Local Storage
  const dialogData = JSON.parse(
    localStorage.getItem("updateTeamMemberDataDialogue")
  );

  const movieTitle = localStorage.getItem("movieTitle");
  const tvSeriesId = JSON.parse(localStorage.getItem("trailerId"));

  const [resURL, setResURL] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [movies, setMovies] = useState("");
  // const [season, setSeason] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [error, setError] = useState({
    name: "",
    position: "",
    // season: "",
    movies: "",
    image: "",
  });

  //get movie data from movie
  const [movieData, setMovieData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    dispatch(getMovie());
  }, [dispatch]);

  //call the movie
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
    // }
    setName(dialogData?.name);
    setPosition(dialogData?.position);
    setMongoId(dialogData?._id);
    setMovies(dialogData?.movie?._id);
  }, []);
  //Insert and update Data Functionality

  const handleSubmit = (e) => {
    if (!name || !position) {
      const error = {};
      if (!name) error.name = "Name is Required!";
      if (image.length === 0) error.image = "Image is Required!";
      if (!position) error.position = "Position is Required !";

      return setError({ ...error });
    } else {
      if (dialogData) {
        if (resURL) {
          const objData = {
            image: resURL,
            name,
            position,
            movieId: tvSeriesId?._id,
          };
          props.updateTeamMember(dialogData?._id, objData);
        } else {
          const objData = {
            name,
            position,
            movieId: tvSeriesId?._id,
          };
          props.updateTeamMember(dialogData?._id, objData);
        }
        localStorage.removeItem("updateTeamMemberDataDialogue");
      } else {
        const objData = {
          image: resURL,
          name,
          position,
          movieId: tvSeriesId,
        };
        props.insertTeamMember(objData);
      }
      dispatch({ type: CLOSE_DIALOG });
      history.push("/admin/movie/cast");
    }
  };

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateTeamMemberDataDialogue");
    history.replace("/admin/movie/cast");
  };

  let folderStructureTrailerImage = projectName + "RoleImage";

  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureTrailerImage
    );

    setResURL(resDataUrl);

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
                            <label htmlFor="earning ">Movie</label>

                            <input
                              type="text"
                              placeholder="Name"
                              className="form-control form-control-line"
                              required
                              value={movieTitle}
                              readOnly
                            />
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
  getMovie,
})(TeamMemberForm);
