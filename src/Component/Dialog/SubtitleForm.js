import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DialogActions, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { insertSubtitle } from "../../store/Subtitle/subtitle.action";
import { uploadFile } from "../../util/AwsFunction";
import { useSelector } from "react-redux";
import { getLanguages } from "../../store/Language/language.action";

const SubtitleForm = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { languages: reducerLanguages } = useSelector(
    (state) => state.language
  );
  const movieData = JSON.parse(localStorage.getItem("updateMovieData1"));
  const [language, setLanguage] = useState("");
  const [fileName, setFileName] = useState("");
  const [resURL, setResURL] = useState({
    file: "",
  });
  const [error, setError] = useState({
    language: "",
    file: "",
  });

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  const insertSubmit = () => {
    if (!language) {
      const error = {};
      if (!language) error.language = "Language is Required !";
      return setError({ ...error });
    } else {
      const objData = {
        language,
        movie: movieData._id,
        file: resURL.file,
      };

      props.insertSubtitle(objData);
      history.push("/admin/movie/subtitle");
    }
  };

  const fileLoad = async (event) => {
    const file = event.target.files[0];
    setFileName(file?.name);
    const { resDataUrl } = await uploadFile(
      event.target.files[0],
      "subtitles",
      `${Date.now()}${file?.name}`
    );

    setResURL({ ...resURL, file: resDataUrl });
  };

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateTrailerData");
    history.replace("/admin/movie/subtitle");
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
            <div class="row">
              <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
                  <h4 class="ml-3">Subtitle </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <div className="modal-body pt-1 px-1 pb-3">
                    <div className="d-flex flex-column">
                      <form>
                        <div className="form-group">
                          <div className="row">
                            <div class="col-md-6 my-2 styleForTitle">
                              <label>Language</label>

                              <select
                                name="type"
                                className="form-control form-control-line"
                                id="type"
                                style={{ textTransform: "capitalize" }}
                                value={language}
                                onChange={(e) => {
                                  setLanguage(e.target.value);

                                  if (e.target.value === "Select Language") {
                                    return setError({
                                      ...error,
                                      language: "Movie Language is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      language: "",
                                    });
                                  }
                                }}
                              >
                                <option value="Select Language">
                                  Select Language
                                </option>
                                {reducerLanguages.map((data, key) => {
                                  return (
                                    <>
                                      <option
                                        value={data._id}
                                        key={key}
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {data.name.toLowerCase()}
                                      </option>
                                    </>
                                  );
                                })}
                              </select>
                              {error.language && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.language}
                                  </Typography>
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 my-2">
                              <label className="float-left styleForTitle">
                                File
                              </label>
                              <input
                                type="file"
                                id="customFile"
                                className="form-control"
                                accept=".vtt, .srt"
                                Required=""
                                onChange={fileLoad}
                              />
                              <div>{fileName}</div>
                            </div>
                          </div>
                        </div>

                        <DialogActions>
                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3 py-1"
                            onClick={insertSubmit}
                          >
                            Insert
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm px-3 py-1"
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
  insertSubtitle,
})(SubtitleForm);
