import React from "react";
import { connect } from "react-redux";
import { size, toArray } from "lodash";
import UploadItem from "./UploadItem";
import { useEffect } from "react";
import "./upload.css";
import { uploadFile } from "../store/Movie/movie.action";
const UploadProgress = (props) => {
  // console.log("props", props);
  const { fileProgress, data, movieId, update } = props;
  const uploadedFileAmount = size(fileProgress);

  // console.log("fileProgress---", fileProgress);

  useEffect(() => {
    const fileToUpload = toArray(fileProgress).filter(
      (file) => file.progress === 0
    );

    // props.uploadFile(fileToUpload, data, movieId, update);
  }, [uploadedFileAmount, data, movieId, update]);

  return uploadedFileAmount > 0 ? (
    <div>
      {/* <div className="wrapper-1"> */}
      {/* <h4>Uploading File</h4> */}
      {size(fileProgress)
        ? toArray(fileProgress).map((file) => (
            <UploadItem key={file.id} file={file} />
          ))
        : null}
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  fileProgress: state.movie.fileProgress,
});

// const mapStateToProps = (state) =>
//   console.log("state----------------------", state);

const mapDispatchToProps = (dispatch) => ({
  uploadFile: (files, data, movieId, update) =>
    dispatch(uploadFile(files, data, movieId, update)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress);
