import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getRaisedTicket,
  action,
} from "../../store/UserRestrictedTicket/restricted.action";

import profile from "../assets/images/singleUser.png";
import Pagination from "../../Pages/Pagination";
import { handleImageError } from "../../util/helperFunctions";
import { OPEN_SOLVE_DIALOG } from "../../store/UserRestrictedTicket/restricted.type";
import TicketSolveDialog from "../Dialog/TicketSolveDialog";

const UserRaisedTicket = (props) => {
  const { ticketByUser, totalTickets } = useSelector(
    (state) => state.ticketByUser
  );
  const dispatch = useDispatch();

  const { loader } = useSelector((state) => state.loader);

  const [data, setData] = useState([]);
  // const [showURLs, setShowURLs] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [type, setType] = useState("Pending");

  useEffect(() => {
    dispatch(getRaisedTicket(activePage, rowsPerPage, type));
  }, [dispatch, activePage, rowsPerPage, type]);

  useEffect(() => {
    setData(ticketByUser);
  }, [ticketByUser]);

  //pagination
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };
  const handleSolved = (id) => {
    dispatch({ type: OPEN_SOLVE_DIALOG, payload: { _id: id } });
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Raised Ticket</h3>
            <div className="header_heading_right_col">
              <button
                type="button"
                class={`btn ${type === "Pending" ? "activeBtn" : "noneBtn"}`}
                // data-bs-toggle="modal"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={() => setType("Pending")}
              >
                Pending
              </button>
              <button
                type="button"
                class={`btn ${type === "Solved" ? "activeBtn" : "noneBtn"}`}
                // data-bs-toggle="modal"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={() => setType("Solved")}
              >
                Solved
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <div className="table-responsive">
                    {type === "Pending" && (
                      <table
                        id="user-list-table"
                        className="table table-striped table-borderless custom_table"
                        role="grid"
                        aria-describedby="user-list-page-info"
                      >
                        <thead class="text-nowrap">
                          <tr>
                            <th className="text-center">No</th>
                            <th className="d-flex justify-content-center align-items-center">
                              User Image
                            </th>
                            <th className="text-center"> Name</th>
                            <th className="text-center"> Contact</th>
                            <th className="text-center"> Description</th>

                            <th className="text-center">Status</th>
                            <th className="text-center">Solve</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.length > 0
                            ? data.map((data, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td class="text-center">{index + 1}</td>
                                      <td className="text-center">
                                        <img
                                          className="rounded-circle img-fluid avatar-40"
                                          src={data?.userId?.image || profile}
                                          alt=""
                                          style={{ objectFit: "cover" }}
                                          onError={(e) =>
                                            handleImageError(e, profile)
                                          }
                                          onclick="window.open(this.src, '_blank')"
                                        />
                                      </td>

                                      <td className="text-center text-capitalize">
                                        {data?.userId?.fullName}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.contactNumber
                                          ? data?.contactNumber
                                          : "-"}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.description
                                          ? data?.description
                                          : "-"}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.status}
                                      </td>

                                      <td className="text-center">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm py-1"
                                          onClick={() =>
                                            handleSolved(data?._id)
                                          }
                                        >
                                          <i
                                            class="fa-solid fa-check"
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              fontSize: "19px",
                                            }}
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
                                  <td colSpan="12" className="text-center">
                                    No data Found!!
                                  </td>
                                </tr>
                              )}
                        </tbody>
                      </table>
                    )}
                    {type === "Solved" && (
                      <table
                        id="user-list-table"
                        className="table table-striped table-borderless mt-4"
                        role="grid"
                        aria-describedby="user-list-page-info"
                      >
                        <thead class="text-nowrap">
                          <tr>
                            <th className="text-center">No</th>
                            <th className="d-flex justify-content-center align-items-center">
                              Image
                            </th>
                            <th className="text-center"> Name</th>
                            <th className="text-center"> Contact</th>
                            <th className="text-center"> Description</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Comment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.length > 0
                            ? data.map((data, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td class="text-center">{index + 1}</td>
                                      <td className="text-center">
                                        <img
                                          className="rounded-circle img-fluid avatar-40"
                                          src={data?.userId?.image || profile}
                                          alt=""
                                          style={{ objectFit: "cover" }}
                                          onError={(e) =>
                                            handleImageError(e, profile)
                                          }
                                          onclick="window.open(this.src, '_blank')"
                                        />
                                      </td>

                                      <td className="text-center text-capitalize">
                                        {data?.userId?.fullName}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.contactNumber
                                          ? data?.contactNumber
                                          : "-"}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.description
                                          ? data?.description
                                          : "-"}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.status}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.comment ? data?.comment : "-"}
                                      </td>
                                    </tr>
                                  </>
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
                    )}
                  </div>

                  <Pagination
                    activePage={activePage}
                    rowsPerPage={rowsPerPage}
                    userTotal={totalTickets}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TicketSolveDialog />
      </div>
    </>
  );
};

export default connect(null, { getRaisedTicket, action })(UserRaisedTicket);
