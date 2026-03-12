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
import { insertRegion, updateRegion } from "../../store/Region/region.action";
import { CLOSE_DIALOG } from "../../store/Genre/genre.type";
import { capitalizeEachWord } from "../../util/helperFunctions";
import { getRegion } from "../../store/ContinentRegion/continentRegion.action";

//Alert


const RegionDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.region);
  const continents = useSelector((state) => state.continentRegion.region);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [continent, setContinent] = useState("");
  const [error, setError] = useState({
    name: "",
    continent: ""
  });

  //Empty Data After Insert
  useEffect(() => {
    setError({
      name: "",
    });
    setName("");
    setRegionId("");
    setContinent('')
  }, [open]);

  useEffect(() => {
    if (open && Array.isArray(continents) && continents.length === 0)
      dispatch(getRegion());

  }, [])

  //Set Data Value
  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name);
      setRegionId(dialogData._id);
      setContinent(dialogData.continent?._id)
    }
  }, [dialogData]);

  const handleContinentChange = (e) => {
    const continent = e.target.value;
    setContinent(continent);
  };
  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DIALOG });
  };

  const handleKeyPress = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  //Insert and update Data Functionality
  const handleSubmit = (e) => {

    e.preventDefault();

    if (!regionId) {
      const error = {};
      if (!name)
        error.name = "Name is Required!";
      if (!continent)
        error.continent = "Continent is Required!";

      if (!name || !continent)
        return setError({ ...error });
    } else {
      const error = {};
      if (!name)
        error.name = "Name is Required!";
      if (!continent)
        error.continent = "Continent is Required!";
      if (!name || !continent)
        return setError({ ...error });
    }
    dispatch({ type: CLOSE_DIALOG });

    const regionData = {
      name,
      continent
    };

    if (regionId) {
      props.updateRegion(regionId, regionData);
    } else {
      props.insertRegion(regionData);
    }
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
      <DialogTitle id="responsive-dialog-title">
        {dialogData ? <h5>Edit Country</h5> : <h5>Add Country</h5>}
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
            <form>
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
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
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
                      Continent
                    </label>

                    <select
                      name="region"
                      className="form-control form-control-line selector"
                      id="region"
                      value={continent}
                      onChange={handleContinentChange}
                    >
                      <option value="select_region">Select Continent</option>
                      {continents?.map((continent) => (
                        <option key={continent._id} value={continent._id}>
                          {capitalizeEachWord(continent.name)}
                        </option>
                      ))}
                    </select>
                    {error.continent && (
                      <div className="pl-1 text-left">
                        {error.continent && (
                          <span className="error">{error.continent}</span>
                        )}
                      </div>
                    )}
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
  );
};

export default connect(null, { insertRegion, updateRegion, getRegion })(RegionDialog);
