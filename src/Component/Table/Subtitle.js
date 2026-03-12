import React, { useState, useEffect } from "react";
import $ from "jquery";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//mui
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import TranslateIcon from "@mui/icons-material/Translate";
import EditIcon from "@mui/icons-material/Edit";
import Search from "../assets/images/search.png";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteSubtitle,
  getSubtitle,
} from "../../store/Subtitle/subtitle.action";
import { CLOSE_SUBTITLE_TOAST } from "../../store/Subtitle/subtitle.type";
import CustomPagination from "../Pagination/CustomPagination";

const Subtitle = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const dispatch = useDispatch();

  const history = useHistory();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const movieData = JSON.parse(localStorage.getItem("updateMovieData1"));

  useEffect(() => {
    dispatch(getSubtitle(movieData._id));
  }, [dispatch]);

  const { subtitle, toast, toastData, actionFor } = useSelector(
    (state) => state.subtitle
  );

  useEffect(() => {
    setData(subtitle);
  }, [subtitle]);

  //Insert Dialog OPen
  const insertOpen = (data) => {
    history.push("/admin/subtitle/subtitle_form");
  };

  const deleteOpen = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteSubtitle(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_SUBTITLE_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = subtitle.filter((data) => {
        return (
          data?.languageName?.toUpperCase()?.indexOf(value) > -1 ||
          data?.languageId?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(subtitle);
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
            <h3>{movieData.title} : Subtitle</h3>
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
                        <NavLink to="/admin/movie/movie_form">
                          <EditIcon />
                          Edit
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/movie/trailer">
                          <i className="ri-vidicon-line mr-1" />
                          Trailer
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/movie/cast">
                          <RecentActorsIcon />
                          Cast
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/movie/subtitle">
                          <TranslateIcon />
                          Subtitles
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
                          <th>Language</th>
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
                                    <tr className="text-center ">
                                      <td>{index + 1}</td>
                                      <td className="text-capitalize">
                                        {data?.languageName}
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

export default connect(null, { getSubtitle, deleteSubtitle })(Subtitle);
