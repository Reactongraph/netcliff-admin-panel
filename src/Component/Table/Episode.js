import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";
import $ from "jquery";
//mui
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import EditIcon from "@mui/icons-material/Edit";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TvIcon from "@mui/icons-material/Tv";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../../util/Toast";
import { Toast } from "../../util/Toast_"
import { warning } from "../../util/Alert";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";

//action
import {
  getEpisode,
  deleteEpisode,
  getAllEpisode,
  getMovieEpisode,
  updateEpisodeStatus,
} from "../../store/Episode/episode.action";
import { getMovieCategory } from "../../store/Movie/movie.action";
import {
  OPEN_INSERT_DIALOG,
  CLOSE_EPISODE_TOAST,
} from "../../store/Episode/episode.type";
import { getSeason } from "../../store/Season/season.action";

//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

//component

import { handleImageError } from "../../util/helperFunctions";
import CustomPagination from "../Pagination/CustomPagination";
import Search from "../assets/images/search.png";

const Episode = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [seasons, setSeasons] = useState("");
  // const [showURLs, setShowURLs] = useState([""]);

  const dialogData = localStorage.getItem("seriesTrailerId");
  const seriesTitle = localStorage.getItem("seriesTitle");
  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData"));

  // Copy functionality
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      Toast("success", "ID copied to clipboard!");
    }).catch(() => {
      Toast("error", "Failed to copy ID");
    });
  };

  // Truncate ID function
  const truncateId = (id, maxLength = 8) => {
    if (!id) return '';
    return id.length > maxLength ? id.substring(0, maxLength) + '...' : id;
  };

  //get movie
  const [movieData, setMovieData] = useState([]);

  const { movie } = useSelector((state) => state.movie);

  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  useEffect(() => {
    dispatch(getMovieEpisode(dialogData, seasons ? seasons : "AllSeasonGet"));
  }, [dispatch, dialogData, seasons]);

  //Get Episode
  const { episode, toast, toastData, actionFor } = useSelector(
    (state) => state.episode
  );

  useEffect(() => {
    setData(episode);
  }, [episode]);

  //get tv series season from season
  const [seasonData, setSeasonData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    if (tmdbId) {
      dispatch(getSeason(tmdbId?._id));
    }
  }, []);

  //call the season
  const { season } = useSelector((state) => state.season);
  useEffect(() => {
    setSeasonData(season ? season : "AllSeasonGet");
  }, [season]);

  const insertOpen = () => {
    localStorage.removeItem("updateEpisodeData");
    dispatch({ type: OPEN_INSERT_DIALOG });
    history.push("/admin/episode/episode_form");
  };

  //Update Dialog OPen
  const updateOpen = (data) => {
    dispatch({ type: OPEN_INSERT_DIALOG, payload: data });
    localStorage.setItem("updateEpisodeData", JSON.stringify(data));
    history.push("/admin/episode/episode_form");
  };

  const deleteOpen = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteEpisode(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };
  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = episode.filter((data) => {
        return (
          data?.movie?.title?.toUpperCase()?.indexOf(value) > -1 ||
          data?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(episode);
    }
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_EPISODE_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  // Add status change handler
  const handleStatusChange = (episodeId, newStatus) => {
    props.updateEpisodeStatus(episodeId, newStatus);
  };

  // Add play episode handler
  const handlePlayEpisode = (episode) => {
    // Navigate to MuxPlayer with episode data
    const params = new URLSearchParams({
      playbackId: episode.hlsFileName || episode._id,
      title: episode.name,
      userId: 'admin-user',
      episodeId: episode._id,
      seriesTitle: seriesTitle,
      drmEnabled: episode.drmEnabled || false // Include DRM enabled flag
    });
    
    // Open in new tab/window for better user experience
    window.open(`/mux-player?${params.toString()}`, '_blank');
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>{seriesTitle} : Episode</h3>
            <div className="header_heading_right_col">
              <form class="position-relative">
                <div class="form-group mb-0 d-flex mr-3 position-relative">
                  <img
                    src={Search}
                    width="23px"
                    height="23px"
                    className="search_icon"
                  />
                  <input
                    type="search"
                    class="form-control"
                    id="input-search"
                    placeholder="Search"
                    aria-controls="user-list-table"
                    onChange={handleSearch}
                  />
                </div>
              </form>
              <button
                type="button"
                class="defualt_btn"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={insertOpen}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                <div class="iq-card">
                  <div class="iq-card-body">
                    <ul className="sub_tab_col">
                      <li>
                        <NavLink to="/admin/web_series/series_form">
                          <EditIcon />
                          Edit
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/web_series/trailer">
                          <i className="ri-vidicon-line mr-1" />
                          Trailer
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/web_series/season">
                          <DynamicFeedIcon />
                          Season
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/episode">
                          <TvIcon />
                          Episode
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/web_series/cast">
                          <RecentActorsIcon />
                          Cast
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="card mb-2"
                    style={{ backgroundColor: "#1c2c2d00" }}
                  >
                    <div className=" py-3 d-flex flex-row align-items-center justify-content-between">
                      <div className="card-body py-0 pl-2">
                        <div className="">
                          <label className="styleForTitle">Select Season</label>
                          <select
                            name="session"
                            value={seasons}
                            className="form-control "
                            onChange={(e) => {
                              setSeasons(e.target.value);
                            }}
                          >
                            <option value="AllSeasonGet">
                              {!seasons ? "select season" : "All Season"}
                            </option>
                            {seasonData.map((data, key) => {
                              return (
                                <option
                                  value={data._id}
                                  key={key}
                                  selected={data._id}
                                >
                                  Season{" " + data.seasonNumber}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-body pl-2 pr-4">
                  <div className="table-responsive">
                    <table
                      id="user-list-table"
                      className="table table-striped table-borderless custom_table"
                      role="grid"
                      aria-describedby="user-list-page-info"
                    >
                      <thead>
                        <tr className="text-center">
                          <th>Sr.</th>
                          <th>_ID</th>
                          <th>Image</th>
                          <th>Episode No.</th>
                          <th>Name</th>
                          <th>Web Series</th>
                          <th>Status</th>
                          <th>Created Date</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0
                          ? data
                              .slice(
                                (page - 1) * rowsPerPage,
                                (page - 1) * rowsPerPage + rowsPerPage
                              )
                              .map((data, index) => {
                                return (
                                  <>
                                    <tr className="text-center">
                                      <td>{index + 1}</td>
                                      <td>
                                        <div
                                          className="cursor-pointer"
                                          onClick={() => handleCopyId(data?._id)}
                                          title={`Click to copy: ${data?._id}`}
                                        >
                                          <span>{truncateId(data?._id)}</span>
                                          <i 
                                            className="ri-file-copy-line" 
                                            style={{ fontSize: "14px" }}
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <img
                                          src={
                                            data?.image
                                              ? data?.image
                                              : placeholderImage
                                          }
                                          height="60px"
                                          width="60px"
                                          style={{
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                            border:
                                              "0.5px solid rgb(88 106 110)",
                                            borderRadius: 10,
                                            objectFit: "cover",
                                            cursor: (data?.hlsFileName || data?.videoUrl) ? "pointer" : "default"
                                          }}
                                          alt=""
                                          onClick={() => (data?.hlsFileName || data?.videoUrl) && handlePlayEpisode(data)}
                                          onError={(e) =>
                                            handleImageError(
                                              e,
                                              placeholderImage
                                            )
                                          }
                                        />
                                      </td>
                                      <td>{data?.episodeNumber}</td>
                                      <td>
                                        {data?.name.length > 10
                                          ? data?.name?.slice(0, 10) + "..."
                                          : data?.name}
                                      </td>
                                      <td>{data?.title}</td>
                                      <td>
                                        <select
                                          className="form-select"
                                          value={data?.status || "DRAFT"}
                                          onChange={(e) => handleStatusChange(data?._id, e.target.value)}
                                          style={{
                                            padding: "2px 8px",
                                            fontSize: "14px",
                                            borderRadius: "4px",
                                            border: "1px solid #ddd"
                                          }}
                                        >
                                          <option value="DRAFT">Draft</option>
                                          <option value="PUBLISHED">Published</option>
                                          <option value="ARCHIVED">Archived</option>
                                        </select>
                                      </td>
                                      <td>
                                        {dayjs(data?.createdAt).format(
                                          "DD MMM YYYY"
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => updateOpen(data)}
                                        >
                                          <i
                                            className="ri-pencil-fill"
                                            style={{ fontSize: "19px" }}
                                          />
                                        </button>
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => deleteOpen(data._id)}
                                        >
                                          <i
                                            class="ri-delete-bin-6-line"
                                            style={{ fontSize: "19px" }}
                                          ></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })
                          : loader === false &&
                            data?.length < 0 && (
                              <tr>
                                <td colSpan="10" className="text-center">
                                  No data Found!!
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>
                  <br />
                  <CustomPagination
                    count={data?.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
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
  getEpisode,
  getMovieCategory,
  // getMovie,
  deleteEpisode,
  getSeason,
  getMovieEpisode,
  getAllEpisode,
  updateEpisodeStatus,
})(Episode);
