import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//mui
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import EditIcon from "@mui/icons-material/Edit";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TvIcon from "@mui/icons-material/Tv";
import Search from "../assets/images/search.png";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";

//action
import { getMovie } from "../../store/Movie/movie.action";
import { getSeries } from "../../store/TvSeries/tvSeries.action";
import { getTrailer, deleteTrailer } from "../../store/Trailer/trailer.action";
import {
  OPEN_TRAILER_DIALOG,
  CLOSE_TRAILER_TOAST,
} from "../../store/Trailer/trailer.type";

//jquery
import $ from "jquery";
import noImage from "../../Component/assets/images/noImage.png";
import { handleImageError } from "../../util/helperFunctions";
import CustomPagination from "../Pagination/CustomPagination";

const SeriesTrailer = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const dispatch = useDispatch();

  const history = useHistory();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [movieTrailer, setMovieTrailer] = useState("all");
  // const [showURLs ,setShowURLs] =useState([""])

  const dialogData = localStorage.getItem("seriesTrailerId");
  const movieTitle = localStorage.getItem("seriesTitle");

  // const tmdbId= JSON.parse(localStorage.getItem("updateMovieData"));

  //useEffect for Trailer
  useEffect(() => {
    dispatch(getTrailer(dialogData));
  }, [dispatch]);

  //Get Trailer
  const { trailer, toast, toastData, actionFor } = useSelector(
    (state) => state.trailer
  );

  useEffect(() => {
    setData(trailer);
  }, [trailer]);

  //Insert Dialog OPen
  const insertOpen = (data) => {
    localStorage.removeItem("updateTrailerData");
    history.push("/admin/series_trailer/trailer_form");
  };

  //Update Dialog OPen
  const updateOpen = (data) => {
    dispatch({ type: OPEN_TRAILER_DIALOG, payload: data });
    localStorage.setItem("updateTrailerData", JSON.stringify(data));

    history.push("/admin/series_trailer/trailer_form");
  };

  const deleteOpen = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteTrailer(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TRAILER_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = trailer.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.movieTitle?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(trailer);
    }
  };

  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>{movieTitle} : Trailer</h3>
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
                // data-bs-toggle="modal"
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

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <div className="table-responsive">
                    <table
                      id="user-list-table"
                      className="table table-striped table-borderless custom_table"
                      role="grid"
                      aria-describedby="user-list-page-info"
                    >
                      <thead>
                        <tr className="text-center">
                          <th>ID</th>
                          <th>Image</th>
                          <th>Web Series</th>
                          <th>Type</th>
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
                                        <img
                                          // className="shadow p-1 mb-2 bg-white rounded "

                                          src={data?.trailerImage}
                                          height="60px"
                                          width="60px"
                                          style={{
                                            boxShadow:
                                              "rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                            border:
                                              " 0.5px solid rgba(255, 255, 255, 0.2)",
                                            borderRadius: 10,

                                            objectFit: "cover",
                                          }}
                                          alt=""
                                          onError={(e) =>
                                            handleImageError(e, noImage)
                                          }
                                        />
                                      </td>
                                      {/* <td className="text-capitalize">
                                    {data?.name.length > 10
                                      ? data?.name?.slice(0, 10) + "..."
                                      : data?.name}
                                  </td> */}
                                      <td>{data?.movieTitle}</td>
                                      {/* <td>
                            {data?.videoUrl} */}
                                      {/* <video
                                      src={data?.videoUrl}
                                      height="60px"
                                      width="60px"
                                      type="video/mp4"
                                      controls
                                      style={{
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                        border: "2px solid rgba(41, 42, 72, 1)",
                                        borderRadius: 10,
                                        float: "left",
                                        objectFit: "cover",
                                      }}
                                    /> */}
                                      {/* </td> */}
                                      <td>{data?.type}</td>

                                      <td>
                                        {dayjs(data?.createdAt).format(
                                          "DD MMM YYYY"
                                        )}
                                      </td>
                                      {/* <td>
                            <button
                              type="button"
                              className="btn iq-bg-primary btn-sm"
                              onClick={() => MovieDetails(data.movieId)}
                            >
                              <i
                                class="ri-information-line"
                                style={{ fontSize: "19px" }}
                              ></i>
                            </button>
                          </td> */}
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
                            data.length === 0 && (
                              <tr>
                                <td colSpan="9" className="text-center">
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
      {/* </div> */}
    </>
  );
};

export default connect(null, {
  getTrailer,
  deleteTrailer,
  getMovie,
  getSeries,
  // getCourseLecture,
})(SeriesTrailer);
