import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_SEASON_DIALOG } from "../../store/Season/season.type";
import { updateSeason, CreateSeason } from "../../store/Season/season.action";
import { getMovieCategory } from "../../store/Movie/movie.action";
import placeholderImage from "../assets/images/defaultUserPicture.jpg";
//Alert

import { projectName } from "../../util/config";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import Input from "../molecules/Input";

const SeasonDialogue = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.season);

  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData"));

  const [name, setName] = useState("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [episodeCount, setEpisodeCount] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [convertUpdateType, setConvertUpdateType] = useState({
    image: "",
    link: "",
  });
  const [movie, setMovie] = useState("");
  const [resUrl, setResUrl] = useState("");

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch({ type: CLOSE_SEASON_DIALOG });
  };

  const handleInputChange = (e, setter, fieldName) => {
    let value = e.target.value;
    if (fieldName === "name") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (fieldName === "seasonNumber" || fieldName === "episodeCount") {
      value = value === "" ? "" : parseInt(value);
    }
    setter(value);
    if (value === "" || value === undefined) {
      setError((prev) => ({ ...prev, [fieldName]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is Required!` }));
    } else {
      setError((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  //useEffect for getmovie
  useEffect(() => {
    dispatch(getMovieCategory());
  }, [dispatch]);

  useEffect(
    () => () => {
      setName("");
      setEpisodeCount("");
      setReleaseDate("");
      setImagePath("");
      setSeasonNumber("");
      setMovie("");
      setError({
        name: "",
        seasonNumber: "",
      });
    },
    [open]
  );
  useEffect(() => {
    setImagePath(
      dialogData?.image === "https://www.themoviedb.org/t/p/originalnull"
        ? placeholderImage
        : dialogData?.image
    );

    setName(dialogData?.name || "");
    setEpisodeCount(dialogData?.episodeCount || "");
    setReleaseDate(dialogData?.releaseDate || "");
    setSeasonNumber(dialogData?.seasonNumber || "");
    setMovie(dialogData?.movie?._id);
    setConvertUpdateType({
      image: dialogData?.convertUpdateType?.image
        ? dialogData?.convertUpdateType?.image
        : "",
      link: dialogData?.convertUpdateType?.link
        ? dialogData?.convertUpdateType?.link
        : "",
    });
  }, [dialogData]);

  const submitUpdate = async () => {
    if (
      !name ||
      !seasonNumber ||
      seasonNumber < 0
    ) {
      const error = {};
      if (!name) error.name = "Name IS Required !";
      if (!seasonNumber) error.seasonNumber = "season Number Is Required !";
      if (seasonNumber < 0) error.seasonNumber = "season Number  Is Invalid  !";
      return setError({ ...error });
    } else {
      // Prepare data with proper handling of optional fields
      let objData = {
        name,
        seasonNumber,
        episodeCount: episodeCount || "",
        releaseDate: releaseDate || "",
        movieId: tmdbId?._id,
      };

      // Only include image if it's uploaded
      if (resUrl) {
        objData.image = resUrl;
      }

      // Only include update fields if editing
      if (dialogData) {
        objData.updateType = updateType;
        objData.convertUpdateType = convertUpdateType;
      }

      try {
        if (dialogData) {
          await props.updateSeason(objData, dialogData._id);
        } else {
          await props.CreateSeason(objData);
        }
        handleClose();
      } catch (error) {
        console.error("Error creating/updating season:", error);
        // Error is already handled in the action with Toast
      }
    }
  };
  const handleImageSuccess = ({ resDataUrl, imageURL }) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      image: 1,
    });
    setResUrl(resDataUrl);
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
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Season</h5> : <h5>Add Season</h5>}
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
                    <Input
                      label="Name"
                      type="text"
                      placeholder="Name"
                      className="col-md-12 my-2"
                      required
                      value={name}
                      error={error.name}
                      onChange={(e) => handleInputChange(e, setName, "name")}
                    />
                  </div>

                  <div className="row">
                    <Input
                      label="Season Number"
                      type="number"
                      min="0"
                      placeholder="02"
                      className="col-md-12 my-2"
                      required
                      value={seasonNumber}
                      error={error.seasonNumber}
                      onChange={(e) => handleInputChange(e, setSeasonNumber, "seasonNumber")}
                    />
                  </div>
                  <div className="row">
                    <Input
                      label="Episode Count"
                      type="number"
                      min="0"
                      placeholder="10"
                      className="col-md-12 my-2"
                      required
                      value={episodeCount}
                      error={error.episodeCount}
                      onChange={(e) => handleInputChange(e, setEpisodeCount, "episodeCount")}
                    />
                  </div>
                  <div className="row">
                    <Input
                      label="Release Date"
                      type="date"
                      placeholder="YYYY-MM-DD"
                      className="col-md-12 my-2"
                      required
                      value={releaseDate}
                      error={error.releaseDate}
                      onChange={(e) => handleInputChange(e, setReleaseDate, "releaseDate")}
                    />
                  </div>


                  <div className="row">
                    <ImageVideoFileUpload
                      label="Image"
                      imagePath={imagePath}
                      error={error.image}
                      fallbackImage={placeholderImage}
                      folderStructure={projectName + "seasonImage"}
                      onUploadSuccess={handleImageSuccess}
                      className="col-md-12 my-2"
                    />
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
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitUpdate}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitUpdate}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default connect(null, { CreateSeason, updateSeason, getMovieCategory })(
  SeasonDialogue
);
