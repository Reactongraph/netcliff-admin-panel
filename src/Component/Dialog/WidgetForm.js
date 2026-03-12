import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { apiInstanceFetch } from "../../util/api";
import { Switch, Typography } from "@mui/material";

const WidgetForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    order: 0,
    isActive: true,
    clickAble: true,
    customApi: "",
    customApiEnabled: false,
    customApiRequiresAuth: false
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({
    title: "",
    type: "",
    order: "",
    customApi: ""
  });

  const history = useHistory();
  const { widgetId } = useParams();

  const widgetTypes = [
    { value: 1, label: "Hero Widget (1:1 Thumbnails)" },
    { value: 2, label: "Top 10 Widget (9:16 Thumbnails)" },
    { value: 3, label: "Small Thumbnails (9:16)" },
    { value: 4, label: "Large Thumbnails (9:16)" },
    { value: 5, label: "Grid" }
  ];

  useEffect(() => {
    if (widgetId) {
      setIsEdit(true);
      fetchWidget();
    }
  }, [widgetId]);

  const fetchWidget = async () => {
    try {
      setLoading(true);
      const response = await apiInstanceFetch.get(`widget/${widgetId}`);

      if (response.status) {
        const widget = response.widget;
        setFormData({
          title: widget.title || "",
          type: widget.type || "",
          order: widget.order || 0,
          isActive: widget.isActive !== undefined ? widget.isActive : true,
          clickAble: widget.clickAble !== undefined ? widget.clickAble : true,
          customApi: widget.customApi || "",
          customApiEnabled: widget.customApiEnabled !== undefined ? widget.customApiEnabled : false,
          customApiRequiresAuth: widget.customApiRequiresAuth !== undefined ? widget.customApiRequiresAuth : false
        });
      }
    } catch (error) {
      console.error("Error fetching widget:", error);
      toast.error("Failed to fetch widget details");
      history.push("/admin/widget");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: value
    }));

    if (!value || value === "select Type") {
      setError(prev => ({
        ...prev,
        type: "Type is Required!"
      }));
    } else {
      setError(prev => ({
        ...prev,
        type: ""
      }));
    }
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const handleClickableChange = (e) => {
    setFormData(prev => ({
      ...prev,
      clickAble: e.target.checked
    }));
  };

  const handleCustomApiEnabledChange = (e) => {
    const isEnabled = e.target.checked;
    setFormData(prev => ({
      ...prev,
      customApiEnabled: isEnabled,
      // Reset auth requirement and API when disabled
      customApiRequiresAuth: isEnabled ? prev.customApiRequiresAuth : false,
      customApi: isEnabled ? prev.customApi : ""
    }));

    // Clear custom API error when disabled
    if (!isEnabled && error.customApi) {
      setError(prev => ({
        ...prev,
        customApi: ""
      }));
    }
  };

  const handleCustomApiRequiresAuthChange = (e) => {
    setFormData(prev => ({
      ...prev,
      customApiRequiresAuth: e.target.checked
    }));
  };

  const validateForm = () => {
    const newError = {
      title: "",
      type: "",
      order: "",
      customApi: ""
    };

    if (!formData.type || formData.type === "select Type") {
      newError.type = "Type is Required!";
    }

    if (formData.order < 0) {
      newError.order = "Order must be a positive number";
    }

    // Validate custom API when enabled
    if (formData.customApiEnabled && !formData.customApi.trim()) {
      newError.customApi = "Custom API is required when enabled";
    }

    setError(newError);

    return !newError.type && !newError.order && !newError.customApi;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        type: parseInt(formData.type) // Convert string to number
      };

      let response;
      if (isEdit) {
        response = await apiInstanceFetch.put(`widget/${widgetId}`, submitData);
      } else {
        response = await apiInstanceFetch.post(`widget`, submitData);
      }

      if (response.status) {
        toast.success(isEdit ? "Widget updated successfully" : "Widget created successfully");
        history.push("/admin/widget");
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving widget:", error);
      toast.error(error.message || "Failed to save widget");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push("/admin/widget");
  };

  if (loading && isEdit) {
    return (
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="iq-card">
            <div className="iq-card-body text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>{isEdit ? "Edit Widget" : "Create New Widget"}</h3>
          </div>

          <div className="iq-card mb-5">
            <div className="iq-card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter widget title (optional)"
                      />
                      {error.title && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            style={{
                              fontFamily: "Circular-Loom",
                              color: "#ee2e47",
                            }}
                          >
                            {error.title}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="type" className="form-label">Type *</label>
                      <select
                        name="type"
                        className="form-control form-control-line selector"
                        id="type"
                        value={formData.type}
                        onChange={handleTypeChange}
                      >
                        <option value="select Type">Select Type</option>
                        {widgetTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {error.type && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            style={{
                              fontFamily: "Circular-Loom",
                              color: "#ee2e47",
                            }}
                          >
                            {error.type}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="order" className="form-label">Order</label>
                      <input
                        type="number"
                        className="form-control"
                        id="order"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        placeholder="Enter display order"
                        min="0"
                      />
                      <small className="form-text text-muted">
                        Lower numbers appear first
                      </small>
                      {error.order && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            style={{
                              fontFamily: "Circular-Loom",
                              color: "#ee2e47",
                            }}
                          >
                            {error.order}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <div className="exclusiveContainer">
                        <div>
                          <Switch
                            checked={formData.isActive}
                            onChange={handleStatusChange}
                            color="primary"
                            name="isActive"
                            inputProps={{
                              "aria-label": "primary checkbox",
                            }}
                          />
                        </div>
                        <label className="float-left">Active</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Clickable</label>
                      <div className="exclusiveContainer">
                        <div>
                          <Switch
                            checked={formData.clickAble}
                            onChange={handleClickableChange}
                            color="primary"
                            name="clickAble"
                            inputProps={{
                              "aria-label": "clickable checkbox",
                            }}
                          />
                        </div>
                        <label className="float-left">Clickable</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Custom API Enabled</label>
                      <div className="exclusiveContainer">
                        <div>
                          <Switch
                            checked={formData.customApiEnabled}
                            onChange={handleCustomApiEnabledChange}
                            color="primary"
                            name="customApiEnabled"
                            inputProps={{
                              "aria-label": "custom api enabled checkbox",
                            }}
                          />
                        </div>
                        <label className="float-left">Enable Custom API</label>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.customApiEnabled && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="customApi" className="form-label">Custom API *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="customApi"
                            name="customApi"
                            value={formData.customApi}
                            onChange={handleInputChange}
                            placeholder="Enter custom API path"
                          />
                          <small className="form-text text-muted">
                            API endpoint for dynamic content
                          </small>
                          {error.customApi && (
                            <div className="pl-1 text-left">
                              <Typography
                                variant="caption"
                                style={{
                                  fontFamily: "Circular-Loom",
                                  color: "#ee2e47",
                                }}
                              >
                                {error.customApi}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Custom API Requires Authentication</label>
                          <div className="exclusiveContainer">
                            <div>
                              <Switch
                                checked={formData.customApiRequiresAuth}
                                onChange={handleCustomApiRequiresAuthChange}
                                color="primary"
                                name="customApiRequiresAuth"
                                inputProps={{
                                  "aria-label": "custom api requires auth checkbox",
                                }}
                              />
                            </div>
                            <label className="float-left">Requires Authentication</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        {isEdit ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {isEdit ? "Update Widget" : "Create Widget"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetForm; 