import React from "react";
import "./upload.css";

const UploadItem = (props) => {
  const { file, progress } = props.file;

  // console.log("progress", progress);

  return (
    // <div className="wrapperItem" style={{ display: progress === 0 && "none" }}>
    <div
      className="wrapper-1"
      style={{ display: progress === 100 ? "none" : progress === 0 && "none" }}
    >
      <h4>Uploading File</h4>
      <div className="wrapperItem">
        <div className="leftSide">
          <div className="progressBar">
            <div style={{ width: `${progress === 0 ? 100 : progress}%` }} />
          </div>
          <label>{file?.progress} </label>
        </div>
        <span className="percentage">{progress === 0 ? 100 : progress}%</span>
      </div>
    </div>
  );
};
export default UploadItem;
