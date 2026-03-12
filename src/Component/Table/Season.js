import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { NavLink } from "react-router-dom";

//mui
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import EditIcon from "@mui/icons-material/Edit";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TvIcon from "@mui/icons-material/Tv";
import Search from "../assets/images/search.png";

//Alert
import Swal from "sweetalert2";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

import { warning } from "../../util/Alert";

import { getSeason, deleteSeason } from "../../store/Season/season.action";
import { OPEN_SEASON_DIALOG } from "../../store/Season/season.type";
import SeasonDialogue from "../Dialog/SeasonDialogue";
import placeholderImage from "../assets/images/defaultUserPicture.jpg";
import CustomPagination from "../Pagination/CustomPagination";

const Season = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dialogData = localStorage.getItem("seriesTrailerId");
  const seriesTitle = localStorage.getItem("seriesTitle");

  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch({ type: OPEN_SEASON_DIALOG });
  };

  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_SEASON_DIALOG, payload: data });
  };
  //useEffect for Get Data
  useEffect(() => {
    dispatch(getSeason(dialogData));
  }, [dispatch]);

  const { season, toast, toastData, actionFor } = useSelector(
    (state) => state.season
  );
  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData"));

  //Set Data after Getting
  useEffect(() => {
    setData(season);
  }, [season]);

  const openDeleteDialog = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteSeason(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = season.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(season);
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
            <h3>{seriesTitle} : Season</h3>
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
                onClick={handleOpen}
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
                        <tr>
                          <th className="tableAlign">ID</th>
                          <th style={{ paddingLeft: "45px" }}>Image</th>
                          <th className="tableAlign">Name</th>
                          <th className="tableAlign">Season No.</th>
                          <th className="tableAlign">Total Episode</th>
                          <th className="tableAlign">Web Series</th>
                          <th className="tableAlign">Realese Date</th>
                          <th className="tableAlign">Created At</th>
                          <th className="tableAlign">Edit</th>
                          <th className="tableAlign">Delete</th>
                        </tr>
                      </thead>
                      <tbody style={{ borderColor: "#e9ebec" }}>
                        {data?.length > 0
                          ? data
                              .slice(
                                (page - 1) * rowsPerPage,
                                (page - 1) * rowsPerPage + rowsPerPage
                              )
                              .map((data, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td class="align-middle tableAlign">
                                        {index + 1}
                                      </td>
                                      <td
                                        className="align-middle"
                                        style={{ paddingLeft: "38px" }}
                                      >
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
                                            float: "left",
                                            objectFit: "cover",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.name}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.seasonNumber}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.episodeCount}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.movie?.title}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.releaseDate}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {dayjs(data?.createdAt).format(
                                          "DD MMM YYYY"
                                        )}
                                      </td>

                                      <td class="align-middle tableAlign">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => updateDialogOpen(data)}
                                        >
                                          <i
                                            className="ri-pencil-fill"
                                            style={{ fontSize: "19px" }}
                                          />
                                        </button>
                                      </td>
                                      <td class="align-middle tableAlign">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() =>
                                            openDeleteDialog(data?._id)
                                          }
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
                            data?.length === 0 && (
                              <tr>
                                <td colSpan="12" className="text-center">
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
        <SeasonDialogue />
      </div>
    </>
  );
};

export default connect(null, { getSeason, deleteSeason })(Season);
