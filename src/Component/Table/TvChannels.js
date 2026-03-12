import React, { useState, useEffect } from "react";

//react-router-dom
import { useHistory } from "react-router-dom";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";

//mui
import Switch from "@mui/material/Switch";

//Alert
import { warning } from "../../util/Alert";

//html Parser

import Pagination from "../../Pages/Pagination";
import arraySort from "array-sort";
import { deleteTvChannel, getAdminTvChannels, updateTvChannel } from "../../store/TvChannel/tvChannel.action";

const TvChannels = (props) => {
  const { loader } = useSelector((state) => state.loader);

  //Define History
  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [titleSort, setTitleSort] = useState(true);
  const [countrySort, setCountrySort] = useState(true);
  const { tvChannels, totalChannels } = useSelector((state) => state.tvChannel);

  useEffect(() => {
    dispatch(getAdminTvChannels(activePage, rowsPerPage));
  }, [dispatch, activePage, rowsPerPage]);

  useEffect(() => {
    if (tvChannels?.length > 0) {
      setData(tvChannels);
    }
  }, [tvChannels]);

  const updateOpen = (data) => {
    sessionStorage.setItem("trailerId", data?._id);
    localStorage.setItem("updateTvChannelData", JSON.stringify(data));
    history.push("/admin/tv_channels/form?mode=update");
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const insertOpen = () => {
    localStorage.removeItem("updateTvChannelData");
    history.push("/admin/tv_channels/form");
  };

  useEffect(() => {
    localStorage.removeItem("updateMovieData1");
  }, []);

  const deleteOpen = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteTvChannel(id);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleStatusChange = async (channelId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    props.updateTvChannel(channelId, { status: newStatus });
  };

  const handleTitleSort = () => {
    setTitleSort(!titleSort);
    arraySort(data, "title", { reverse: titleSort });
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>TV Channels</h3>
            <div className="header_heading_right_col">
              {/* <form class="position-relative">
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
              </form> */}
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
                      <th
                        className="tableAlign"
                        onClick={handleTitleSort}
                        style={{ cursor: "pointer" }}
                      >
                        Name {titleSort ? " ▼" : " ▲"}
                      </th>
                      <th className="tableAlign">Channels</th>
                      <th className="tableAlign">Edit</th>
                      <th className="tableAlign">Status</th>
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
                              <td className="text-start text-capitalize text-center">
                                {data?.name}
                              </td>

                              <td className="pr-3 tableAlign">
                                <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
                                  {Array.isArray(data?.channels) && data?.channels?.map((val, ind) => (
                                    <div key={ind} class="badge badge-pill badge-danger">
                                      {val?.channelName}
                                    </div>))
                                  }
                                </div>
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
                                <div className="d-flex align-items-center justify-content-center">
                                  {data.status !== 'DELETED' && (
                                    <Switch
                                      checked={data?.status === 'ACTIVE'}
                                      onChange={() => handleStatusChange(data._id, data.status)}
                                      color="primary"
                                      size="small"
                                    />
                                  )}
                                  {/* <span className={`status-badge status-${data?.status?.toLowerCase()}`}>
                                    {data.status}
                                  </span> */}
                                </div>
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
                userTotal={totalChannels}
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
  deleteTvChannel,
  updateTvChannel,
})(TvChannels);
