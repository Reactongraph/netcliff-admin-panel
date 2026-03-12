import React, { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
//Pagination

import { IconButton, Switch, TablePagination, Tooltip } from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getAdminCreateLiveTv,
  deleteLiveChannel,
} from "../../store/LiveTv/liveTv.action";
//Alert
import Swal from "sweetalert2";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";

//Alert

import { useHistory } from "react-router-dom";
import {
  OPEN_LIVE_TV_ACTION_DIALOGUE,
  OPEN_LIVE_TV_DIALOGUE,
} from "../../store/LiveTv/liveTv.type";
import LiveTvEditDialogue from "../Dialog/LiveTvEditDialogue";

import {
  getSetting,
  handleSwitch,
  updateSetting,
} from "../../store/Setting/setting.action";
import { warning } from "../../util/Alert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LiveTvActionsDialog from "../Dialog/LiveTvActionsDialog";
import LiveTVInfoDialog from "../Dialog/LiveTvInfoDialog";
import { getGenre } from "../../store/Genre/genre.action";
import { capitalizeEachWord } from "../../util/helperFunctions";

const LiveTv = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const { adminCreateLiveTv } = useSelector((state) => state.liveTv);
  const { genre } = useSelector((state) => state.genre);

  const { setting } = useSelector((state) => state.setting);
  console.log("setting", setting);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [countries, setCountries] = useState("");
  const [isIptvAPI, setIsIptvAPI] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);

  // const [defaultChannel, setDefaultChannel] = useState(null);

  useEffect(() => {
    setIsIptvAPI(setting.isIptvAPI);
    dispatch(getSetting());
    dispatch(getAdminCreateLiveTv());
  }, [dispatch]);

  useEffect(() => {
    setIsIptvAPI(setting.isIptvAPI);
  }, [setting]);

  useEffect(() => {
    if (genre && Array.isArray(genre) && genre.length === 0) {
      dispatch(getGenre());
    }
  }, [])

  useEffect(() => {
    setData(adminCreateLiveTv);
    console.log("adminCreateLiveTv", adminCreateLiveTv);
  }, [adminCreateLiveTv]);

  const insertManualLiveTv = (data) => {
    // dispatch({ type: OPEN_LIVE_TV_DIALOGUE });
    history.push("/admin/live_tv/customLiveTv?mode=create");
  };

  const history = useHistory();

  const insertOpen = () => {
    history.push("live_tv/createLiveTv");
  };

  const handleMouseOver = (videoId) => {
    setIsHovered(videoId);
  };

  const handleMouseOut = () => {
    setIsHovered(null);
  };

  const handleVideoClick = (videoId) => {
    setIsPlaying(videoId === isPlaying ? null : videoId);
  };

  const deleteOpen = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteLiveChannel(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSwitch_ = (type, value) => {
    props.handleSwitch(setting?._id, type, value);
  };

  const handelEditManual = (data) => {
    // dispatch({ type: OPEN_LIVE_TV_DIALOGUE, payload: data });
    localStorage.setItem("updateChannelData", JSON.stringify(data));
    history.push("/admin/live_tv/customLiveTv?mode=update");
  };

  const handleDefaultChannelChange = (obj) => {
    props.updateSetting(setting._id, obj);
    // setDefaultChannel(channelId);
  };

  return (
    <>
      <div id="content-page" className="content-page live-tv">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Live TV</h3>
            <div className="header_heading_right_col">
              <div className="switch_app d-flex justify-content-between align-items-center">
                <h5 className="cursor_pointer d-block" style={{ cursor: 'pointer' }} onClick={() => history.push('/admin/continent-region')}>Regions</h5>
                <h5 className="cursor_pointer d-block" style={{ cursor: 'pointer' }} onClick={() => history.push('/admin/cities')}>Cities</h5>
                <h5 className="cursor_pointer d-block" style={{ cursor: 'pointer' }} onClick={() => history.push('/admin/tv_channels')}>TV Channels</h5>
                <h5 className="cursor_pointer d-block" style={{ cursor: 'pointer' }} onClick={() => history.push('/admin/analytics')}>Analytics</h5>
                <h5> Show In App</h5>
                <label class="switch">
                  <Switch
                    onChange={() => handleSwitch_("IptvAPI", isIptvAPI)}
                    checked={isIptvAPI}
                    color="primary"
                    name="checkedB"
                    inputProps={{
                      "aria-label": "primary checkbox",
                    }}
                  />
                </label>
              </div>
              <button
                type="button"
                class="defualt_btn"
                // data-bs-toggle="modal"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={insertOpen}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Fetch
              </button>
              <button
                type="button"
                class="defualt_btn whte_btn"
                // data-bs-toggle="modal"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={insertManualLiveTv}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
              </button>
            </div>
          </div>

          <div class="layout-top-spacing tv_card_wrapper" style={{marginTop:'15px'}}>
            {data?.length > 0 ? (
              <>
                {data?.map((data, index) => {
                  console.log("data", data)
                  return (
                    <React.Fragment key={index}>
                      <div
                        class="tv_card_main_col relative"
                        onMouseOver={() => handleMouseOver(data?._id)}
                        onMouseOut={handleMouseOut}
                      >
                        <div class="iq-card tv_card_col">
                          {/* Radio button to make a channel default */}
                          <div className="default-selector-container">
                            <label
                              className="default-selector"
                              style={{
                                display:
                                  isHovered === data?._id ||
                                    setting?.defaultLiveTvId === data?._id
                                    ? "block"
                                    : "none",
                              }}
                            >
                              <input
                                type="radio"
                                name="defaultChannel"
                                checked={setting?.defaultLiveTvId === data?._id}
                                onChange={() =>
                                  handleDefaultChannelChange({
                                    defaultLiveTvId: data?._id,
                                    defaultLiveTVLink: data.streamURL,
                                  })
                                }
                              />
                              <span
                                style={{ marginLeft: "8px", color: "#fff" }}
                              >
                                Default
                              </span>
                            </label>
                          </div>

                          <div className="relative" key={index}>
                            {data?.streamType === "INTERNAL" && !data?.awsChannelId ? (
                              <div style={{ width: '100%', height: '100%', padding: 16 }} className="tv_card_badge">
                                Preparing resources...
                              </div>
                            ) : (
                              <>
                                {isPlaying === data?._id ? (
                                  <ReactPlayer
                                    width="calc(100% - 0px)"
                                    height="100%"
                                    url={data?.streamURL}
                                    playing={true}
                                    onClick={() => handleVideoClick(data?._id)}
                                    loop={true}
                                    controls
                                  />
                                ) : (
                                  <div 
                                    className="channel-logo-container"
                                    onClick={() => handleVideoClick(data?._id)}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: '#f5f5f5',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <img 
                                      src={data?.channelLogo} 
                                      alt={data?.channelName}
                                      style={{
                                        minWidth: '100%',
                                        minHeight: '100%',

                                      }}
                                    />
                                  </div>
                                )}
                                <span className="live_tv_badge">
                                  {data?.streamType ?? ""}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="tv_card_content" style={{height:"170px"}}>
                            <div className="d-flex align-items-start justify-content-between">
                              <h4 className="m-0"> {data?.channelName}</h4>
                              <div className="tv_card_icons">
                                <IconButton
                                  sx={{
                                    width: "24px",
                                    height: "24px",
                                    border: 1,
                                    borderColor: `rgba(255, 255, 255, 0.2)`,
                                    borderRadius: 0,
                                    p: 2,
                                    ml: 1,
                                  }}
                                >
                                  <Tooltip title="Reload Info">
                                    <RefreshIcon
                                      sx={{ color: "#111", fontSize: "20px" }}
                                    />
                                  </Tooltip>
                                </IconButton>

                                <IconButton
                                  onClick={() =>
                                    dispatch({
                                      type: OPEN_LIVE_TV_ACTION_DIALOGUE,
                                      payload: data,
                                    })
                                  }
                                  sx={{
                                    width: "24px",
                                    height: "24px",
                                    border: 1,
                                    borderColor: `rgba(255, 255, 255, 0.2)`,
                                    borderRadius: 0,
                                    p: 2,
                                    ml: 1,
                                  }}
                                >
                                  <Tooltip title="Action">
                                    <MoreVertIcon
                                      sx={{ color: "#111", fontSize: "20px" }}
                                    />
                                  </Tooltip>
                                </IconButton>
                              </div>
                            </div>

                            <div className="card-info-container" style={{ marginTop: '10px' }}>
                              <div className="d-flex align-items-center" style={{ gap: '16px', marginBottom: '12px' }}>
                                {data?.category?.name && (
                                  <div className="info-item d-flex align-items-center" style={{ gap: '4px' }}>
                                    <CategoryOutlinedIcon sx={{ fontSize: '16px', color: '#666' }} /> 
                                    <span style={{ fontSize: '13px' }}>{capitalizeEachWord(data?.category?.name)}</span>
                                  </div>
                                )}

                                {data?.continent?.name && (
                                  <div className="info-item d-flex align-items-center" style={{ gap: '4px' }}>
                                    <LocationOnIcon sx={{ fontSize: '16px', color: '#666' }} /> 
                                    <span style={{ fontSize: '13px' }}>{capitalizeEachWord(data?.continent?.name)}</span>
                                  </div>
                                )}

                                {data?.language?.name && (
                                  <div className="info-item d-flex align-items-center" style={{ gap: '4px' }}>
                                    <LanguageIcon sx={{ fontSize: '16px', color: '#666' }} /> 
                                    <span style={{ fontSize: '13px' }}>{capitalizeEachWord(data?.language?.name)}</span>
                                  </div>
                                )}
                              </div>

                              {data?.description && (
                                <p className="description-text" style={{
                                  fontSize: '13px',
                                  color: '#666',
                                  margin: '0',
                                  display: '-webkit-box',
                                  WebkitLineClamp: '2',
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  lineHeight: '1.4',
                                  padding: '0'
                                }}>
                                  {data.description.replace(/<\/?[^>]+(>|$)/g, "")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              [...Array(9)].map((x, i) => {
                return (
                  <React.Fragment key={i}>
                    <div class="tv_card_main_col relative">
                      <div class="iq-card tv_card_col">
                        <div className="relative" key={i}>
                          <Skeleton
                            width="calc(100% - 0px)"
                            height="180px"
                            highlightColor="#fafdff"
                            baseColor="#f0f5f9"
                          />
                        </div>

                        <div className="tv_card_content">
                          <div className="d-flex align-items-start justify-content-between">
                            <Skeleton
                              className="m-2 mt-3"
                              height={20}
                              width={60}
                              highlightColor="#fafdff"
                              baseColor="#f0f5f9"
                            />
                          </div>
                          <Skeleton
                            className="m-2"
                            height={10}
                            width={120}
                            highlightColor="#fafdff"
                            baseColor="#f0f5f9"
                          />
                          <Skeleton
                            className="m-2"
                            height={10}
                            width={60}
                            highlightColor="#fafdff"
                            baseColor="#f0f5f9"
                          />
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      <LiveTvEditDialogue />
      <LiveTvActionsDialog />
      <LiveTVInfoDialog />
    </>
  );
};

export default connect(null, {
  getAdminCreateLiveTv,
  deleteLiveChannel,
  handleSwitch,
  getSetting,
  updateSetting,
  getGenre
})(LiveTv);
