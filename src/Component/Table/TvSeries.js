import React, { useState, useEffect } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";
import $ from "jquery";
import noImage from "../assets/images/movieDefault.png";
//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getSeries,
  deleteSeries,
  newRelease,
  updateSeriesStatus,
} from "../../store/TvSeries/tvSeries.action";
import {
  CLOSE_TV_SERIES_TOAST,
  OPEN_DIALOG,
  TV_SERIES_DETAILS,
} from "../../store/TvSeries/tvSeries.type";

//mui
import Switch from "@mui/material/Switch";

//Alert
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";

//Pagination
import Pagination from "../../Pages/Pagination";
import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import { Toast } from "../../util/Toast_";
import { handleImageError } from "../../util/helperFunctions";
import { Checkbox } from "@mui/material";

const TvSeries = (props) => {
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
    newReleased: false
  });

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

  const { movie, toast, toastData, actionFor, totalSeries, web_Series } =
    useSelector((state) => state.series);

  useEffect(() => {
    dispatch(
      getSeries(
        activePage,
        rowsPerPage,
        search,
        searchFilter.featured,
        searchFilter.newReleased
      )
    );
  }, [dispatch, activePage, rowsPerPage, search, searchFilter]);

  useEffect(() => {
    setData(movie);
  }, [movie]);

  useEffect(() => {
    localStorage.removeItem("updateMovieData1");
  }, []);

  //update button
  const updateOpen = (data) => {
    dispatch({ type: OPEN_DIALOG, payload: data });
    localStorage.setItem("updateMovieData", JSON.stringify(data));
    sessionStorage.setItem("tvSeriesId", data?._id);
    history.push("/admin/web_series/series_form");
  };

  //pagination
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    sessionStorage.setItem("activePage", pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
    sessionStorage.setItem("activePage", activePage);
    sessionStorage.setItem("pageParRow", value);
  };

  const insertOpen = () => {
    localStorage.removeItem("updateMovieData");
    history.push("/admin/web_series/series_form");
  };

  //Movie Details
  const MovieDetails = (data) => {
    // localStorage.setItem("movieDetails", JSON.stringify(data));
    dispatch({ type: TV_SERIES_DETAILS, payload: data });
    history.push({
      pathname: "/admin/web_series/webSeriesDetail",
      state: data,
    });
  };

  //new release switch
  const handleNewRelease = (seriesId) => {
    props.newRelease(seriesId);
  };

  //for search
  const handleSearch = (e) => {
    setSearch(e);
  };

  const handleTitleSort = () => {
    setTitleSort(!titleSort);

    arraySort(data, "title", { reverse: titleSort });
  };
  const handleCountrySort = () => {
    setCountrySort(!countrySort);

    arraySort(data, "region.name", { reverse: countrySort });
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TV_SERIES_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //Delete Movie
  const deleteOpen = (seriesId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteSeries(seriesId);
          Toast("success", "Series deleted successfully.");
        }
      })
      .catch((err) => console.log(err));
  };

  // Add status change handler
  const handleStatusChange = (seriesId, newStatus) => {
    props.updateSeriesStatus(seriesId, newStatus);
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Web Series</h3>
            <div className="header_heading_right_col">
              <form class="position-relative">
                <div class="form-group mb-0 d-flex position-relative">
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
              marginRight: "10px",
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
                {/* <div className="row justify-content-end">
                      <div className="col-sm-12 col-md-6">
                        <div
                          id="user_list_datatable_info"
                          className="dataTables_filter"
                        >
                          <form className="mr-3 position-relative">
                            <div className="form-group mb-0">
                              <input
                                type="search"
                                className="form-control"
                                id="exampleInputSearch"
                                placeholder="Search"
                                aria-controls="user-list-table"
                                onChange={handleSearch}
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div> */}
                <table
                  id="user-list-table"
                  className="table table-striped table-borderless custom_table"
                  role="grid"
                  aria-describedby="user-list-page-info"
                >
                  <thead class="text-nowrap">
                    <tr>
                      <th className=" tableAlign">Sr.</th>
                      <th className=" tableAlign">_ID</th>
                      <th className=" tableAlign">Image</th>
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
                      {/* <th className=" tableAlign">Type</th> */}
                      <th className=" tableAlign">Status</th>
                      <th className=" tableAlign">View Details</th>
                      <th className=" tableAlign">Edit</th>
                      <th className=" tableAlign">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0
                      ? data?.map((data, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="pr-3 tableAlign">
                                {index + 1}
                              </td>
                              <td className="pr-3 tableAlign">
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
                              <td className="pr-3">
                                <img
                                  height="100px"
                                  width="80px"
                                  className="img-fluid"
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                    border:
                                      "0.5px solid rgba(255,255,255,0.20)",
                                    borderRadius: 10,
                                    float: "left",
                                    objectFit: "cover",
                                  }}
                                  src={
                                    data?.thumbnail
                                      ? data?.thumbnail
                                      : noImage
                                  }
                                  alt="profile"
                                  onError={(e) =>
                                    handleImageError(e, noImage)
                                  }
                                />
                              </td>

                              <td className="pr-3 text-center">
                                {data?.title}
                                {/* {data?.title?.length > 10
                                      ? data?.title.slice(0, 10) + "...."
                                      : data?.title} */}
                              </td>
                              <td className="pr-3 description-text text-center text-capitalize">
                                {/* {parse(
                                        `${
                                          data?.description.length > 150
                                            ? data?.description.substr(0, 150) +
                                              "..."
                                            : data?.description
                                        }`
                                      )} */}
                                {data?.region?.name?.toLowerCase()}
                              </td>
                              {/* <td>
                                    <video
                                      // className="shadow bg-white rounded mt-2"
                                      src={data?.link}
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
                                    />
                                  </td> */}
                              {/* <td className="pr-3 tableAlign">
                                {data?.type === "Premium" ? (
                                  <div class="badge badge-pill badge-danger">
                                    {data?.type}
                                  </div>
                                ) : (
                                  <div class="badge badge-pill badge-info">
                                    {data?.type}
                                  </div>
                                )}
                              </td> */}
                              <td className="pr-3 tableAlign">
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
                              {/* <td>{data?.view}</td>

                                  <td>
                                    {dayjs(data?.createdAt).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td> */}
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
                                  onClick={() => MovieDetails(data?._id)}
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
                                  onClick={() => deleteOpen(data?._id)}
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
                      data.length < 0 && (
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
                userTotal={totalSeries}
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
  getSeries,
  deleteSeries,
  newRelease,
  updateSeriesStatus,
})(TvSeries);
