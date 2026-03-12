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
import { CLOSE_CITY_DIALOG } from "../../store/City/city.type";
import { insertCity, updateCity } from "../../store/City/city.action";
import { capitalizeEachWord } from "../../util/helperFunctions";
import { getRegion } from "../../store/Region/region.action";

const CityDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.city);
  const allCountriesList = useSelector((state) => state.region.region);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [region, setCountry] = useState('');
  const [cityId, setCityId] = useState("");
  const [error, setError] = useState({
    name: "",
    region: ""
  });

  //Empty Data After Insert
  useEffect(() => {
    setError({
      name: "",
      region: "",
    });
    setName("");
    setCountry("");
    setCityId("");

    if (allCountriesList && allCountriesList.length === 0)
      dispatch(getRegion());
  }, [open]);

  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name);
      setCountry(dialogData.region?._id);
      setCityId(dialogData._id);
    }
  }, [dialogData]);

  const handleCountryChange = (e) => {
    const region = e.target.value;
    setCountry(region);
  };

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_CITY_DIALOG });
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

    if (!cityId) {
      const error = {};
      if (!name)
        error.name = "Name is Required!";
      if (!region)
        error.region = "Country is Required!";

      if (!name || !region)
        return setError({ ...error });

    } else {
      const error = {};
      if (!name)
        error.name = "Name is Required!";
      if (!region)
        error.region = "Country is Required!";
      if (!name || !region)
        return setError({ ...error });
    }
    dispatch({ type: CLOSE_CITY_DIALOG });


    const regionData = {
      name,
      region
    };

    if (cityId) {
      props.updateCity(cityId, regionData);
    } else {
      props.insertCity(regionData);
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
        {dialogData ? <h5>Edit City</h5> : <h5>Add City</h5>}
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
                      Country
                    </label>

                    <select
                      name="region"
                      className="form-control form-control-line selector"
                      id="region"
                      value={region}
                      onChange={handleCountryChange}
                    >
                      <option value="select_region">Select Country</option>
                      {allCountriesList?.map((region) => (
                        <option key={region._id} value={region._id}>
                          {capitalizeEachWord(region.name)}
                        </option>
                      ))}
                    </select>
                    {error.region && (
                      <div className="pl-1 text-left">
                        {error.region && (
                          <span className="error">{error.region}</span>
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

export default connect(null, { insertCity, updateCity, getRegion })(CityDialog);
