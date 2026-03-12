import React, { useState, useRef, useEffect, useMemo } from "react";

//react-router-dom
import { useHistory, useLocation } from "react-router-dom";

//material-ui
import { DialogActions, Typography } from "@mui/material";

//editor
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

//react-redux
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { getRegion } from "../../store/ContinentRegion/continentRegion.action";
//Alert

import { SuccessAlert } from "../../util/Alert";
import Multiselect from "multiselect-react-dropdown";
import { createTvChannel, getStreamChannelsForSelect, updateTvChannel } from "../../store/TvChannel/tvChannel.action";

const TvChannelForm = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  const editor = useRef(null);

  const history = useHistory();
  const dispatch = useDispatch();


  const existingUpdateData = JSON.parse(
    localStorage.getItem("updateTvChannelData")
  );

  const streamChannelsForSelect = useSelector((state) => state.tvChannel.streamChannelsForSelect);

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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");

  const selectedChannels = useMemo(() =>
    streamChannelsForSelect.filter(channel =>
      channels.includes(channel._id)
    ),
    [channels, streamChannelsForSelect]
  );

  useEffect(() => {
    if (mode === "update" && existingUpdateData) {
      setName(existingUpdateData?.name || "");
      setDescription(existingUpdateData?.description || "");
      if (Array.isArray(existingUpdateData?.channels)) {
        setChannels(existingUpdateData?.channels?.map((data) => data._id));
      }
    }
    setError({});

    return () => {
      localStorage.removeItem("updateTvChannelData");
    };
  }, []);

  useEffect(() => {
    dispatch(getStreamChannelsForSelect());
    dispatch(getRegion());
  }, [dispatch]);

  const handleClose = () => {
    localStorage.removeItem("createChannelData");
    localStorage.removeItem("updateChannelData");
    if (mode === "update") {
      history.goBack();
    } else {
      history.push("/admin/tv_channels");
    }
  };


  function onSelectStreamChannel(selectedList, selectedItem) {
    setChannels(selectedList.map(item => item._id));
  }

  function onRemoveStreamChannel(selectedList, removedItem) {
    setChannels(selectedList.map(item => item._id));
  }

  const handleSubmit = async () => {

    if (
      !name ||
      !description
    ) {
      let error = {};

      if (!name) error.name = "Channel Name Is Required !";
      if (!description) error.description = "Description is Required !";


      return setError({ ...error });
    } else {
      if (mode === "update") {
        const objData = {
          name,
          description,
          channels,
        };

        const res = await props.updateTvChannel(existingUpdateData?._id, objData);
        const { status, channel } = res ?? {};
        if (status === true)
          localStorage.setItem("updateTvChannelData", JSON.stringify(channel));

      } else {
        const objData = {
          name,
          description,
          channels
        };

        const res = await props.createTvChannel(objData);
        const { status, stream } = res ?? {};
        if (status === true) {
          setTimeout(() => {
            let message = "Tv Channel has been created!";

            SuccessAlert(message).then((result) => {
              if (result.isConfirmed) {
                history.push("/admin/tv_channels");
              }
            });
          }, 500);
        }
      }
    }
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="header_heading p_zero">
                <div className="d-flex align-items-center">
                  <div onClick={handleClose} style={{ cursor: 'pointer' }}>
                    <i class="fa-solid fa-angles-left  p-2" />
                  </div>
                  {mode === "update" ?
                    <h3>{existingUpdateData?.name}</h3>
                    : (
                      <h3>Insert TV Channel</h3>)
                  }
                </div>
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <div className="row my-4">
                    <div className="col-md-6 iq-item-product-left">
                      <div className="iq-image-container">
                        <div className="iq-product-cover">
                          <div class="custom_field_col wdt100">
                            <label>TV Channel Name</label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              className="form-control form-control-line"
                              Required
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);

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

                          <div class="custom_field_col wdt100">
                            <label htmlFor="description">Description</label>

                            <SunEditor
                              value={description}
                              setContents={description}
                              ref={editor}
                              height={180}
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

                    {/* Right side content */}
                    <div className="col-md-6 iq-item-product-right">
                      <div className="product-additional-details">

                        <div className="mb-4 ">
                          <label className=" styleForTitle movieForm">
                            Channels
                          </label>
                          <Multiselect
                            options={streamChannelsForSelect} // Options to display in the dropdown
                            selectedValues={selectedChannels} // Preselected value to persist in dropdown
                            onSelect={onSelectStreamChannel} // Function will trigger on select event
                            onRemove={onRemoveStreamChannel} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            id="css_custom"
                            style={{
                              chips: {
                                // background: "rgba(145, 111, 203, 0.69)",
                              },
                              multiselectContainer: {
                                color: "rgba(174, 159, 199, 1)",
                              },
                              searchBox: {
                                border: "none",
                                "border-bottom": "1px solid blue",
                                "border-radius": "0px",
                              },
                            }}
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  <DialogActions className="button_wrapper">
                    {mode === "update" ? (
                      <button
                        type="button"
                        className="defualt_btn whte_btn"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="defualt_btn whte_btn"
                        onClick={handleSubmit}
                      >
                        Insert
                      </button>
                    )}
                    <button
                      type="button"
                      className="defualt_btn "
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
    </>
  );
};

export default connect(null, {
  getRegion,
  createTvChannel,
  updateTvChannel,
  getStreamChannelsForSelect,
})(TvChannelForm);
