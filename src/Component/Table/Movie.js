import React, { useState, useEffect } from "react";

import noImage from "../assets/images/moviePlaceHolder.png";

//react-router-dom
import { useHistory } from "react-router-dom";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getMovie,
  deleteMovie,
  newRelease,
} from "../../store/Movie/movie.action";
import $ from "jquery";
import { MOVIE_DETAILS } from "../../store/Movie/movie.type";

//mui
import Switch from "@mui/material/Switch";

//Alert
import { warning } from "../../util/Alert";

//html Parser

import Pagination from "../../Pages/Pagination";
import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import { Toast } from "../../util/Toast_";
import { handleImageError } from "../../util/helperFunctions";
import { Checkbox } from "@mui/material";

const Movie = (props) => {
  const { loader } = useSelector((state) => state.loader);

  //Define History
  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [showURLs, setShowURLs] = useState([]);
  const [titleSort, setTitleSort] = useState(true);
  const [countrySort, setCountrySort] = useState(true);
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState({
    featured: false,
    newReleased: false,
  });

  const { movie, totalMovie } = useSelector((state) => state.movie);

  useEffect(() => {
    dispatch(
      getMovie(
        activePage,
        rowsPerPage,
        search,
        searchFilter.featured,
        searchFilter.newReleased
      )
    );
  }, [dispatch, activePage, rowsPerPage, search, searchFilter]);

  useEffect(() => {
    if (movie?.length > 0) {
      setData(movie);
    }
  }, [movie]);

  const updateOpen = (data) => {
    sessionStorage.setItem("trailerId", data?._id);
    localStorage.setItem("updateMovieData1", JSON.stringify(data));
    history.push({ pathname: "/admin/movie/movie_form", state: data });
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const insertOpen = () => {
    localStorage.removeItem("updateMovieData");
    history.push("/admin/movie/movie_form");
  };

  const MovieDetails = (data) => {
    dispatch({ type: MOVIE_DETAILS, payload: data });
    history.push({
      pathname: "/admin/movie/movie_details",
      state: data,
    });
  };

  const handleNewRelease = (movieId) => {
    props.newRelease(movieId);
  };

  const handleSearch = (e) => {
    setSearch(e);
  };

  useEffect(() => {
    localStorage.removeItem("updateMovieData1");
  }, []);

  const deleteOpen = (movieId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteMovie(movieId);
          Toast("success", "Movie deleted successfully.");
        }
      })
      .catch((err) => console.log(err));
  };
  const handleTitleSort = () => {
    setTitleSort(!titleSort);
    arraySort(data, "title", { reverse: titleSort });
  };
  const handleCountrySort = () => {
    setCountrySort(!countrySort);
    arraySort(data, "region.name", { reverse: countrySort });
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Movie</h3>
            <div className="header_heading_right_col">
              <form class="position-relative">
                <div class="form-group mb-0 d-flex position-relative">
                  {" "}
                  <img
                    src={Search || noImage}
                    width="23px"
                    height="23px"
                    className="search_icon"
                    onError={(e) => handleImageError(e, noImage)}
                  />
                  <input
                    type="search"
                    class="form-control"
                    id="input-search"
                    placeholder="Search"
                    aria-controls="user-list-table"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </form>
              <button
                type="button"
                class="btn dark-icon btn-primary"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={insertOpen}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
              </button>
            </div>
          </div>
          <div
            className="iq-card mb-2"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              flexWrap: "wrap",
              gap: "30px",
              marginRight: "10px"
            }}
          >
            <div className="exclusiveContainer">
              <div>
                <Checkbox
                  checked={searchFilter.featured}
                  onChange={(e) => {
                    setSearchFilter((prev) => ({
                      ...prev,
                      featured: e.target?.checked,
                    }));
                  }}
                  color="primary"
                  name="checkedB"
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </div>
              <label>Featured</label>
            </div>
            <div className="exclusiveContainer">
              <div>
                <Checkbox
                  checked={searchFilter.newReleased}
                  onChange={(e) => {
                    setSearchFilter((prev) => ({
                      ...prev,
                      newReleased: e.target?.checked,
                    }));
                  }}
                  color="primary"
                  name="checkedB"
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              </div>
              <label>New released</label>
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
                  <thead class="text-nowrap">
                    <tr>
                      <th className="tableAlign">ID</th>
                      <th className="tableAlign">Image</th>
                      <th
                        className="tableAlign"
                        onClick={handleTitleSort}
                        style={{ cursor: "pointer" }}
                      >
                        Title {titleSort ? " ▼" : " ▲"}
                      </th>
                      <th
                        className="tableAlign"
                        onClick={handleCountrySort}
                        style={{ cursor: "pointer" }}
                      >
                        Country {countrySort ? " ▼" : " ▲"}
                      </th>
                      <th className="tableAlign">Type</th>
                      {/* <th className="tableAlign">New Release</th> */}
                      <th className="tableAlign">View Details</th>
                      <th className="tableAlign">Edit</th>
                      <th className="tableAlign">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0
                      ? data.map((data, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr>
                                <td className="pr-3 tableAlign">{index + 1}</td>
                                <td className="pr-3">
                                  <img
                                    className="img-fluid"
                                    style={{
                                      height: "100px",
                                      width: "80px",
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                      border:
                                        "0.5px solid rgba(255, 255, 255, 0.20)",
                                      objectFit: "cover",
                                    }}
                                    src={
                                      data?.thumbnail
                                        ? data?.thumbnail
                                        : noImage
                                    }
                                    alt=""
                                    onError={(e) =>
                                      handleImageError(e, noImage)
                                    }
                                  />
                                </td>

                                <td className="text-start text-capitalize text-center">
                                  {data?.title}
                                </td>
                                <td className="description-text text-center text-capitalize">
                                  {data?.region?.name?.toLowerCase()}
                                </td>

                                <td className="pr-3 tableAlign">
                                  {data?.type === "Premium" ? (
                                    <div class="badge badge-pill badge-danger">
                                      {data?.type}
                                    </div>
                                  ) : (
                                    <div class="badge badge-pill badge-info">
                                      {data?.type}
                                    </div>
                                  )}
                                </td>

                                {/* <td className="pr-3 tableAlign">
                                  <Switch
                                    checked={data?.newReleased}
                                    onChange={(e) =>
                                      handleNewRelease(data?._id)
                                    }
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{
                                      "aria-label": "primary checkbox",
                                    }}
                                  />
                                </td> */}

                                <td className="pr-3 tableAlign">
                                  <button
                                    type="button"
                                    className="btn iq-bg-primary btn-sm"
                                    onClick={() => MovieDetails(data._id)}
                                  >
                                    <i
                                      class="ri-information-line"
                                      style={{ fontSize: "19px" }}
                                    ></i>
                                  </button>
                                </td>
                                <td className="pr-3 tableAlign">
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
                                <td className="pr-3 tableAlign">
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
                            </React.Fragment>
                          );
                        })
                      : loader === false &&
                        data?.length < 0 && (
                          <tr>
                            <td colSpan="12" className="text-center">
                              No data Found!!
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>

              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalMovie}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getMovie,
  deleteMovie,
  newRelease,
})(Movie);
