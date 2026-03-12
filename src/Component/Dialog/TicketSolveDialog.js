import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { action } from "../../store/UserRestrictedTicket/restricted.action";
import { CLOSE_SOLVE_DIALOG } from "../../store/UserRestrictedTicket/restricted.type";

//Alert

const TicketSolveDialog = (props) => {
  const { dialog: open, dialogData } = useSelector(
    (state) => state.ticketByUser
  );

  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  useEffect(() => {
    setComment("");
  }, [open]);

  const handleClose = () => {
    dispatch({ type: CLOSE_SOLVE_DIALOG });
  };

  //Insert and update Data Functionality
  const handleSubmit = (e) => {
    e.preventDefault();
    props.action(dialogData._id, comment);
    dispatch({ type: CLOSE_SOLVE_DIALOG });
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="responsive-dialog-title"
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="responsive-dialog-title">Comment</DialogTitle>

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
            <form>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-12 my-2">
                    <label className="float-left styleForTitle">Comment</label>

                    <textarea
                      type="text"
                      rows={5}
                      placeholder="Enter your comment here"
                      className="form-control form-control-line text-capitalize"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />
                  </div>
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

        <button
          type="button"
          className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
          disabled={!comment}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default connect(null, { action })(TicketSolveDialog);
