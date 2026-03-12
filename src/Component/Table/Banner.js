import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Pagination from "../../Pages/Pagination";
import { apiInstanceFetch } from "../../util/api";

const Banner = () => {
  const history = useHistory();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBanners, setTotalBanners] = useState(0);

  const bannerTypes = {
    'auth': 'Auth',
    'subscription': 'Subscription'
  };

  useEffect(() => {
    fetchBanners();
  }, [activePage, rowsPerPage]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      
      const url = `banner?page=${activePage}&limit=${rowsPerPage}`;

      const response = await apiInstanceFetch.get(url);

      if (response.status) {
        setBanners(response.banners);
        setTotalBanners(response.total);
      } else {
        toast.error(response.message || "Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setRowsPerPage(value);
    setActivePage(1);
  };

  const handleDelete = async (bannerId) => {
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
        const response = await apiInstanceFetch.delete(`banner/${bannerId}`);

        if (response.status) {
          toast.success("Banner deleted successfully");
          fetchBanners();
        } else {
          toast.error(response.message || "Failed to delete banner");
        }
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleStatus = async (bannerId) => {
    try {
      const response = await apiInstanceFetch.put(`banner/${bannerId}/toggle-status`, {});

      if (response.status) {
        toast.success("Banner status updated successfully");
        fetchBanners();
      } else {
        toast.error(response.message || "Failed to update banner status");
      }
    } catch (error) {
      console.error("Error updating banner status:", error);
      toast.error("Failed to update banner status");
    }
  };

  const handleEdit = (bannerId) => {
    history.push(`/admin/edit-banner/${bannerId}`);
  };

  const handleAdd = () => {
    history.push("/admin/add-banner");
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid" style={{overflowX: 'hidden'}}>
          <div className="header_heading p_zero">
            <h3>Banners</h3>
            <div className="header_heading_right_col">
              <button
                type="button"
                className="btn dark-icon btn-primary"
                id="create-btn"
                data-bs-target="#showModal"
                onClick={handleAdd}
              >
                <i className="ri-add-line align-bottom me-1 fs-6"></i> Add Banner
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
                      <th className="tableAlign">#</th>
                      <th className="tableAlign">Image</th>
                      <th className="tableAlign">Type</th>
                      <th className="tableAlign">Order</th>
                      <th className="tableAlign">Status</th>
                      <th className="tableAlign">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : banners.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No banners found
                        </td>
                      </tr>
                    ) : (
                      banners.map((banner, index) => (
                        <tr key={banner._id}>
                          <td className="pr-3 tableAlign">{index + 1}</td>
                          <td className="pr-3 text-center">
                            <img
                              src={banner.image}
                              alt="Banner"
                              style={{
                                width: "80px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px"
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80x60?text=No+Image";
                              }}
                            />
                          </td>
                          <td className="pr-3 tableAlign">
                            <span className={`badge badge-pill badge-${banner.type === 'auth' ? 'primary' : banner.type === 'subscription' ? 'success' : 'warning'}`}>
                              {bannerTypes[banner.type]}
                            </span>
                          </td>
                          <td className="pr-3 tableAlign">
                            {banner.order}
                          </td>
                          <td className="pr-3 tableAlign">
                            <select
                              className="form-select"
                              value={banner.isActive ? "true" : "false"}
                              onChange={() => handleToggleStatus(banner._id)}
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
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn iq-bg-primary btn-sm"
                                onClick={() => handleEdit(banner._id)}
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
                                onClick={() => handleDelete(banner._id)}
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
                userTotal={totalBanners}
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

export default Banner; 