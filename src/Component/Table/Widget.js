import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

// Components
import Pagination from "../../Pages/Pagination";
import { apiInstanceFetch } from "../../util/api";
import Search from "../assets/images/search.png";

// Icons
// import editIcon from "../assets/images/edit.png";
// import deleteIcon from "../assets/images/delete.png";
// import addIcon from "../assets/images/add.png";

const Widget = () => {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalWidgets, setTotalWidgets] = useState(0);
  const [search, setSearch] = useState("");

  const history = useHistory();

  const widgetTypes = {
    1: "Hero Widget (1:1)",
    2: "Top 10 Widget (9:16)",
    3: "Small Thumbnails (9:16)",
    4: "Large Thumbnails (9:16)",
    5: "Grid"
  };

  useEffect(() => {
    // Restore pagination state from session storage
    const savedPage = sessionStorage.getItem("widgetActivePage");
    const savedRowsPerPage = sessionStorage.getItem("widgetPageParRow");

    if (savedPage) {
      setActivePage(parseInt(savedPage));
    }
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage));
    }
  }, []);

  useEffect(() => {
    fetchWidgets();
  }, [activePage, rowsPerPage, search]);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: activePage,
        limit: rowsPerPage
      });

      if (search.trim()) {
        // Note: Backend needs to implement search functionality
        // For now, we'll just add the search parameter
        params.append('search', search.trim());
      }

      const response = await apiInstanceFetch.get(`widget?${params}`);

      if (response.status) {
        setWidgets(response.widgets);
        setTotalWidgets(response.total);
      }
    } catch (error) {
      console.error("Error fetching widgets:", error);
      toast.error("Failed to fetch widgets");
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    sessionStorage.setItem("widgetActivePage", pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
    sessionStorage.setItem("widgetActivePage", 1);
    sessionStorage.setItem("widgetPageParRow", value);
  };

  const handleDelete = async (widgetId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await apiInstanceFetch.delete(`widget/${widgetId}`);

        if (response.status) {
          toast.success("Widget deleted successfully");
          fetchWidgets();
        } else {
          toast.error(response.message || "Failed to delete widget");
        }
      }
    } catch (error) {
      console.error("Error deleting widget:", error);
      toast.error("Failed to delete widget");
    }
  };

  const handleToggleStatus = async (widgetId) => {
    try {
      const response = await apiInstanceFetch.put(`widget/${widgetId}/toggle-status`, {});

      if (response.status) {
        toast.success("Widget status updated successfully");
        fetchWidgets();
      } else {
        toast.error(response.message || "Failed to update widget status");
      }
    } catch (error) {
      console.error("Error toggling widget status:", error);
      toast.error("Failed to update widget status");
    }
  };



  const handleEdit = (widgetId) => {
    history.push(`/admin/widget/edit/${widgetId}`);
  };

  const handleAdd = () => {
    history.push("/admin/widget/create");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleManageSeries = (widgetId) => {
    history.push(`/admin/widget/${widgetId}/series`);
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Home Page Widgets</h3>
            <div className="header_heading_right_col">
              <form className="position-relative">
                <div className="form-group mb-0 d-flex position-relative">
                  <img
                    src={Search}
                    width="23px"
                    height="23px"
                    className="search_icon"
                  />
                  <input
                    type="search"
                    className="form-control"
                    id="input-search"
                    placeholder="Search"
                    aria-controls="user-list-table"
                    onChange={handleSearch}
                  />
                </div>
              </form>
              <button
                type="button"
                className="btn dark-icon btn-primary"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={handleAdd}
              >
                <i className="ri-add-line align-bottom me-1 fs-6"></i> Add Widget
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
                  <thead className="text-nowrap">
                    <tr>
                      <th className="tableAlign">ID</th>
                      <th className="tableAlign">Title</th>
                      <th className="tableAlign">Type</th>
                      <th className="tableAlign">Order</th>
                      <th className="tableAlign">Series Count</th>
                      <th className="tableAlign">Status</th>
                      <th className="tableAlign">Clickable</th>
                      <th className="tableAlign">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : widgets.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No widgets found
                        </td>
                      </tr>
                    ) : (
                      widgets.map((widget, index) => (
                        <tr key={widget._id}>
                          <td className="pr-3 tableAlign">{index + 1}</td>
                          <td className="pr-3 text-center">
                            {widget.title}
                          </td>
                          <td className="pr-3 tableAlign">
                            <span className={`badge badge-pill badge-${widget.type === 1 ? 'primary' : widget.type === 2 ? 'success' : widget.type === 3 ? 'warning' : widget.type === 4 ? 'info' : 'dark'}`}>
                              {widgetTypes[widget.type]}
                            </span>
                          </td>
                          <td className="pr-3 tableAlign">
                            {widget.order}
                          </td>
                          <td className="pr-3 tableAlign">
                            <span className="badge badge-pill badge-secondary">
                              {widget.seriesIds ? widget.seriesIds.length : 0}
                            </span>
                          </td>
                          <td className="pr-3 tableAlign">
                            <select
                              className="form-select"
                              value={widget.isActive ? "true" : "false"}
                              onChange={(e) => handleToggleStatus(widget._id)}
                              style={{
                                padding: "2px 8px",
                                fontSize: "14px",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                              }}
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </td>
                          <td className="pr-3 tableAlign">
                            <span className={`badge badge-pill ${widget.clickAble !== false ? 'badge-success' : 'badge-secondary'}`}>
                              {widget.clickAble !== false ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="pr-3 tableAlign">
                            <div className="btn-group" role="group">
                              {!widget.customApi && (
                                <button
                                  type="button"
                                  className="btn iq-bg-success btn-sm"
                                  onClick={() => handleManageSeries(widget._id)}
                                  title="Manage Series"
                                >
                                  <i
                                    className="ri-list-check"
                                    style={{ fontSize: "16px" }}
                                  />
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn iq-bg-primary btn-sm"
                                onClick={() => handleEdit(widget._id)}
                                title="Edit"
                              >
                                <i
                                  className="ri-pencil-fill"
                                  style={{ fontSize: "19px" }}
                                />
                              </button>

                              <button
                                type="button"
                                className="btn iq-bg-primary btn-sm"
                                onClick={() => handleDelete(widget._id)}
                                title="Delete"
                              >
                                <i
                                  className="ri-delete-bin-6-line"
                                  style={{ fontSize: "19px" }}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalWidgets}
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

export default Widget; 