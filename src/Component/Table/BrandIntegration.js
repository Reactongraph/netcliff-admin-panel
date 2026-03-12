import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import Pagination from "../../Pages/Pagination";
import { apiInstanceFetch } from "../../util/api";
import BrandIntegrationDialog from "../Dialog/BrandIntegrationDialog";
import Search from "../assets/images/search.png";

const BrandIntegration = () => {
  const [brandIntegrations, setBrandIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBrandIntegrations, setTotalBrandIntegrations] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrandIntegration, setEditingBrandIntegration] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchBrandIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, rowsPerPage]);

  const fetchBrandIntegrations = async () => {
    try {
      setLoading(true);
      
      const url = `brand-integration?page=${activePage}&limit=${rowsPerPage}`;

      const response = await apiInstanceFetch.get(url);

      if (response.status) {
        setBrandIntegrations(response.brandIntegrations || []);
        setTotalBrandIntegrations(response.total || 0);
      } else {
        toast.error(response.message || "Failed to fetch brand integrations");
      }
    } catch (error) {
      console.error("Error fetching brand integrations:", error);
      toast.error("Failed to fetch brand integrations");
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

  const handleToggleStatus = async (brandIntegrationId, currentIsActive) => {
    try {
      const response = await apiInstanceFetch.put(`brand-integration/${brandIntegrationId}`, {
        isActive: !currentIsActive
      });

      if (response.status) {
        toast.success(`Brand integration ${!currentIsActive ? 'activated' : 'deactivated'} successfully`);
        fetchBrandIntegrations();
      } else {
        toast.error(response.message || "Failed to update brand integration status");
      }
    } catch (error) {
      console.error("Error updating brand integration status:", error);
      toast.error("Failed to update brand integration status");
    }
  };

  const handleAdd = () => {
    setEditingBrandIntegration(null);
    setDialogOpen(true);
  };

  const handleEdit = (brandIntegration) => {
    setEditingBrandIntegration(brandIntegration);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBrandIntegration(null);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingBrandIntegration(null);
    fetchBrandIntegrations();
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setSearchValue(value);
    // Implement search logic if needed
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getCampaignStatus = (brandIntegration) => {
    if (!brandIntegration.isActive) {
      return { label: "INACTIVE", className: "badge-secondary" };
    }

    const now = new Date();
    const startDate = new Date(brandIntegration.startDate);
    const endDate = new Date(brandIntegration.endDate);

    if (now < startDate) {
      return { label: "SCHEDULED", className: "badge-warning" };
    } else if (now > endDate) {
      return { label: "EXPIRED", className: "badge-danger" };
    } else {
      return { label: "ACTIVE", className: "badge-success" };
    }
  };

  const getTargetScope = (brandIntegration) => {
    // Check if any placement has allLiveSeries target
    const hasAllLiveSeries = brandIntegration.placements?.some(placement => 
      placement.target?.some(t => t.allLiveSeries === true)
    );
    
    if (hasAllLiveSeries) {
      return { label: "All Live Series", className: "badge-success" };
    }
    
    // Check if has specific episodes
    const hasSpecificEpisodes = brandIntegration.placements?.some(placement =>
      placement.target?.some(t => Array.isArray(t.episodes) && t.episodes.length > 0)
    );
    
    if (hasSpecificEpisodes) {
      return { label: "Specific Episodes", className: "badge-info" };
    }
    
    return { label: "Specific Series", className: "badge-primary" };
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid" style={{ overflowX: "hidden" }}>
          <div className="header_heading p_zero">
            <h3>Brand Integrations</h3>
            <div className="header_heading_right_col">
              <form className="position-relative">
                <div className="form-group mb-0 d-flex mr-3 position-relative">
                  <img
                    src={Search}
                    width="23px"
                    height="23px"
                    className="search_icon"
                    alt="Search"
                  />
                  <input
                    type="search"
                    className="form-control"
                    id="input-search"
                    placeholder="Search"
                    aria-controls="user-list-table"
                    onChange={handleSearch}
                    value={searchValue}
                  />
                </div>
              </form>

              <button
                type="button"
                className="btn dark-icon btn-primary"
                id="create-btn"
                onClick={handleAdd}
              >
                <i className="ri-add-line align-bottom me-1 fs-6"></i> Add Brand Integration
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
                      <th className="tableAlign">Brand</th>
                      <th className="tableAlign">Campaign Name</th>
                      <th className="tableAlign">User Category</th>
                      <th className="tableAlign">Priority</th>
                      <th className="tableAlign">Placements</th>
                      <th className="tableAlign">Target Scope</th>
                      <th className="tableAlign">Start Date</th>
                      <th className="tableAlign">End Date</th>
                      <th className="tableAlign">Status</th>
                      <th className="tableAlign">Created At</th>
                      <th className="tableAlign">Active</th>
                      <th className="tableAlign">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="13" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : brandIntegrations.length === 0 ? (
                      <tr>
                        <td colSpan="13" className="text-center">
                          No brand integrations found
                        </td>
                      </tr>
                    ) : (
                      brandIntegrations.map((brandIntegration, index) => (
                        <tr key={brandIntegration._id}>
                          <td className="pr-3 tableAlign">
                            {(activePage - 1) * rowsPerPage + index + 1}
                          </td>
                          <td className="pr-3 tableAlign">
                            {brandIntegration.brand?.name || "-"}
                          </td>
                          <td className="pr-3 tableAlign">
                            {brandIntegration.campaignName || "-"}
                          </td>
                          <td className="pr-3 tableAlign">
                            <div className="d-flex flex-wrap gap-1">
                              {brandIntegration.userCategory && Array.isArray(brandIntegration.userCategory) && brandIntegration.userCategory.length > 0 ? (
                                brandIntegration.userCategory.map((category) => (
                                  <span 
                                    key={category} 
                                    className={`badge badge-pill ${
                                      category === "FREE" 
                                        ? "badge-secondary" 
                                        : category === "FREE-TRAIL" 
                                          ? "badge-info" 
                                          : "badge-warning"
                                    }`}
                                    style={{ 
                                      fontSize: "10px",
                                      marginRight: "3px",
                                      marginBottom: "3px",
                                      color: category === "PREMIUM" ? "#000" : "#fff"
                                    }}
                                  >
                                    {category}
                                  </span>
                                ))
                              ) : (
                                <span className="badge badge-pill badge-secondary" style={{ fontSize: "10px" }}>ALL</span>
                              )}
                            </div>
                          </td>
                          <td className="pr-3 tableAlign">
                            <span className="badge badge-pill badge-info">
                              {brandIntegration.priority || 0}
                            </span>
                          </td>
                          <td className="pr-3 tableAlign">
                            <span className="badge badge-pill badge-primary">
                              {brandIntegration.placements?.length || 0} placement(s)
                            </span>
                          </td>
                          <td className="pr-3 tableAlign">
                            {(() => {
                              const scope = getTargetScope(brandIntegration);
                              return (
                                <span className={`badge badge-pill ${scope.className}`}>
                                  {scope.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="pr-3 tableAlign">
                            {formatDate(brandIntegration.startDate)}
                          </td>
                          <td className="pr-3 tableAlign">
                            {formatDate(brandIntegration.endDate)}
                          </td>
                          <td className="pr-3 tableAlign">
                            {(() => {
                              const status = getCampaignStatus(brandIntegration);
                              return (
                                <span className={`badge badge-pill ${status.className}`}>
                                  {status.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="pr-3 tableAlign">
                            {formatDate(brandIntegration.createdAt)}
                          </td>
                          <td className="pr-3 tableAlign">
                            <Switch
                              checked={brandIntegration.isActive}
                              onChange={() =>
                                handleToggleStatus(brandIntegration._id, brandIntegration.isActive)
                              }
                              color="primary"
                              size="small"
                            />
                          </td>
                          <td className="pr-3 tableAlign">
                            <button
                              type="button"
                              className="btn iq-bg-primary btn-sm"
                              onClick={() => handleEdit(brandIntegration)}
                              title="Edit"
                            >
                              <i
                                className="ri-pencil-fill"
                                style={{ fontSize: "19px" }}
                              />
                            </button>
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
                userTotal={totalBrandIntegrations}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <BrandIntegrationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        brandIntegrationData={editingBrandIntegration}
      />
    </>
  );
};

export default BrandIntegration;
