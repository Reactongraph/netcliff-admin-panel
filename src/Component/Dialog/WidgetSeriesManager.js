import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { apiInstanceFetch } from "../../util/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Search from "../assets/images/search.png";
import noImage from "../assets/images/movieDefault.png";
import { handleImageError } from "../../util/helperFunctions";

const WidgetSeriesManager = () => {
  const [widget, setWidget] = useState(null);
  const [assignedSeries, setAssignedSeries] = useState([]);
  const [assignedSeriesData, setAssignedSeriesData] = useState([]);
  const [availableSeries, setAvailableSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [orderInputs, setOrderInputs] = useState({});
  const [debounceTimers, setDebounceTimers] = useState({});
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);

  const history = useHistory();
  const { widgetId } = useParams();

  useEffect(() => {
    if (widgetId) {
      fetchWidgetData();
      fetchAvailableSeries("");
    }
  }, [widgetId]);

  const fetchWidgetData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiInstanceFetch.get(`widget/${widgetId}/series`);

      if (response.status) {
        setWidget(response.widget);
        setAssignedSeries(response.widget.seriesIds || []);
        
        // Use seriesData directly from API - no need to populate from availableSeries
        setAssignedSeriesData(response.widget.seriesData || []);
      }
    } catch (error) {
      console.error("Error fetching widget data:", error);
      toast.error("Failed to fetch widget data");
    } finally {
      setLoading(false);
    }
  }, [widgetId]);

  const fetchAvailableSeries = useCallback(async (searchTerm = "") => {
    try {
      setSeriesLoading(true);
      const limit = 50; // Show top 50 matching results
      
      // Use the same API as TvSeries.js to fetch best matching web series
      const response = await apiInstanceFetch.get(
        `movie/all?type=WEBSERIES&start=1&limit=${limit}&search=${searchTerm}&featured=false&newReleased=false&status=PUBLISHED`
      );

      if (response.status) {
        const newSeries = response.movie || [];
        setAvailableSeries(newSeries);
      }
    } catch (error) {
      console.error("Error fetching available series:", error);
      toast.error("Failed to fetch available series");
    } finally {
      setSeriesLoading(false);
    }
  }, []);

  const handleAddSeries = useCallback(async (seriesId) => {
    try {
      const response = await apiInstanceFetch.post(`widget/${widgetId}/series`, {
        seriesId
      });

      if (response.status) {
        toast.success("Series added to widget successfully");
        // Refresh widget data to get updated seriesData from API
        fetchWidgetData();
      } else {
        toast.error(response.message || "Failed to add series");
      }
    } catch (error) {
      console.error("Error adding series:", error);
      toast.error("Failed to add series to widget");
    }
  }, [widgetId, fetchWidgetData]);

  const handleRemoveSeries = useCallback(async (seriesId) => {
    try {
      const response = await apiInstanceFetch.delete(`widget/${widgetId}/series/${seriesId}`);

      if (response.status) {
        toast.success("Series removed from widget successfully");
        // Refresh widget data to get updated seriesData from API
        fetchWidgetData();
      } else {
        toast.error(response.message || "Failed to remove series");
      }
    } catch (error) {
      console.error("Error removing series:", error);
      toast.error("Failed to remove series from widget");
    }
  }, [widgetId, fetchWidgetData]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(assignedSeries);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAssignedSeries(items);

    try {
      const response = await apiInstanceFetch.put(`widget/${widgetId}/series/reorder`, {
        seriesIds: items
      });

      if (response.status) {
        toast.success("Series reordered successfully");
      } else {
        toast.error(response.message || "Failed to reorder series");
        // Revert on error
        fetchWidgetData();
      }
    } catch (error) {
      console.error("Error reordering series:", error);
      toast.error("Failed to reorder series");
      // Revert on error
      fetchWidgetData();
    }
  };

  const handleOrderChange = async (seriesId, newOrder) => {
    if (newOrder < 1 || newOrder > assignedSeries.length) {
      toast.error(`Order must be between 1 and ${assignedSeries.length}`);
      return;
    }

    const currentIndex = assignedSeries.indexOf(seriesId);
    if (currentIndex === -1) return;

    const items = Array.from(assignedSeries);
    const [movedItem] = items.splice(currentIndex, 1);
    items.splice(newOrder - 1, 0, movedItem);

    setAssignedSeries(items);

    try {
      const response = await apiInstanceFetch.put(`widget/${widgetId}/series/reorder`, {
        seriesIds: items
      });

      if (response.status) {
        toast.success("Series order updated successfully");
      } else {
        toast.error(response.message || "Failed to update series order");
        // Revert on error
        fetchWidgetData();
      }
    } catch (error) {
      console.error("Error updating series order:", error);
      toast.error("Failed to update series order");
      // Revert on error
      fetchWidgetData();
    }
  };

  const handleOrderInputChange = useCallback((seriesId, newOrder) => {
    // Clear existing timer for this series
    if (debounceTimers[seriesId]) {
      clearTimeout(debounceTimers[seriesId]);
    }

    // Update the input value immediately for responsive UI
    setOrderInputs(prev => ({
      ...prev,
      [seriesId]: newOrder
    }));

    // Set a new timer for debounced API call
    const timer = setTimeout(() => {
      if (newOrder >= 1 && newOrder <= assignedSeries.length) {
        handleOrderChange(seriesId, newOrder);
      }
    }, 2000); // 2 seconds delay

    setDebounceTimers(prev => ({
      ...prev,
      [seriesId]: timer
    }));
  }, [assignedSeries.length, debounceTimers]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [debounceTimers, searchDebounceTimer]);

  // Update order inputs when assigned series changes
  useEffect(() => {
    const newOrderInputs = {};
    assignedSeries.forEach((seriesId, index) => {
      newOrderInputs[seriesId] = index + 1;
    });
    setOrderInputs(newOrderInputs);
  }, [assignedSeries]);

  // No longer needed - seriesData comes directly from API
  // Populate assigned series data when availableSeries changes
  // useEffect(() => {
  //   if (availableSeries.length > 0 && assignedSeries.length > 0) {
  //     const missingData = assignedSeries.filter(seriesId => 
  //       !assignedSeriesData.find(s => s._id === seriesId)
  //     );
      
  //     if (missingData.length > 0) {
  //       const newData = missingData.map(seriesId => 
  //         availableSeries.find(s => s._id === seriesId)
  //       ).filter(Boolean);
        
  //       if (newData.length > 0) {
  //         setAssignedSeriesData(prev => [...prev, ...newData]);
  //       }
  //     }
  //   }
  // }, [availableSeries, assignedSeries, assignedSeriesData]);

  // Debounced search function
  const handleSearchChange = (searchTerm) => {
    setSearch(searchTerm);
    
    // Clear existing search timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // Set new timer for debounced search
    const timer = setTimeout(() => {
      fetchAvailableSeries(searchTerm);
    }, 800); // 800ms delay
    
    setSearchDebounceTimer(timer);
  };

  const handleBack = () => {
    history.push("/admin/widget");
  };

  const filteredAvailableSeries = useMemo(() => 
    availableSeries.filter(series => !assignedSeries.includes(series._id)),
    [availableSeries, assignedSeries]
  );

  if (loading && !widget) {
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
        <div className="container-fluid" style={{ overflowX: "hidden" }}>
          <div className="header_heading p_zero">
            <h3>Manage Series - {widget?.title || `Widget ${widgetId}`}</h3>
            <div className="header_heading_right_col">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
              >
                <i className="ri-arrow-left-line me-1"></i> Back to Widgets
              </button>
            </div>
          </div>

          <div className="row">

            {/* Assigned Series */}
            <div className="col-md-6">
              <div className="iq-card mb-4">

                <div className="iq-card-body mt-6">
                  {assignedSeries.length > 0 && (
                    <div className="alert alert-info alert-sm mb-3" style={{ fontSize: "12px", padding: "8px 12px", height: "54px" }}>
                      <i className="ri-information-line me-1"></i>
                      Drag to reorder or use the number inputs (1-{assignedSeries.length}). Changes save automatically after 2 seconds.
                    </div>
                  )}
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="assigned-series">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="series-list"
                        >
                          {assignedSeries.map((seriesId, index) => {
                            // Use assignedSeriesData if available, otherwise fallback to availableSeries
                            let series = assignedSeriesData.find(s => s._id === seriesId);
                            if (!series) {
                              series = availableSeries.find(s => s._id === seriesId);
                            }
                            if (!series) return null;

                            return (
                              <Draggable key={seriesId} draggableId={seriesId} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`series-item d-flex align-items-center p-2 border-bottom ${snapshot.isDragging ? 'dragging' : ''}`}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="drag-handle mr-2"
                                    >
                                      <i className="ri-drag-move-2-line"></i>
                                    </div>
                                    <img
                                      src={series.thumbnail || noImage}
                                      alt={series.title}
                                      className="mr-3"
                                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                      onError={(e) => handleImageError(e, noImage)}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="m-0">{series.title}</h6>
                                      <small className="text-muted">{series.region?.name}</small>
                                    </div>
                                    <div className="d-flex align-items-center mr-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max={assignedSeries.length}
                                        value={orderInputs[seriesId] !== undefined ? orderInputs[seriesId] : index + 1}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          // Allow empty input for editing
                                          if (value === '') {
                                            setOrderInputs(prev => ({
                                              ...prev,
                                              [seriesId]: ''
                                            }));
                                            return;
                                          }
                                          
                                          const newOrder = parseInt(value);
                                          if (!isNaN(newOrder)) {
                                            // Validate order range
                                            if (newOrder < 1 || newOrder > assignedSeries.length) {
                                              toast.warning(`Order must be between 1 and ${assignedSeries.length}`);
                                              return;
                                            }
                                            handleOrderInputChange(seriesId, newOrder);
                                          } else {
                                            // Non-numeric input
                                            toast.warning('Please enter a valid number');
                                          }
                                        }}
                                        onBlur={(e) => {
                                          // If input is empty or invalid, reset to current position
                                          const value = e.target.value;
                                          if (value === '' || isNaN(parseInt(value))) {
                                            setOrderInputs(prev => ({
                                              ...prev,
                                              [seriesId]: index + 1
                                            }));
                                            if (value !== '') {
                                              toast.info('Order reset to current position');
                                            }
                                          }
                                        }}
                                        className="form-control form-control-sm"
                                        style={{ width: "60px", textAlign: "center" }}
                                        title={`Enter order number (1-${assignedSeries.length})`}
                                        placeholder={`1-${assignedSeries.length}`}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleRemoveSeries(seriesId)}
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                          {assignedSeries.length === 0 && (
                            <div className="text-center p-3">
                              <p className="text-muted">No series assigned to this widget</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>

            {/* Available Series */}
            <div className="col-md-6">
              <div className="iq-card mb-4">
                <div className="iq-card-header">
                  <h5>Available Series</h5>
                  <div className="form-group mb-0">
                    <div className="input-group">
                      <img
                        src={Search}
                        width="20px"
                        height="20px"
                        className="search_icon"
                      />
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search available series"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="iq-card-body">
                  {seriesLoading ? (
                    <div className="text-center p-3">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="series-list">
                      {filteredAvailableSeries.map((series) => (
                        <div key={series._id} className="series-item d-flex align-items-center p-2 border-bottom">
                          <img
                            src={series.thumbnail || noImage}
                            alt={series.title}
                            className="mr-3"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            onError={(e) => handleImageError(e, noImage)}
                          />
                          <div className="flex-grow-1">
                            <h6 className="m-0">{series.title}</h6>
                            <small className="text-muted">{series.region?.name}</small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAddSeries(series._id)}
                          >
                            <i className="ri-add-line"></i> Add
                          </button>
                        </div>
                      ))}
                      {filteredAvailableSeries.length === 0 && (
                        <div className="text-center p-3">
                          <p className="text-muted">No available series found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetSeriesManager; 