import React, { useState, useEffect } from "react";
import $ from "jquery";
//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Search from "../assets/images/search.png";

//mui
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import EditIcon from "@mui/icons-material/Edit";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TvIcon from "@mui/icons-material/Tv";

//Alert
import Swal from "sweetalert2";

//Alert
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";

//action
import {
  getTeamMember,
  deleteTeamMember,
} from "../../store/TeamMember/teamMember.action";
import { getMovie } from "../../store/Movie/movie.action";
import {
  OPEN_DIALOG,
  CLOSE_TEAM_MEMBER_TOAST,
} from "../../store/TeamMember/teamMember.type";

import { handleImageError } from "../../util/helperFunctions";
import CustomPagination from "../Pagination/CustomPagination";

const SeriesCast = (props) => {
  const { loader } = useSelector((state) => state.loader);
  const { teamMember, toast, toastData, actionFor } = useSelector(
    (state) => state.teamMember
  );
  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dialogData = localStorage.getItem("seriesTrailerId");
  const movieTitle = localStorage.getItem("seriesTitle");

  //getAuthor
  useEffect(() => {
    dispatch(getTeamMember(dialogData));
    dispatch(getMovie());
  }, []);

  useEffect(() => {
    setData(teamMember);
  }, [teamMember]);

  const insertOpen = (data) => {
    localStorage.removeItem("updateTeamMemberData");
    history.push("/admin/series_cast/cast_form");
  };

  //Update Dialog OPen
  const updateOpen = (data) => {
    dispatch({ type: OPEN_DIALOG, payload: data });
    localStorage.setItem("updateTeamMemberData", JSON.stringify(data));

    history.push("/admin/series_cast/cast_form");
  };

  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // delete sweetAlert
  const openDeleteDialog = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteTeamMember(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = teamMember.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.position?.toUpperCase()?.indexOf(value) > -1 ||
          data?.movie?.title.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(teamMember);
    }
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TEAM_MEMBER_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>{movieTitle} : Cast</h3>
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
                        <tr>
                          <th className="tableAlign">ID</th>
                          <th className="tableAlign">Profile Image</th>
                          <th className="tableAlign">Name</th>
                          <th className="tableAlign">Job</th>
                          <th className="tableAlign">Web Series</th>
                          <th className="tableAlign">Edit</th>
                          <th className="tableAlign">Delete</th>
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
                                              "0.5px solid rgba(255, 255, 255, 0.20)",
                                            borderRadius: 10,

                                            objectFit: "cover",
                                          }}
                                          alt=""
                                          onError={(e) =>
                                            handleImageError(
                                              e,
                                              placeholderImage
                                            )
                                          }
                                        />
                                      </td>
                                      <td>{data?.name}</td>
                                      <td>{data?.position}</td>
                                      <td>{data?.movie?.title}</td>

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
                                          onClick={() =>
                                            openDeleteDialog(data._id)
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
                            data.length === 0 && (
                              <tr>
                                <td colSpan="12" className="text-center">
                                  No data Found!!
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>

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
  getTeamMember,
  getMovie,
  deleteTeamMember,
})(SeriesCast);
