import { useState, useEffect } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";

// material-ui
import { DialogActions, } from "@mui/material";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { getMovieCategory } from "../../store/Movie/movie.action";
import { getSeason } from "../../store/Season/season.action";
import {
  insertEpisode,
  updateEpisode,
} from "../../store/Episode/episode.action";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import Input from "../molecules/Input";
import Select from "../molecules/Select";
import { projectName, baseURL } from "../../util/config";
import { Toast } from "../../util/Toast_";
import { videoTypeOptions } from "../../util/contants";
import VideoUploadHLS from "../molecules/VideoUploadHLS";

const EpisodeForm = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  //Get Data from Local Storage
  const dialogData = JSON.parse(localStorage.getItem("updateEpisodeData"));

  const dialogData_ = JSON.parse(localStorage.getItem("updateMovieData"));

  const [name, setName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");

  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [movies, setMovies] = useState("");
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [mongoId, setMongoId] = useState("");
  const [videoType, setVideoType] = useState(0);
  const [url, setUrl] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [convertUpdateType, setConvertUpdateType] = useState({
    image: "",
    videoUrl: "",
  });
  const [update, setUpdate] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [existingHlsFileName, setExistingHlsFileName] = useState("");
  const [drmEnabled, setDrmEnabled] = useState(false); // Default to false (No DRM)

  const [error, setError] = useState({
    episodeNumber: "",
    name: "",
    seasonNumber: "",
    movies: "",
    video: "",
    videoType: "",
  });
  const [data, setData] = useState({
    episodeNumber: "",
    name: "",
    seasonNumber: "",
    movies: "",
    image: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    video: "",
    drmEnabled: false, // Add DRM enabled boolean to data state - default to false
  });

  const [resURL, setResURL] = useState({
    episodeImageResURL: "",
  });

  const movieTitle = localStorage.getItem("seriesTitle");
  const tvSeriesId = sessionStorage.getItem("tvSeriesId");

  const handleInputChange = (e, setter, fieldName) => {
    let value = e.target.value;
    if (fieldName === "name") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (fieldName === "videoType" || fieldName === "episodeNumber") {
      value = value === "" ? "" : parseInt(value);
    }
    setter(value);
    if (value === "" || value === undefined) {
      setError((prev) => ({ ...prev, [fieldName]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is Required!` }));
    } else {
      setError((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleUrlChange = (value) => {
    setUrl(value);
    if (!value) {
      setError((prev) => ({ ...prev, url: "URL is Required!" }));
    } else {
      setError((prev) => ({ ...prev, url: "" }));
    }
  };

  //get movie data from movie
  const [movieData, setMovieData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    dispatch(getMovieCategory());
  }, [dispatch]);

  //call the movie
  const { movie } = useSelector((state) => state.movie);

  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  //get tv series season from season
  const [seasonData, setSeasonData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    dispatch(getSeason(dialogData_._id));
  }, [dispatch]);

  //call the season
  const { season } = useSelector((state) => state.season);

  useEffect(() => {
    setSeasonData(season);
  }, [season]);

  //Empty Data After Insertion
  useEffect(() => {
    setName("");
    setEpisodeNumber("");
    setSeasonNumber("");
    setMovies("");
    setImagePath("");
    setVideoType("");
    setError({
      name: "",
      episodeNumber: "",
      seasonNumber: "",
      movies: "",
      video: "",
      videoType: "",
    });
  }, []);

  //Set Value For Update
  useEffect(() => {
    if (dialogData) {
      setEpisodeNumber(dialogData.episodeNumber);
      setName(dialogData.name);
      setSeasonNumber(dialogData.season);
      setMongoId(dialogData._id);
      setMovies(dialogData.movieId);
      setImagePath(dialogData.image);
      setUpdateType(dialogData?.updateType);
      setConvertUpdateType({
        image: dialogData?.convertUpdateType?.image
          ? dialogData?.convertUpdateType?.image
          : "",
        videoUrl: dialogData?.convertUpdateType?.videoUrl
          ? dialogData?.convertUpdateType?.videoUrl
          : "",
      });
      setVideoType(parseInt(dialogData.videoType));
      if ([0, 1, 2, 3, 4, 5, 7].includes(parseInt(dialogData.videoType))) {
        setUrl(dialogData.videoUrl);
      }
      setExistingHlsFileName(dialogData.hlsFileName || "");
      // Properly handle DRM enabled boolean value from existing data
      const drmValue = dialogData.drmEnabled !== undefined ? dialogData.drmEnabled : false;
      setDrmEnabled(drmValue);
      // Update the data state as well
      setData(prevData => ({
        ...prevData,
        drmEnabled: drmValue
      }));
    }
  }, []);

  // Sync data state with drmEnabled changes
  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      drmEnabled: drmEnabled
    }));
  }, [drmEnabled]);


  //Insert Data
  const handleSubmit = async (e) => {
    if (!name || !episodeNumber || !seasonNumber || videoType === "" || videoType === undefined) {
      const error = {};
      if (!name) error.name = "Name is Required !";
      if (!episodeNumber) error.episodeNumber = "Episode Number is Required !";
      if (!seasonNumber) error.seasonNumber = "Season is Required !";
      if (videoType === "" || videoType === undefined) error.videoType = "Video Type is required !";

      if ([0, 1, 2, 3, 4, 5, 7].includes(videoType) && !url) {
        error.url = "URL is required !";
      }



      if (videoType == 8 && !existingHlsFileName) {
        error.url = "Video upload is required!";
      }

      return setError({ ...error });
    }

    if ([0, 1, 2, 3, 4, 5, 7].includes(videoType)) {
      if (!isValidURL(url)) {
        Toast("error", "Please provide a valid URL!");
        return setError({ ...error, url: "Invalid URL!" });
      }
    }

    const objData = {
      movieId: tvSeriesId,
      name,
      episodeNumber,
      season: seasonNumber,
      videoType,
      updateType,
      convertUpdateType,
      image: imagePath || "",
      videoUrl: [0, 1, 2, 3, 4, 5, 7].includes(videoType) ? url : "",
      drmEnabled: drmEnabled,
    };

    // Only include image if it's available
    if (imagePath || resURL?.episodeImageResURL) {
      objData.image = resURL?.episodeImageResURL || imagePath;
    }

    // Add Mux upload specific fields
    if (videoType == 8) {
      if (!existingHlsFileName) {
        setError((prev) => ({ ...prev, url: "Video upload is required!" }));
        return;
      }
      objData.uploadId = existingHlsFileName;
      objData.hlsFileName = existingHlsFileName;
      objData.hlsFileExt = "m3u8";
      objData.drmEnabled = drmEnabled; // Include DRM enabled flag
      // Don't set videoUrl for Mux uploads
      objData.videoUrl = "";
    }

    console.log('Submitting episode data:', objData); // Debug log

    try {
      setLoading(true); // Set loading state
      await props.insertEpisode(objData);
      setLoading(false); // Clear loading state
      history.replace({
        pathname: "/admin/episode",
        state: data,
      });
    } catch (error) {
      setLoading(false); // Clear loading state on error
      console.error("Error creating episode:", error);
      // Error is already handled in the action with Toast
    }
  }

  const isValidURL = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  //Update Function
  const updateSubmit = async () => {
    if (!name || !seasonNumber || !episodeNumber || episodeNumber === "" || episodeNumber === undefined || episodeNumber < 0) {
      const error = {};
      if (!name) error.name = "Name is Required !";
      if (!episodeNumber) error.episodeNumber = "Episode Number is Required !";
      if (episodeNumber < 0) error.episodeNumber = "Episode Number Invalid !";
      if (!seasonNumber) error.seasonNumber = "Season is Required !";

      return setError({ ...error });
    }
    const objData = {
      movieId: tvSeriesId,
      name,
      episodeNumber,
      updateType,
      convertUpdateType,
      season: seasonNumber,
      videoType,
      image: resURL?.episodeImageResURL || imagePath || "",
      videoUrl: [0, 1, 2, 3, 4, 5, 7].includes(videoType) ? url : "",
      drmEnabled: drmEnabled,
    };

    // Only include image if it's available
    if (resURL?.episodeImageResURL) {
      objData.image = resURL.episodeImageResURL;
    }


    if (videoType == 8 && (resURL?.hlsFileName || existingHlsFileName)) {
      // Handle new upload (with uploadId) or existing file
      if (resURL?.hlsFileName) {
        objData.uploadId = resURL.hlsFileName;
        objData.hlsFileName = resURL.hlsFileName;
        objData.hlsFileExt = resURL?.hlsFileExt || "m3u8";
      } else if (existingHlsFileName) {
        objData.uploadId = existingHlsFileName;
        objData.hlsFileName = existingHlsFileName;
        objData.hlsFileExt = "m3u8";
      }
      objData.drmEnabled = drmEnabled; // Include DRM enabled flag
    }

    try {
      setLoading(true); // Set loading state
      await props.updateEpisode(objData, mongoId);
      setLoading(false); // Clear loading state
      localStorage.removeItem("updateEpisodeData");
      history.push("/admin/episode");
    } catch (error) {
      setLoading(false); // Clear loading state on error
      console.error("Error updating episode:", error);
      // Error is already handled in the action with Toast
    }
  };

  // Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateEpisodeData");
    history.replace("/admin/episode");
  };

  const handleImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setImage(file);
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      image: 1,
    });
    setResURL({ ...resURL, episodeImageResURL: resDataUrl });
    setImagePath(imageURL);
  };

  const handleHlsSuccess = (hlsData) => {
    setResURL((prev) => ({
      ...prev,
      ...hlsData,
    }));
    if (hlsData.hlsFileName) {
      setExistingHlsFileName(hlsData.hlsFileName);
      setUpdateType(1);
      setConvertUpdateType((prev) => ({
        ...prev,
        videoUrl: 1,
      }));
    }
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
            <div class="row">
              <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
                  <h4 class="ml-3">Episode</h4>
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
                            <Input
                              label="Episode No."
                              type="number"
                              min="1"
                              placeholder="1"
                              required
                              value={episodeNumber}
                              error={error.episodeNumber}
                              onChange={(e) => handleInputChange(e, setEpisodeNumber, "episodeNumber")}
                            />
                            <Input
                              label="Name"
                              type="text"
                              placeholder="Name"
                              required
                              value={name}
                              error={error.name}
                              onChange={(e) => handleInputChange(e, setName, "name")}
                            />
                          </div>

                          <div className="row">
                            <Select
                              label="Season"
                              placeholder="Select Season"
                              value={seasonNumber}
                              error={error.seasonNumber}
                              options={seasonData.map((data) => ({
                                value: data?._id,
                                label: data?.seasonNumber,
                              }))}
                              onChange={(e) => handleInputChange(e, setSeasonNumber, "seasonNumber")}
                            />
                            <ImageVideoFileUpload
                              label="Image (Optional)"
                              imagePath={imagePath}
                              error={error.image}
                              folderStructure={projectName + "episodeImage"}
                              onUploadSuccess={handleImageSuccess}
                            />
                          </div>
                          <div className="row">
                            <Select
                              label="Video Type"
                              placeholder="Select Video Type"
                              value={videoType}
                              error={error.videoType}
                              options={videoTypeOptions}
                              onChange={(e) => handleInputChange(e, setVideoType, "videoType")}
                            />
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Video URL
                                <span style={{ fontSize: "14px", marginLeft: "10px" }}>
                                  {drmEnabled ? "(DRM Protected)" : ""}
                                </span>
                              </label>
                              <div>
                                {[0, 1, 2, 3, 4, 5, 7].includes(videoType) && (
                                  <Input
                                    label=""
                                    type="text"
                                    placeholder="Link"
                                    className="my-2"
                                    value={url}
                                    error={error.url}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                  />
                                )}

                                {videoType == 8 && (
                                  <VideoUploadHLS
                                    existingHlsFileName={existingHlsFileName}
                                    onUploadSuccess={handleHlsSuccess}
                                    error={error.url}
                                    drmEnabled={drmEnabled}
                                    setDrmEnabled={setDrmEnabled}
                                    setLoadingState={setLoading}
                                    loading={loading}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="row"></div>
                        </div>

                        <DialogActions>
                          {dialogData ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={updateSubmit}
                              disabled={loading === true ? true : false}
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleSubmit}
                              disabled={loading === true ? true : false}
                            >
                              Insert
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-primary dark_btn"
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
      </div>

    </>
  );
};

export default connect(null, {
  insertEpisode,
  updateEpisode,
  getSeason,
  // getMovie,
  getMovieCategory,
})(EpisodeForm);
