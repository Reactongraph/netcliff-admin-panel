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
  CLOSE_TAGS_TOAST,
  OPEN_TAGS_DIALOG,
} from "../../store/Tags/tags.type";
import { getTags, deleteTags } from "../../store/Tags/tags.action";

//component
import TagsDialog from "../Dialog/TagsDialog";

import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import Pagination from "../../Pages/Pagination";

const Tags = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nameSort, setNameSort] = useState(true);

  const dispatch = useDispatch();

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const { tags, toast, toastData, actionFor } = useSelector(
    (state) => state.tags
  );

  //Set Data after Getting
  useEffect(() => {
    setData(tags);
  }, [tags]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_TAGS_DIALOG });
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_TAGS_DIALOG, payload: data });
  };
  
  // delete sweetAlert
  const openDeleteDialog = (tagsId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteTags(tagsId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TAGS_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = tags.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(tags);
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
            <h3>Tags</h3>
            <div className="header_heading_right_col">
              <form class="position-relative">
                <div class="form-group mb-0 d-flex mr-3 position-relative">
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
                      <th
                        onClick={handlenameSort}
                        style={{ cursor: "pointer" }}
                      >
                        Name {nameSort ? " ▼" : " ▲"}
                      </th>
                      <th>Edit</th>
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

                                <td className="pr-3 text-center">
                                  <div className="uppercase">{data?.name?.length && data?.name}</div>
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
          <TagsDialog />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getTags, deleteTags })(Tags);