import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { updateBadgeMetrics } from "../../store/Badge/badge.action";
import { CLOSE_METRICS_DIALOG } from "../../store/Badge/badge.type";

const BadgeMetricsDialog = (props) => {
  const { metricsDialog: open, metricsDialogData } = useSelector(
    (state) => state.badge
  );
  const dispatch = useDispatch();

  const [badgeId, setBadgeId] = useState("");
  const [category, setCategory] = useState("custom");
  const [metrics, setMetrics] = useState([]);
  const [selectedMetricType, setSelectedMetricType] = useState("views");

  const metricLabels = {
    views: "Min Views",
    clicks: "Min Clicks",
    watchTime: "Min Watch Time (hrs)",
    publishedAt: "Time Range",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: CLOSE_METRICS_DIALOG });
    props.updateBadgeMetrics(badgeId, { metrics });
  };

  const updateMetric = (index, field, value) => {
    const updated = [...metrics];
    updated[index][field] = value;
    setMetrics(updated);
  };

  const addMetric = (type) => {
    if (type && !metrics.find((m) => m.type === type)) {
      setMetrics([
        ...metrics,
        {
          type: type,
          minValue: 0,
          days: 7,
          weightage: 1,
          ...((type === "views" || type === "watchTime") && { minValue: 0 }),
        },
      ]);
    }
  };

  const removeMetric = (index) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const availableMetricTypes = [
    "views",
    "watchTime",
    "clicks",
    "publishedAt",
  ].filter((type) => {
    if (category === "views-based") return type === "views";
    if (category === "published-based") return type === "publishedAt";
    if (category === "custom")
      return type !== "publishedAt" && !metrics.find((m) => m.type === type);
    return false;
  });

  useEffect(() => {
    if (!open) {
      setMetrics([]);
      setBadgeId("");
      setCategory("custom");
      setSelectedMetricType("views");
    }
  }, [open]);

  useEffect(() => {
    if (metricsDialogData) {
      setBadgeId(metricsDialogData._id);
      const currentCategory = metricsDialogData.category || "custom";
      setCategory(currentCategory);
      let metricsData = Array.isArray(metricsDialogData.metrics)
        ? metricsDialogData.metrics
        : [];

      // Initialize default metrics for specific categories if empty
      if (metricsData.length === 0) {
        if (currentCategory === "views-based") {
          metricsData = [{ type: "views", minValue: 0, days: 7, weightage: 1 }];
        } else if (currentCategory === "published-based") {
          metricsData = [
            { type: "publishedAt", minValue: 0, days: 7, weightage: 1 },
          ];
        }
      }
      setMetrics(metricsData);
    }
  }, [metricsDialogData]);

  // Auto-selection effect removed to support "Select to Add" pattern

  const handleClose = () => {
    dispatch({ type: CLOSE_METRICS_DIALOG });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <h5>Badge Metrics - {metricsDialogData?.name}</h5>
      </DialogTitle>

      <Tooltip title="Close">
        <CancelIcon
          className="cancelButton"
          sx={{
            position: "absolute",
            top: "23px",
            right: "15px",
            color: "#fff",
          }}
          onClick={handleClose}
        />
      </Tooltip>

      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <div className="d-flex flex-column">
            <form>
              <div className="form-group">
                {category === "custom" && availableMetricTypes.length > 0 && (
                  <div className="row mb-2">
                    <div className="col-md-12">
                      <select
                        className="form-control form-control-line"
                        value=""
                        onChange={(e) => addMetric(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Metric to Add...
                        </option>
                        {availableMetricTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "views"
                              ? "Views"
                              : type === "watchTime"
                              ? "Watch Time"
                              : type === "clicks"
                              ? "Clicks"
                              : "Published Date"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {(category === "trending" || category === "editors-choice") && (
                  <div className="row mb-2">
                    <div className="col-md-12 text-center text-danger">
                      Metrics for this category are not editable.
                    </div>
                  </div>
                )}

                {metrics.map((metric, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-md-12 mb-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="styleForTitle m-0">
                          {metric.type === "views"
                            ? "Views Criteria" :
                            metric.type === "clicks"
                            ? "Clicks Criteria"
                            : metric.type === "publishedAt"
                            ? "Published Date Criteria"
                            : "Watch Time Criteria"}
                        </h6>
                        {category === "custom" && (
                          <IconButton
                            size="small"
                            onClick={() => removeMetric(index)}
                          >
                            <DeleteIcon
                              style={{ fontSize: 18, color: "#d32f2f" }}
                            />
                          </IconButton>
                        )}
                      </div>
                    </div>

                    <div
                      className={
                        metrics.length > 1 ? "col-md-5 my-1" : "col-md-6 my-1"
                      }
                    >
                      <label className="styleForTitle mb-2">
                        {metricLabels[metric.type]}
                      </label>
                      {metric.type !== "publishedAt" && (
                        <input
                          type="number"
                          placeholder="1"
                          className="form-control"
                          min="1"
                          value={metric.minValue}
                          onChange={(e) =>
                            updateMetric(index, "minValue", e.target.value)
                          }
                          disabled={
                            category === "trending" ||
                            category === "editors-choice"
                          }
                        />
                      )}
                    </div>

                    <div
                      className={
                        metrics.length > 1 ? "col-md-4 my-1" : "col-md-6 my-1"
                      }
                    >
                      <label className="styleForTitle mb-2">Last N Days</label>
                      <select
                        className="form-control form-control-line"
                        value={metric.days}
                        onChange={(e) =>
                          updateMetric(index, "days", e.target.value)
                        }
                      >
                        <option value="1">1 Day</option>
                        <option value="3">3 Days</option>
                        <option value="7">7 Days</option>
                        <option value="15">15 Days</option>
                      </select>
                    </div>

                    {metrics.length > 1 && metric.type !== "publishedAt" && (
                      <div className="col-md-3 my-1">
                        <label className="styleForTitle mb-2">
                          Weightage
                          <Tooltip title="Weightage determines the importance of this metric (1-5). Higher values mean this metric contributes more to badge assignment.">
                            <InfoIcon
                              sx={{
                                fontSize: 16,
                                ml: 1,
                                cursor: "pointer",
                                verticalAlign: "middle",
                              }}
                            />
                          </Tooltip>
                        </label>
                        <select
                          className="form-control form-control-line"
                          value={metric.weightage}
                          onChange={(e) =>
                            updateMetric(index, "weightage", e.target.value)
                          }
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}

                {metrics.length === 0 && (
                  <div className="row">
                    <div className="col-md-12 text-center text-muted">
                      No metrics added yet. Add a metric to get started.
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </DialogContent>

      <div>
        <hr className="dia_border w-100"></hr>
      </div>

      <DialogActions>
        <button
          type="button"
          className="btn btn-danger btn-sm px-3 py-1 mb-3"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
          onClick={handleSubmit}
        >
          Update
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default connect(null, { updateBadgeMetrics })(BadgeMetricsDialog);
