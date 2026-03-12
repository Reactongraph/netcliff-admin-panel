import React, { useState, useEffect } from "react";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Search from "../assets/images/search.png";

//action
import {
  getPremiumPlan,
  deletePremiumPlan,
  togglePremiumPlanStatus,
  markPremiumPlanAsDefault,
} from "../../store/PremiumPlan/plan.action";
import {
  OPEN_PREMIUM_PLAN_DIALOG,
  CLOSE_PREMIUM_PLAN_TOAST,
} from "../../store/PremiumPlan/plan.type";

//swal
import Swal from "sweetalert2";

//alert
import { setToast } from "../../util/Toast";
import { warning, alert } from "../../util/Alert";

//dialog
import PremiumPlanDialog from "../Dialog/PremiumPlanDialog";
import Pagination from "../../Pages/Pagination";
import { Box, Switch, Typography } from "@mui/material";
import { Button } from "react-bootstrap";

const PremiumPlan = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //get Premium Plan

  useEffect(() => {
    dispatch(getPremiumPlan());
  }, [dispatch]);

  const { premiumPlan, toast, toastData, actionFor } = useSelector(
    (state) => state.premiumPlan,
  );

  useEffect(() => {
    setData(premiumPlan);
  }, [premiumPlan]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_PREMIUM_PLAN_DIALOG });
  };

  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPage = (num) => {
    setRowsPerPage(num);
    setPage(1);
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_PREMIUM_PLAN_DIALOG, payload: data });
  };

  // delete sweetAlert
  const openDeleteDialog = (premiumPlanId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deletePremiumPlan(premiumPlanId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();

    if (value) {
      const data = premiumPlan.filter((data) => {
        return (
          data?.tag?.toUpperCase()?.indexOf(value) > -1 ||
          data?.price?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(premiumPlan);
    }
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_PREMIUM_PLAN_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Premium Plan</h3>
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
                    onChange={handleSearch}
                  />
                </div>
              </form>
              <button
                type="button"
                class="btn dark-icon btn-primary ml-2"
                // data-bs-toggle="modal"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={handleOpen}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
              </button>
              <PremiumPlanDialog />
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
                      <th>Validity</th>
                      <th>Amount</th>
                      <th>Strike-through Price</th>
                      <th>Free Trial Days</th>
                      <th>Tag</th>
                      <th>Benefit</th>
                      <th>Status</th>
                      <th>Default</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data
                          .slice(
                            (page - 1) * rowsPerPage,
                            (page - 1) * rowsPerPage + rowsPerPage,
                          )
                          .sort(
                            (a, b) =>
                              a.validity.validityType - b.validity.validityType,
                          )
                          .map((data, index) => {
                            return (
                              <>
                                <tr
                                  className={`text-center ${
                                    data.isDefaultPlan ? "default-plan" : ""
                                  }`}
                                >
                                  <td>
                                    {data.isDefaultPlan ? (
                                      <i
                                        title="Default Plan"
                                        class="ri-star-fill"
                                        style={{ color: "gold" }}
                                      ></i>
                                    ) : null}{" "}
                                    {index + 1}{" "}
                                  </td>

                                  <td>
                                    {data.validity} &nbsp;
                                    {data.validityType}
                                  </td>
                                  <td>{data.price}</td>
                                  <td>
                                    {data.priceStrikeThrough ? (
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "#999",
                                        }}
                                      >
                                        {data.priceStrikeThrough}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td>{data.freeTrialDays}</td>
                                  <td>
                                    {data.tag ? data.tag : "-"}
                                    <span style={{ color: "#06C270" }}>
                                      {" "}
                                      OFF
                                    </span>
                                  </td>
                                  <td style={{width: "16rem"}}>
                                    {data?.planBenefit?.map((item, index) => {
                                      return (
                                        <>
                                          <p key={index} className="mb-0">
                                            <span style={{ color: "#FF2929" }}>
                                              ✔{" "}
                                            </span>
                                            {item}
                                          </p>
                                        </>
                                      );
                                    })}
                                  </td>

                                  <td>
                                    <select
                                      className="form-select form-select-sm"
                                      value={
                                        data.status === "active"
                                          ? "true"
                                          : "false"
                                      }
                                      onChange={() =>
                                        props.togglePremiumPlanStatus(data._id)
                                      }
                                      style={{
                                        padding: "2px 8px",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      <option value="true">Active</option>
                                      <option value="false">Inactive</option>
                                    </select>
                                  </td>
                                  <td>
                                    {
                                      /* For AB testing granting the default feature to Inactive plan as well, Remove later */
                                    // data.status === "active" &&
                                      !data.isDefaultPlan && (
                                        <button
                                          type="button"
                                          className="btn dark-icon btn-primary"
                                          onClick={() =>
                                            props.markPremiumPlanAsDefault(
                                              data._id,
                                            )
                                          }
                                        >
                                          Mark as Default
                                        </button>
                                      )}
                                  </td>
                                  <td>
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
                                  <td>
                                    <button
                                      type="button"
                                      className="btn iq-bg-primary btn-sm"
                                      onClick={() => openDeleteDialog(data._id)}
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
              <br />

              <Pagination
                activePage={page}
                rowsPerPage={rowsPerPage}
                userTotal={data.length}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handleChangePage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getPremiumPlan,
  deletePremiumPlan,
  togglePremiumPlanStatus,
  markPremiumPlanAsDefault,
})(PremiumPlan);
