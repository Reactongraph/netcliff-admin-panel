import React, { useState, useEffect } from "react";

//react-router-dom
import Pagination from "../../Pages/Pagination";

//Alert
import Swal from "sweetalert2";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//alert
// import dayjs from "dayjs";
import { setToast } from "../../util/Toast";
import { warning, alert } from "../../util/Alert";

import Search from "../assets/images/search.png";

//action
import {
  CLOSE_CONTINENT_REGION_TOAST,
  OPEN_CONTINENT_REGION_DIALOG,
} from "../../store/ContinentRegion/continentRegion.type";
import { getRegion, deleteRegion } from "../../store/ContinentRegion/continentRegion.action";

//component
import ContinentRegionDialog from "../Dialog/ContinentRegionDialog";
import arraySort from "array-sort";

const ContinentRegion = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [nameSort, setNameSort] = useState(true);
  const [orderSort, setOrderSort] = useState(true);  // Add this with other state declarations

  const dispatch = useDispatch();

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getRegion());
  }, [dispatch]);

  const { region, toast, toastData, actionFor } = useSelector(
    (state) => state.continentRegion
  );

  //Set Data after Getting
  useEffect(() => {
    setData(region);
  }, [region]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_CONTINENT_REGION_DIALOG });
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_CONTINENT_REGION_DIALOG, payload: data });
  };

  // delete sweetAlert
  const openDeleteDialog = (regionId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteRegion(regionId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_CONTINENT_REGION_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = region.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(region);
    }
  };

  //pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPage = (num) => {
    setRowsPerPage(num);
    setPage(1);
  };

  const handlenameSort = () => {
    setNameSort(!nameSort);

    arraySort(data, "name", { reverse: nameSort });
  };

  const handleOrderSort = () => {
    setOrderSort(!orderSort);
    arraySort(data, "order", { reverse: orderSort });
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Regions</h3>
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
                class="btn dark-icon btn-primary"
                // data-bs-toggle="modal"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={handleOpen}
              >
                <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
              </button>
            </div>
          </div>

          <div className="iq-card mb-5 ">
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
                      <th
                        onClick={handlenameSort}
                        style={{ cursor: "pointer" }}
                      >
                        Name {nameSort ? " ▼" : " ▲"}
                      </th>
                      <th
                        onClick={handleOrderSort}
                        style={{ cursor: "pointer" }}
                      >
                        Order {orderSort ? " ▼" : " ▲"}
                      </th>

                      <th>Edit</th>
                      {/* <th>Delete</th> */}
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
                              <tr>
                                <td className="pr-3 tableAlign">
                                  {index + 1}
                                </td>

                                <td className="text-center">
                                  {data?.name?.length && data?.name}
                                </td>

                                <td className="text-center">
                                  {data?.order && data?.order}
                                </td>
                                <td className="pr-3 tableAlign">
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
                                {/* <td className="pr-3 tableAlign">
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
                                      </td> */}
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
              </div>

              <Pagination
                activePage={page}
                rowsPerPage={rowsPerPage}
                userTotal={data.length}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handleChangePage} />
            </div>
          </div>
          <ContinentRegionDialog />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getRegion, deleteRegion })(ContinentRegion);
