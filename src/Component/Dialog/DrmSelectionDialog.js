import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";

//action
import { CLOSE_DRM_DIALOG } from "../../store/Episode/episode.type";

const DrmSelectionDialog = ({ onConfirm }) => {
  const { drmDialog: open, drmDialogData } = useSelector((state) => state.episode);
  const dispatch = useDispatch();

  const [drmEnabled, setDrmEnabled] = useState(false); // Default to false (No DRM)

  useEffect(() => {
    // Reset to default when dialog opens or set from existing data
    if (open) {
      if (drmDialogData && drmDialogData.drmEnabled !== undefined) {
        setDrmEnabled(drmDialogData.drmEnabled);
      } else {
        setDrmEnabled(false); // Default to No DRM
      }
    }
  }, [open, drmDialogData]);

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DRM_DIALOG });
  };

  //Handle Confirm and Proceed to File Selection
  const handleConfirm = () => {
    onConfirm(drmEnabled);
    dispatch({ type: CLOSE_DRM_DIALOG });
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
          <h5>Video Upload Configuration</h5>
        </DialogTitle>

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

        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <div className="form-group">
                <div className="row">
                  <div className="col-md-12 my-2 px-4">
                    <Typography variant="body1" className="mb-3">
                      Please configure your video upload settings before selecting a file:
                    </Typography>
                    
                    <label className=" styleForTitle">
                      DRM Protection
                    </label>
                    
                    <div className="mt-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="drmEnabled"
                          id="drmNo"
                          value="no"
                          checked={!drmEnabled}
                          onChange={() => setDrmEnabled(false)}
                        />
                        <label className="form-check-label" htmlFor="drmNo">
                          No (Standard) - Default
                        </label>
                      </div>
                      
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="drmEnabled"
                          id="drmYes"
                          value="yes"
                          checked={drmEnabled}
                          onChange={() => setDrmEnabled(true)}
                        />
                        <label className="form-check-label" htmlFor="drmYes">
                          Yes (DRM Protected)
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Typography variant="caption" style={{ color: "#ccc" }}>
                        {drmEnabled 
                          ? "DRM protection will be applied to secure your content from unauthorized access."
                          : "Standard upload without DRM protection. Content will be publicly accessible."
                        }
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        
        <div>
          <hr className="dia_border w-100 mt-0" />
        </div>
        
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
            onClick={handleConfirm}
          >
            Continue to File Selection
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DrmSelectionDialog; 