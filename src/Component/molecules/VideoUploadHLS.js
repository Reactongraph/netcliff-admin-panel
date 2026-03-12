import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as UpChunk from '@mux/upchunk';
import { OPEN_DRM_DIALOG } from "../../store/Episode/episode.type";
import { baseURL } from "../../util/config";
import { Toast } from "../../util/Toast_";
import VideoLoader from "../../util/VideoLoader";
import DrmSelectionDialog from "../Dialog/DrmSelectionDialog";

const VideoUploadHLS = ({
    existingHlsFileName,
    onUploadSuccess,
    error,
    drmEnabled,
    setDrmEnabled,
    setLoadingState,
    loading: parentLoading
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [pendingVideoFile, setPendingVideoFile] = useState(null);

    // Sync internal loading with parent if needed, but managing internally for simplicity
    useEffect(() => {
        setLoadingState(loading);
    }, [loading, setLoadingState]);

    const handleHlsUploadClick = () => {
        dispatch({
            type: OPEN_DRM_DIALOG,
            payload: {
                drmEnabled: drmEnabled
            }
        });
    };

    const handleDrmConfirmation = (selectedDrmEnabled) => {
        setDrmEnabled(selectedDrmEnabled);
        setPendingVideoFile({ drmEnabled: selectedDrmEnabled });
        document.getElementById('hlsVideoFileInput').click();
    };

    const handleHlsFileSelection = (event) => {
        if (event.target.files[0]) {
            const drmValue = pendingVideoFile?.drmEnabled !== undefined ? pendingVideoFile.drmEnabled : drmEnabled;
            videoLoadHls(event, drmValue);
            setPendingVideoFile(null);
        }
    };

    const videoLoadHls = async (event, drmEnabledOverride = null) => {
        try {
            const file = event.target.files[0];
            setLoading(true);

            const drmValue = drmEnabledOverride !== null ? drmEnabledOverride : drmEnabled;

            const { data: { uploadUrl, uploadId } } = await axios.post(`${baseURL}file/mux-upload-url?drm=${drmValue}`, {
                webhookUrl: `${baseURL}file/mux-webhook`,
                webhookEvents: ['asset.ready', 'asset.errored']
            });

            if (!uploadId) {
                throw new Error('No upload ID received from Mux');
            }

            // Notify parent about the immediate uploadId for placeholder
            onUploadSuccess({ hlsFileName: uploadId, hlsFileExt: 'm3u8' });

            const upload = UpChunk.createUpload({
                endpoint: uploadUrl,
                file: file,
                chunkSize: 5120,
            });

            upload.on('error', (err) => {
                console.error('Upload error:', err.detail);
                setLoading(false);
                Toast("error", "Upload failed. Please try again.");
                onUploadSuccess({ hlsFileName: '', hlsFileExt: '' });
            });

            upload.on('progress', (progress) => {
                console.log('Upload progress:', progress.detail, '%');
                // You could add a progress bar here if needed
            });

            upload.on('success', () => {
                localStorage.setItem('currentMuxUploadId', uploadId);
                Toast("info", "Upload complete. Processing video...");
                setLoading(false);
            });

        } catch (error) {
            setLoading(false);
            onUploadSuccess({ hlsFileName: '', hlsFileExt: '' });
            Toast("error", "Something went wrong while uploading file.");
            console.error('Upload error:', error);
        }
    };

    useEffect(() => {
        const handleWebhook = (event) => {
            const data = event.data;

            if (data.type === 'mux.webhook') {
                const currentUploadId = localStorage.getItem('currentMuxUploadId');

                if (data.data.id === currentUploadId) {
                    if (data.data.status === 'ready') {
                        const playbackId = data.data.playbackId;
                        onUploadSuccess({
                            hlsFileName: playbackId,
                            hlsFileExt: 'm3u8',
                            signedUrl: data.data.signedUrl
                        });
                        Toast("success", "Video processed and ready!");
                        localStorage.removeItem('currentMuxUploadId');
                    } else if (data.data.status === 'errored') {
                        onUploadSuccess({ hlsFileName: '', hlsFileExt: '' });
                        Toast("error", "Video processing failed. Please try again.");
                        localStorage.removeItem('currentMuxUploadId');
                    }
                }
            }
        };

        window.addEventListener('message', handleWebhook);
        return () => {
            window.removeEventListener('message', handleWebhook);
        };
    }, [onUploadSuccess]);

    return (
        <>
            <input
                type="file"
                id="hlsVideoFileInput"
                className="form-control"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleHlsFileSelection}
            />

            <button
                type="button"
                className="btn form-control"
                onClick={handleHlsUploadClick}
                disabled={loading || parentLoading}
            >
                {existingHlsFileName ? 'Change Video File' : 'Select Video File'}
            </button>

            {loading ? (
                <div style={{ marginTop: "30px" }}>
                    <VideoLoader />
                </div>
            ) : (
                <>
                    {existingHlsFileName && (
                        <div
                            style={{
                                border: "1px solid black",
                                width: "fit-content",
                                padding: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px",
                                marginTop: "10px",
                            }}
                        >
                            {existingHlsFileName}.m3u8
                        </div>
                    )}
                </>
            )}
            {error && (
                <div className="pl-1 text-left">
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

            <DrmSelectionDialog onConfirm={handleDrmConfirmation} />
        </>
    );
};

export default VideoUploadHLS;
