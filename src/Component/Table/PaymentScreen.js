import React, { useState, useEffect } from "react";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Search from "../assets/images/search.png";

//action
import { getPremiumPlan } from "../../store/PremiumPlan/plan.action";
import { CLOSE_PREMIUM_PLAN_TOAST } from "../../store/PremiumPlan/plan.type";

//alert
import { setToast } from "../../util/Toast";

//dialog
import Pagination from "../../Pages/Pagination";
import { useHistory } from "react-router-dom";

const PaymentScreen = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const history = useHistory();

  //get Premium Plan

  useEffect(() => {
    /* use the below code if only want to show active plans in payment screen conf listing */
    // const payload = {
    //   status: "active",
    // };
    // dispatch(getPremiumPlan(payload));
    dispatch(getPremiumPlan());
  }, [dispatch]);

  const { premiumPlan, toast, toastData, actionFor } = useSelector(
    (state) => state.premiumPlan
  );

  useEffect(() => {
    setData(premiumPlan);
  }, [premiumPlan]);

  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPage = (num) => {
    setRowsPerPage(num);
    setPage(1);
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

  const navigateToCustomPaymentPage = (data) => {
    console.log("data", data, data._id);
    history.push(`/admin/payment_screen/${data._id}`);
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
            <h3>Payment Screen</h3>
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
                      <th>Plan Name</th>
                      <th>Plan Duration</th>
                      <th>Price</th>
                      <th>Trial Days</th>
                      <th>Plan Status</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data
                          .slice(
                            (page - 1) * rowsPerPage,
                            (page - 1) * rowsPerPage + rowsPerPage
                          )
                          .sort(
                            (a, b) =>
                              a.validity.validityType - b.validity.validityType
                          )
                          .map((data, index) => {
                            return (
                              <>
                                <tr className={`text-center ${
                                    data.isDefaultPlan ? "default-plan" : ""
                                  }`}>
                                  <td>{data.name}  {data.isDefaultPlan ? (
                                      <i
                                        title="Default Plan"
                                        class="ri-star-fill"
                                        style={{ color: "gold" }}
                                      ></i>
                                    ) : null}</td>
                                  <td>{data.validity} {data.validityType}</td>
                                  <td>{data.price}</td>
                                  <td>{data.freeTrialDays}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn iq-bg-primary btn-sm"
                                      onClick={() =>
                                        navigateToCustomPaymentPage(data)
                                      }
                                    >
                                      <i
                                        className="ri-pencil-fill"
                                        style={{ fontSize: "19px" }}
                                      />
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

export default connect(null, { getPremiumPlan })(PaymentScreen);
