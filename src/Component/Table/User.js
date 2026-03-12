import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { useHistory } from "react-router-dom";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//image
import profile from "../assets/images/singleUser.png";

//action
import {
  getUser,
  handleBlockUnblockSwitch,
} from "../../store/User/user.action";

//mui
import Switch from "@mui/material/Switch";

//Pagination
import HistoryIcon from "@mui/icons-material/History";

//Alert

import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import { handleImageError } from "../../util/helperFunctions";
import Pagination from "../../Pages/Pagination";

const User = (props) => {
  const { loader } = useSelector((state) => state.loader);
  const dispatch = useDispatch();

  const history = useHistory();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [coinSort, setCoinSort] = useState(true);
  const [emailSort, setEmailSort] = useState(true);
  const [mobileSort, setMobileSort] = useState(true);
  const [countrySort, setCountrySort] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const { user, total } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  //Set User Data
  useEffect(() => {
    if (user?.user) {
      setData(user.user);
      if (user.pagination) {
        setPagination(user.pagination);
      }
    } else {
      setData(user || []);
    }
  }, [user]);

  //pagination
  const handleChangePage = (num) => {
    setPage(num);
  };
  const handleRowsPerPage = (num) => {
    setRowsPerPage(num);
    setPage(1);
  };

  //user details
  const userDetails = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/user_form");
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = user.filter((data) => {
        return (
          data?.fullName?.toUpperCase()?.indexOf(value) > -1 ||
          data?.country?.toUpperCase()?.indexOf(value) > -1 ||
          data?.gender?.toUpperCase()?.indexOf(value) > -1 ||
          data?.email?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(user);
    }
  };

  const handleUserHistory = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/history");
  };

  //Block switch
  const handleIsBlock = (userId) => {
    props.handleBlockUnblockSwitch(userId);
  };
  const handleCoinSort = () => {
    setCoinSort(!coinSort);

    arraySort(data, "fullName", { reverse: coinSort });
  };
  const handleEmailSort = () => {
    setEmailSort(!emailSort);

    arraySort(data, "email", { reverse: emailSort });
  };
  const handleMobileSort = () => {
    setMobileSort(!mobileSort);
    arraySort(data, "phoneNumber", { reverse: mobileSort });
  };

  const handleCountrySort = () => {
    setCountrySort(!countrySort);

    arraySort(data, "country", { reverse: countrySort });
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>User List</h3>
            <form class="position-relative">
              <div class="form-group mb-0 d-flex position-relative">
                {/* <i class="fa fa-search text-white" aria-hidden="true"></i> */}
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
                    <th className="text-center">Profile</th>
                    <th
                      className="d-flex justify-content-center align-items-center"
                      onClick={handleCoinSort}
                      style={{ cursor: "pointer" }}
                    >
                      Name {coinSort ? " ▼" : " ▲"}
                    </th>
                    {/* <th className="text-center">Nick Name</th> */}
                    <th
                      className="text-center"
                      onClick={handleMobileSort}
                      style={{ cursor: "pointer" }}
                    >
                      Mobile {mobileSort ? " ▼" : " ▲"}
                    </th>
                    <th
                      className="text-center"
                      onClick={handleEmailSort}
                      style={{ cursor: "pointer" }}
                    >
                      Email {emailSort ? " ▼" : " ▲"}
                    </th>

                    {/* <th className="text-center">Gender</th> */}
                    <th
                      className="text-center"
                      onClick={handleCountrySort}
                      style={{ cursor: "pointer" }}
                    >
                      Country {countrySort ? " ▼" : " ▲"}
                    </th>

                    <th className="text-center">Premium Plan</th>
                    <th className="text-center">Verified</th>
                    <th className="text-center">Block</th>
                    <th className="text-center">Join Date</th>
                    <th className="text-center">History</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0
                    ? data.map((data, index) => {
                        return (
                          <>
                            <tr>
                              {/* <td class="align-middle">{index + 1}</td> */}
                              <td className="text-center">
                                <img
                                  className="rounded-circle img-fluid avatar-40"
                                  src={data?.image ? data?.image : profile}
                                  alt=""
                                  style={{ objectFit: "cover" }}
                                  onError={(e) =>
                                    handleImageError(e, profile)
                                  }
                                />
                              </td>

                              <td className="text-center text-capitalize">
                                {data?.fullName ? data?.fullName : '-'}
                              </td>
                              {/* <td className="text-center text-capitalize">
                                {data?.nickName}
                              </td> */}
                              <td className="text-center">
                                {data?.phoneNumber}
                              </td>
                              <td className="text-center">
                                {data?.loginType !== 2
                                  ? data?.email
                                  : data.uniqueId}
                              </td>
                              {/* <td className="text-center text-capitalize">
                                {data?.gender ? data?.gender : '-'}
                              </td> */}
                              <td className="text-center text-capitalize">
                                {data?.country ? data?.country : '-'}
                              </td>

                              <td className="text-center">
                                {data.isPremiumPlan ? "Yes" : "No"}
                              </td>
                              <td className="text-center">
                                {data.phoneStatus === 'VERIFIED' ? "Yes" : "No"}
                              </td>
                              <td className="text-center">
                                <Switch
                                  checked={data?.isBlock}
                                  onChange={(e) => handleIsBlock(data?._id)}
                                  color="primary"
                                  name="checkedB"
                                  inputProps={{
                                    "aria-label": "primary checkbox",
                                  }}
                                />
                              </td>
                              <td class="align-middle text-center">
                                {dayjs(data?.date).format("YYYY MMM DD")}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn iq-bg-primary btn-sm"
                                  onClick={() => handleUserHistory(data)}
                                >
                                  <HistoryIcon />
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
            <Pagination
              activePage={pagination.currentPage}
              rowsPerPage={rowsPerPage}
              userTotal={pagination.totalUsers}
              handleRowsPerPage={handleRowsPerPage}
              handlePageChange={handleChangePage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getUser,
  handleBlockUnblockSwitch,
})(User);
