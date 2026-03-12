import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DeleteIcon from "@mui/icons-material/Delete";
import BarChartIcon from '@mui/icons-material/BarChart';

import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

import {
  CLOSE_LIVE_TV_ACTION_DIALOGUE,
  OPEN_LIVE_TV_ACTION_DIALOGUE,
  OPEN_LIVE_TV_INFO_DIALOGUE,
} from "../../store/LiveTv/liveTv.type";

import { warning } from "../../util/Alert";
import Swal from "sweetalert2";
import {
  deleteLiveChannel,
  updateSingleLiveTv,
} from "../../store/LiveTv/liveTv.action";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast_";

const LiveTvActionsDialog = (props) => {
  const history = useHistory();

  const { actionDialogue: open, actionDialogueData: dialogData } = useSelector(
    (state) => state.liveTv
  );

  const dispatch = useDispatch();

  // Handle Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_LIVE_TV_ACTION_DIALOGUE });
  };

  // Action Handlers
  const handleChannelInfo = () => {
    dispatch({ type: OPEN_LIVE_TV_INFO_DIALOGUE });
    handleClose();
  };

  const handleUpdateChannel = () => {
    localStorage.setItem("updateChannelData", JSON.stringify(dialogData));
    history.push("/admin/live_tv/customLiveTv?mode=update");

    handleClose();
  };

  const handleStartLive = async () => {
    const _id = dialogData?._id;
    const currentState = dialogData?.awsChannelState;
    const awsChannelState = currentState === "start" ? "stop" : "start";

    await apiInstanceFetch.patch("stream/updateChannelStatus", {
      _id,
      action: awsChannelState,
    });
    dispatch(updateSingleLiveTv(dialogData?._id, { awsChannelState }));
    dispatch({
      type: OPEN_LIVE_TV_ACTION_DIALOGUE,
      payload: { ...dialogData, awsChannelState },
    });
    handleClose();
    Toast(
      "success",
      `Channel ${dialogData?.awsChannelState === "start" ? "stopped" : "started"
      } successfully`
    );
  };

  const handleReports = () => {
    // props.getChannelReports(dialogData._id);
    handleClose();
  };

  const handleAnalytics = () => {
    history.push(`/admin/analytics?channelId=${dialogData?._id}`);
    handleClose();
  };

  // const handleDelete = () => {
  //     if (window.confirm("Are you sure you want to delete this channel?")) {
  //         //   props.deleteChannel(dialogData._id);
  //         handleClose();
  //     }
  // };

  const handleDelete = () => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteLiveChannel(dialogData._id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          handleClose();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="channel-actions-dialog"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth={"xs"}
      >
        <DialogTitle className="custom_modal_title" id="channel-actions-dialog">
          <h5>Actions</h5>
        </DialogTitle>

        <Tooltip title="Close" className="modal_close_icon">
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

        <DialogContent className="modal_body" sx={{ pt: 0 }}>
          <List>
            <ListItem button onClick={handleChannelInfo}>
              <ListItemIcon className="modal_icon">
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Channel Info" />
            </ListItem>

            <ListItem button onClick={handleUpdateChannel}>
              <ListItemIcon className="modal_icon">
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Update Channel" />
            </ListItem>

            {/* <ListItem button onClick={handlePreview}>
                            <ListItemIcon>
                                <PreviewIcon sx={{ color: "#fff" }} />
                            </ListItemIcon>
                            <ListItemText primary="Preview" />
                        </ListItem> */}

            {
              dialogData?.streamType === 'INTERNAL' && dialogData?.awsChannelId  ?
                < ListItem button onClick={handleStartLive}>
                  <ListItemIcon className="modal_icon">
                    <PlayArrowIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      dialogData?.awsChannelState === "start"
                        ? "Stop Live Channel"
                        : "Start Live Channel"
                    }
                  />
                </ListItem> : <></>
            }


            {/* <ListItem button onClick={handleReports}>
              <ListItemIcon>
                <AssessmentIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem> */}

            <ListItem button onClick={handleAnalytics}>
              <ListItemIcon className="modal_icon">
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="View Analytics" />
            </ListItem>

            <ListItem button onClick={handleDelete}>
              <ListItemIcon className="modal_icon">
                <DeleteIcon sx={{ color: "#ff4444" }} />
              </ListItemIcon>
              <ListItemText primary="Delete" sx={{ color: "#ff4444" }} />
            </ListItem>
          </List>
        </DialogContent>

        <DialogActions className="modal_footer">
          <button type="button" className="defualt_btn" onClick={handleClose}>
            Close
          </button>
        </DialogActions>
      </Dialog >
    </>
  );
};

const mapDispatchToProps = {
  deleteLiveChannel,
};

export default connect(null, mapDispatchToProps)(LiveTvActionsDialog);
