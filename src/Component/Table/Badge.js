import React, { useState, useEffect } from "react";

//Alert
import Swal from "sweetalert2";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//alert
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";

//action
import {
  CLOSE_BADGE_TOAST,
  OPEN_BADGE_DIALOG,
  OPEN_METRICS_DIALOG,
} from "../../store/Badge/badge.type";
import { getBadge, deleteBadge, updateBadge } from "../../store/Badge/badge.action";

//component
import BadgeDialog from "../Dialog/BadgeDialog";
import BadgeMetricsDialog from "../Dialog/BadgeMetricsDialog";

import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import Pagination from "../../Pages/Pagination";

const Badge = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nameSort, setNameSort] = useState(true);

  const dispatch = useDispatch();

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getBadge());
  }, [dispatch]);

  const { badge, toast, toastData, actionFor } = useSelector(
    (state) => state.badge
  );

  //Set Data after Getting
  useEffect(() => {
    setData(badge);
  }, [badge]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_BADGE_DIALOG });
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_BADGE_DIALOG, payload: data });
  };

  //Open Metrics Dialog
  const openMetricsDialog = (data) => {
    dispatch({ type: OPEN_METRICS_DIALOG, payload: data });
  };
  
  // delete sweetAlert
  const openDeleteDialog = (badgeId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteBadge(badgeId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  // Status Handler
  const handleStatus = (data, value) => {
      const newStatus = value === "true";
      props.updateBadge(data._id, { status: newStatus });
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_BADGE_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = badge.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(badge);
    }
  };

  const handlenameSort = () => {
    setNameSort(!nameSort);
    arraySort(data, "name", { reverse: nameSort });
  };

  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPage = (num) => {
    setRowsPerPage(num);
    setPage(1);
  };

  return (
      <>
          <div id="content-page" className="content-page">
              <div className="container-fluid">
                  <div className="header_heading p_zero">
                      <h3>Badges</h3>
                      <div className="header_heading_right_col">
                          <div class="position-relative" >
                              <div class="form-group mb-0 d-flex mr-3 position-relative">
                                  <img src={Search} width="23px" height="23px" className="search_icon" />
                                  <input
                                      type="search"
                                      class="form-control"
                                      id="input-search"
                                      placeholder="Search"
                                      aria-controls="user-list-table"
                                      onChange={handleSearch}
                                  />
                              </div>
                          </div>

                          <button
                              type="button"
                              class="btn dark-icon btn-primary"
                              id="create-btn"
                              data-bs-target="#showModal"
                              onClick={handleOpen}
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
                                      <tr className="text-center">
                                          <th>ID</th>
                                          <th onClick={handlenameSort} style={{ cursor: "pointer" }}>
                                              Name {nameSort ? " ▼" : " ▲"}
                                          </th>
                                          <th>Placement</th>
                                          <th>Style</th>
                                          <th>Status</th>
                                          <th>Priority</th>
                                          <th>Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {data?.length > 0
                                          ? data
                                                .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                                .map((data, index) => {
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td className="pr-3 tableAlign">{index + 1}</td>

                                                                <td className="pr-3 text-center">
                                                                    <div className="uppercase">
                                                                        {data?.name?.length && data?.name}
                                                                    </div>
                                                                </td>

                                                                <td className="pr-3 text-center">
                                                                    <div className="text-capitalize">
                                                                        {data?.placement}
                                                                    </div>
                                                                </td>

                                                                <td className="pr-3 text-center">
                                                                    <div className="text-capitalize">{data?.style}</div>
                                                                </td>

                                                                <td className="pr-3 text-center">
                                                                    <select
                                                                        className="form-control"
                                                                        value={data.status ? "true" : "false"}
                                                                        onChange={(e) => handleStatus(data, e.target.value)}
                                                                        style={{
                                                                            padding: "0px 8px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "4px",
                                                                            border: "1px solid #ddd",
                                                                            height: "30px",
                                                                            width: "auto",
                                                                            display: "inline-block"
                                                                        }}
                                                                    >
                                                                        <option value="true">Active</option>

                                                                        <option value="false">Inactive</option>
                                                                    </select>
                                                                </td>

                                                                <td className="pr-3 text-center">
                                                                    {data?.priority || 0}
                                                                </td>

                                                                <td className="pr-3 tableAlign">
                                                                    <button
                                                                        type="button"
                                                                        className="btn iq-bg-primary btn-sm mr-2"
                                                                        onClick={() => updateDialogOpen(data)}
                                                                    >
                                                                        <i
                                                                            className="ri-pencil-fill"
                                                                            style={{ fontSize: "19px" }}
                                                                        />
                                                                    </button>
                                                                    {data.category !== "trending" &&
                                                                        data.category !== "editors-choice" && (
                                                                            <button
                                                                                type="button"
                                                                                className="btn iq-bg-success btn-sm"
                                                                                onClick={() => openMetricsDialog(data)}
                                                                            >
                                                                                <i
                                                                                    className="ri-bar-chart-fill"
                                                                                    style={{ fontSize: "19px" }}
                                                                                />
                                                                            </button>
                                                                        )}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    );
                                                })
                                          : loader === false &&
                                            data?.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center">
                                                        No data Found!!
                                                    </td>
                                                </tr>
                                            )}
                                  </tbody>
                              </table>
                          </div>

                          <Pagination
                              activePage={page}
                              rowsPerPage={rowsPerPage}
                              userTotal={data.length}
                              handleRowsPerPage={handleRowsPerPage}
                              handlePageChange={handleChangePage}
                          />
                      </div>
                  </div>
                  <BadgeDialog />
                  <BadgeMetricsDialog />
              </div>
          </div>
      </>
  );
};

export default connect(null, { getBadge, deleteBadge, updateBadge })(Badge);
