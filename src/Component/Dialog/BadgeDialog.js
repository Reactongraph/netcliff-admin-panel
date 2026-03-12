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
import { insertBadge, updateBadge } from "../../store/Badge/badge.action";
import { CLOSE_DIALOG } from "../../store/Badge/badge.type";

const BadgeDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.badge);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("custom");
  const [placement, setPlacement] = useState("top-left");
  const [style, setStyle] = useState("square");
  const [priority, setPriority] = useState(0);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [badgeId, setBadgeId] = useState("");

  const [error, setError] = useState({
    name: "",
  });

  //Insert and update Data Functionality
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      const error = {};
      if (!name) error.name = "Name is Required!";

      return setError({ ...error });
    } else {
      let data = {
        name: name,
        category: category,
        placement: placement,
        style: style,
        priority: Number(priority) || 0,
        bgColor: bgColor,
        textColor: textColor,
      };

      dispatch({ type: CLOSE_DIALOG });
      
      if (badgeId) {
        props.updateBadge(badgeId, data);
      } else {
        props.insertBadge(data);
      }
    }
  };

  useEffect(() => {
    setName("");
    setCategory("custom");
    setPlacement("top-left");
    setStyle("square");
    setPriority(0);
    setBgColor("");
    setTextColor("");
    setBadgeId("");
    setError({
      name: "",
    });
  }, [open]);

  //Set Data Value
  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name);
      setCategory(dialogData.category || "custom");
      setPlacement(dialogData.placement || "top-left");
      setStyle(dialogData.style || "square");
      setPriority(dialogData.priority || 0);
      setBgColor(dialogData.bgColor || "");
      setTextColor(dialogData.textColor || "");
      setBadgeId(dialogData._id);
    }
  }, [dialogData]);

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DIALOG });
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
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Badge</h5> : <h5>Add Badge</h5>}
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
              <div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control form-control-line text-capitalize"
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
                          {error.name && (
                            <span className="error">{error.name}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Category
                      </label>
                      <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="trending">Trending Now</option>
                        <option value="editors-choice">Editor's Choice</option>
                        <option value="views-based">Views Based</option>
                        <option value="published-based">Published Based</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Placement
                      </label>
                      <select
                        className="form-control"
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value)}
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>

                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Style
                      </label>
                      <select
                        className="form-control"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                      </select>
                    </div>

                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Priority
                      </label>
                      <input
                        type="number"
                        placeholder="Priority"
                        className="form-control"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      />
                    </div>

                    <div className="col-md-12 my-2">
                      <label className="styleForTitle">
                        Background Color
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="color"
                          className="form-control form-control-color mr-2"
                          value={bgColor ? `#${bgColor}` : "#000000"}
                          onChange={(e) => setBgColor(e.target.value.substring(1))}
                          style={{ width: "50px", padding: "0" }}
                        />
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">#</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Color Hex"
                            className="form-control"
                            value={bgColor}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                setBgColor(val);
                            }}
                            maxLength={8}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 my-2">
                      <label className="styleForTitle">
                        Text Color
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="color"
                          className="form-control form-control-color mr-2"
                          value={textColor ? `#${textColor}` : "#000000"}
                          onChange={(e) => setTextColor(e.target.value.substring(1))}
                          style={{ width: "50px", padding: "0" }}
                        />
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">#</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Color Hex"
                            className="form-control"
                            value={textColor}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                setTextColor(val);
                            }}
                            maxLength={8}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { insertBadge, updateBadge })(BadgeDialog);
