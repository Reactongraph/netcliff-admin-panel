import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_LIVE_TV_INFO_DIALOGUE } from "../../store/LiveTv/liveTv.type";

const LiveTVInfoDialog = () => {
  const dispatch = useDispatch();
  const { infoDialogue: open, actionDialogueData: data } = useSelector(
    (state) => state.liveTv
  );

  const [copyStatus, setCopyStatus] = useState({
    streamURL: false,
    streamKey: false,
    publishURL: false,
  });
  const [expandedProgram, setExpandedProgram] = useState(null);

  // Handle Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_LIVE_TV_INFO_DIALOGUE });
  };

  // Copy to clipboard function
  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [field]: true });

      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [field]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const ProgramCard = ({ program, index, isLast }) => {
    const isExpanded = expandedProgram === program._id;

    return (
      <Box
        sx={{
          mb: isLast ? 0 : 1.5,
          backgroundColor: "#2a2a2a",
          borderRadius: "8px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        <Box
          onClick={() => setExpandedProgram(isExpanded ? null : program._id)}
          sx={{
            cursor: "pointer",
            padding: "12px",
          }}
        >
          {/* Time Badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#1a1a1a",
                borderRadius: "4px",
                padding: "4px 8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Typography
                sx={{ color: "#fff", fontSize: "0.875rem", fontWeight: 500 }}
              >
                {program.startTime} - {program.endTime}
              </Typography>
              <Box
                sx={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "#666",
                }}
              />
              <Typography sx={{ color: "#999", fontSize: "0.75rem" }}>
                {program.duration}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                color: "#fff",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          </Box>

          {/* Title and Preview */}
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              mb: 0.5,
            }}
          >
            {program.title}
          </Typography>
          <Typography
            sx={{
              color: "#999",
              fontSize: "0.875rem",
              display: "-webkit-box",
              WebkitLineClamp: isExpanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              whiteSpace: "pre-line",
            }}
          >
            {program.description}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="channel-actions-dialog"
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth={"xs"}
    >
      <DialogTitle className="custom_modal_title">
        <h5>Channel Information</h5>
        <Tooltip title="Close" className="modal_close_icon">
          <CancelIcon
            className="cancelButton"
            sx={{
              position: "absolute",
              top: "23px",
              right: "15px",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={handleClose}
          />
        </Tooltip>
      </DialogTitle>

      <DialogContent className="modal_body channel_info">
        <Box>
          {/* Channel Logo and Name Section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={data?.channelLogo}
              alt={data?.channelName}
              sx={{ width: 64, height: 64, mr: 2 }}
              variant="square"
              imgProps={{
                sx: {
                  objectFit: "contain",
                },
              }}
            />
            <Typography variant="h6">{data?.channelName || ""}</Typography>
          </Box>

          {
            data?.streamURL ?
              <InfoField
                label="Stream URL"
                value={data?.streamURL || ""}
                field="streamURL"
                copyEnabled={true}
                handleCopy={handleCopy}
                copyStatus={copyStatus}
              /> :
              <></>
          }


          {data?.streamType === "INTERNAL" && data?.streamKey && data?.streamPublishUrl ? (
            <>
              <InfoField
                label="Stream Key"
                value={data?.streamKey || ""}
                field="streamKey"
                copyEnabled={true}
                handleCopy={handleCopy}
                copyStatus={copyStatus}
              />

              <InfoField
                label="Stream Publish URL"
                value={data?.streamPublishUrl || ""}
                field="streamPublishUrl"
                copyEnabled={true}
                handleCopy={handleCopy}
                copyStatus={copyStatus}
              />
            </>
          ) : (
            <></>
          )}

          {/* Basic Channel Information */}
          <Box sx={{}}>
            {/* <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                            Basic Information
                        </Typography> */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(1, 1fr)",
              }}
            >
              {data?.country ? (
                <InfoField label="Country" value={data?.country || "-"} />
              ) : (
                <></>
              )}
              {data?.category ? (
                <InfoField label="Category" value={data?.category?.name || "-"} />
              ) : (
                <></>
              )}
              {data?.language ? (
                <InfoField label="Language" value={data?.language?.name || "-"} />
              ) : (
                <></>
              )}
            </Box>
          </Box>

          {/* Description */}
          {data?.description ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#999", mb: 0.5 }}>
                Description
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  padding: "8px",
                  borderRadius: "0px",
                  border: "1px solid #E6EAED",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: data?.description || "-" }}
                  style={{ color: "#fff" }}
                />
              </Box>
            </Box>
          ) : (
            <></>
          )}

          {/* Programs List Section */}
          {/* {Array.isArray(data?.programs) && data.programs.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: "#999", mb: 1.5 }}>
                                Programs Schedule
                            </Typography>
                            <Box sx={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                pr: 1,
                                mr: -1,
                            }}>
                                {data.programs
                                    .sort((a, b) => {
                                        const timeA = a.startTime.split(':').map(Number);
                                        const timeB = b.startTime.split(':').map(Number);
                                        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
                                    })
                                    .map((program, index) => (
                                        <ProgramCard
                                            key={program._id}
                                            program={program}
                                            index={index}
                                            isLast={index === data.programs.length - 1}
                                        />
                                    ))}
                            </Box>
                        </Box>
                    )} */}
        </Box>
      </DialogContent>

      <DialogActions className="modal_footer">
        <button type="button" className="defualt_btn" onClick={handleClose}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

// Info Field Component
export const InfoField = ({
  label,
  value,
  field,
  copyStatus = {},
  handleCopy,
  copyEnabled = false,
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="subtitle2"
      sx={{ color: "#000", fontSize: "16px", fontWeight: 400, mb: 0.5 }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #E6EAED",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          wordBreak: "break-all",
          fontSize: "16px",
          fontWeight: 400,
          padding: "10px",
          color: "#000",
        }}
      >
        {value}
      </Typography>
      {copyEnabled ? (
        <IconButton
          size="small"
          onClick={() => handleCopy(value, field)}
          sx={{ ml: 1 }}
        >
          <Tooltip title={copyStatus[field] ? "Copied!" : "Copy"}>
            <ContentCopyIcon
              sx={{
                color: copyStatus[field] ? "#4CAF50" : "#000",
                fontSize: "20px",
              }}
            />
          </Tooltip>
        </IconButton>
      ) : (
        <></>
      )}
    </Box>
  </Box>
);

export default LiveTVInfoDialog;
