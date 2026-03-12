import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_LIVE_TV_DIALOGUE } from "../../store/LiveTv/liveTv.type";
import {
  getCountry,
  createManualLiveChannel,
  updateLiveTvChannel,
} from "../../store/LiveTv/liveTv.action";
//Alert

import Select from "react-select";
import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";

const LiveTvEditDialogue = (props) => {
  const {
    dialogue: open,
    dialogueData,
    country,
  } = useSelector((state) => state.liveTv);
  const dispatch = useDispatch();

  const [country_, setCountry] = useState({
    value: "",
    label: "",
  });
  const [channelName, setChannelName] = useState("");
  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [streamURL, setStreamURL] = useState("");
  const [error, setError] = useState("");
  const [resURL, setResURL] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(
    () => () => {
      setCountry("");
      setChannelName("");
      setImagePath("");
      setStreamURL("");
      setError({ channelName: "", image: "", country: "", setStreamURL: "" });
    },
    [open]
  );
  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);

  useEffect(() => {
    if (dialogueData?.channelId == null) {
      setImagePath(dialogueData?.channelLogo);
      setStreamURL(dialogueData?.streamURL);
      setCountry(dialogueData?.country);
      setChannelName(dialogueData?.channelName);
      setCountry({
        value: dialogueData?.country,
        label: dialogueData?.country,
      });
    } else {
      setStreamURL(dialogueData?.streamURL);
      setCountry(dialogueData?.country);
      setChannelName(dialogueData?.channelName);
      setImagePath(dialogueData?.channelLogo);
      setCountry({
        value: dialogueData?.country,
        label: dialogueData?.country,
      });
    }
  }, [dialogueData]);

  const options = country?.map((countryData) => {
    return {
      value: countryData.countryName,
      label: countryData.countryName,
    };
  });

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected ? "#112935" : "#354a5c",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#112935"
              : "#354a5c"
            : undefined,
          height: "3px", // Set the height for active option
        },
        placeholder: (styles) => ({
          ...styles,
          color: "#fdfdfd",
        }),
      };
    },
  };

  const handleClose = () => {
    dispatch({ type: CLOSE_LIVE_TV_DIALOGUE });
  };

  //  Image Load fffff

  let folderStructureMovieImage = projectName + "liveTvImage";
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResURL(resDataUrl);
    setImagePath(imageURL);
  };

  const handleSubmit = () => {
    if (selectedOption?.value) {
      setCountry(selectedOption?.value);
    }

    if (!channelName || !streamURL || !imagePath) {
      let error = {};
      if (country_ === "SelectCountry" || !country_)
        error.country_ = "Country Is Required !";
      if (!streamURL) error.streamURL = "Stream URL Is Required !";
      if (!channelName) error.channelName = "Channel Name Is Required !";
      if (!imagePath) error.image = "Image is Required !";
      return setError({ ...error });
    } else {
      const countries = country_?.value;
      const objData = {
        channelLogo: resURL,
        country: countries,
        channelName,
        streamURL,
      };

      if (dialogueData) {
        if (resURL) {
          const objData = {
            channelLogo: resURL,
            country: countries,
            channelName,
            streamURL,
          };
          props.updateLiveTvChannel(dialogueData?._id, objData);
        } else {
          const objData = {
            country: countries,
            channelName,
            streamURL,
          };
          props.updateLiveTvChannel(dialogueData?._id, objData);
        }
      } else {
        const objData = {
          channelLogo: resURL,
          country: countries,
          channelName,
          streamURL,
        };
        props.createManualLiveChannel(objData);
      }
      handleClose();
    }
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
        {dialogueData ? (
          <DialogTitle id="responsive-dialog-title">Update LiveTv</DialogTitle>
        ) : (
          <DialogTitle id="responsive-dialog-title">Create LiveTv</DialogTitle>
        )}

        <Tooltip title="Close">
          <CancelIcon
            className="cancelButton"
            sx={{
              position: "absolute",
              top: "23px",
              right: "15px",
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
                      <label className="float-left styleForTitle">
                        Channel Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={channelName}
                        onChange={(e) => {
                          setChannelName(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              channelName: "Name is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              channelName: "",
                            });
                          }
                        }}
                      />
                      {error.channelName && (
                        <div className="pl-1 text-left">
                          {error.channelName && (
                            <span className="error">{error.channelName}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Stream URl
                      </label>
                      <input
                        type="text"
                        placeholder="streamUrl"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={streamURL}
                        onChange={(e) => {
                          setStreamURL(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              streamURL: "stream URL is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              streamURL: "",
                            });
                          }
                        }}
                      />
                      {error.streamURL && (
                        <div className="pl-1 text-left">
                          {error.streamURL && (
                            <span className="error">{error.streamURL}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Country
                      </label>
                    </div>

                    <Select
                      value={country_}
                      placeholder="Select Country"
                      defaultValue={country}
                      onChange={setCountry}
                      options={options}
                      styles={colourStyles}
                    />
                    {error.country_ && (
                      <div className="pl-1 text-left">
                        {error.country_ && (
                          <span className="error">{error.country_}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <label className="float-left styleForTitle mb-0 ml-3">
                      Image
                    </label>
                    <div className="col-md-12 my-2">
                      <input
                        type="file"
                        id="customFile"
                        className="form-control"
                        accept="image/png, image/jpeg ,image/jpg"
                        required=""
                        onChange={imageLoad}
                      />

                      {/* {imagePath && ( */}
                      {imagePath && (
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
                      )}
                      <div
                        className="img-container"
                        style={{
                          display: "inline",
                          position: "relative",
                          float: "left",
                        }}
                      ></div>
                      <div className="pl-1 text-left">
                        {error.image && (
                          <span className="error">{error.image}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className="dia_border w-100 mt-0"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogueData ? (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
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
              Submit
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, {
  getCountry,
  updateLiveTvChannel,
  createManualLiveChannel,
})(LiveTvEditDialogue);
