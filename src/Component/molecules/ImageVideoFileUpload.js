import React, { useRef } from "react";
import { Typography } from "@mui/material";
import { uploadFile } from "../../util/AwsFunction";
import { handleImageError } from "../../util/helperFunctions";
import { Toast } from "../../util/Toast_";
import noImage from "../assets/images/noImage.png";

const ImageVideoFileUpload = ({
    label,
    imagePath,
    error,
    folderStructure,
    onUploadSuccess,
    onUploadError,
    accept = "image/png, image/jpeg, image/jpg, image/webp, image/gif",
    required = false,
    className = "col-md-6 my-2",
    labelClassName = "float-left styleForTitle",
    imgStyle = {},
    variant = "simple", // or "advanced"
    fallbackImage = noImage
}) => {
    const fileInputRef = useRef();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type.startsWith("image/") && file.size > 5 * 1024 * 1024) {
            Toast("error", "Image size should be less than 5MB");
            return;
        }

        try {
            const { resDataUrl, imageURL } = await uploadFile(file, folderStructure);
            if (onUploadSuccess) {
                onUploadSuccess({ resDataUrl, imageURL, file });
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            if (onUploadError) {
                onUploadError(err);
            }
        }
    };

    const defaultImgStyle = {
        boxShadow: "rgba(105, 103, 103, 0) 0px 5px 15px 0px",
        border: "0.5px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        marginTop: "10px",
        float: "left",
        width: variant === "advanced" ? "300px" : "100px",
        height: variant === "advanced" ? "200px" : "100px",
        objectFit: "cover",
        cursor: "pointer",
        ...imgStyle
    };

    return (
        <div className={className}>
            {label && (
                <label className={labelClassName}>
                    {label} {required && "*"}
                </label>
            )}

            <div className="d-flex flex-column" style={{ clear: "both" }}>
                {variant === "advanced" ? (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="form-control"
                            accept={accept}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        {!imagePath ? (
                            <div
                                className="select_image"
                                style={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    height: "200px",
                                    border: "2px dashed #ddd",
                                    borderRadius: "8px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    cursor: "pointer",
                                    marginTop: "10px"
                                }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <i className="fas fa-plus" style={{ fontSize: "40px", color: "#4d848f", marginBottom: "10px" }} />
                                <p style={{ textAlign: "center", color: "#666", margin: 0 }}>Click to upload image</p>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="customFile"
                        className="form-control"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                )}

                {error && (
                    <div className="pl-1 text-left mt-1" style={{ clear: "both" }}>
                        <Typography
                            variant="caption"
                            style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                            }}
                        >
                            {error}
                        </Typography>
                    </div>
                )}

                {imagePath && (
                    <div className="mt-2 text-left" style={{ clear: "both" }}>
                        {imagePath.match(/\.(mp4|webm|ogg|mov)$|video/i) ? (
                            <video
                                src={imagePath}
                                style={defaultImgStyle}
                                onClick={variant === "advanced" ? () => fileInputRef.current.click() : undefined}
                                controls={false}
                                muted
                                autoPlay
                                loop
                            />
                        ) : (
                            <img
                                alt="preview"
                                src={imagePath}
                                style={defaultImgStyle}
                                onClick={variant === "advanced" ? () => fileInputRef.current.click() : undefined}
                                onError={(e) => handleImageError(e, fallbackImage)}
                            />
                        )}
                        {variant === "advanced" && (
                            <>
                                <div style={{ clear: "both" }}></div>
                                <small
                                    className="text-muted"
                                    style={{ cursor: "pointer", float: "left", marginTop: "5px" }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Click to change
                                </small>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageVideoFileUpload;
