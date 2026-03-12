import React, { useState, useEffect, useCallback } from "react";

//react-router-dom
import Pagination from "../../Pages/Pagination";

//Alert
import Swal from "sweetalert2";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//alert
// import dayjs from "dayjs";
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";

import Search from "../assets/images/search.png";

//action
import {
  CLOSE_CITY_TOAST,
  OPEN_CITY_DIALOG,
} from "../../store/City/city.type";

//component
import arraySort from "array-sort";
import { deleteCity, getCities } from "../../store/City/city.action";
import CityDialog from "../Dialog/CityDialog";
import { debounce } from "lodash";

const Cities = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [nameSort, setNameSort] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch();

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getCities(page, rowsPerPage, searchQuery));
  }, [dispatch, page, rowsPerPage,]);

  const { cities, totalCities, toast, toastData, actionFor } = useSelector(
    (state) => state.city
  );

  //Set Data after Getting
  useEffect(() => {
    setData(cities);
  }, [cities]);

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_CITY_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  const debouncedSearch = useCallback(
    debounce(async (search) => {
      console.log('serach', search)
      if (search.trim()) {
        dispatch(getCities(page, rowsPerPage, search));
      }

    }, 500), // 500ms delay
    [page, rowsPerPage,]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);


  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_CITY_DIALOG });
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_CITY_DIALOG, payload: data });
  };

  // delete sweetAlert
  const openDeleteDialog = (regionId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteCity(regionId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPage(1); // Reset to first page on new search
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

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Cities</h3>
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
                    value={searchQuery}
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
                      <th>
                        City
                      </th>
                      <th>Edit</th>
                      {/* <th>Delete</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0
                      ? data
                        .map((data, index) => {
                          return (
                            <>
                              <tr>
                                <td className="pr-3 tableAlign">
                                  {index + 1}
                                </td>

                                <td className="text-center uppercase">
                                  {data?.name?.length && data?.name}
                                </td>

                                <td className="text-center">
                                  {data?.region && data?.region?.name}
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
                userTotal={totalCities}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handleChangePage} />
            </div>
          </div>
          <CityDialog />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getCities, deleteCity })(Cities);
