import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Select,
  MenuItem,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpIcon from "@mui/icons-material/Help";
import ReactApexChart from "react-apexcharts";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { apiInstanceFetch } from "../../util/api";
import { toast } from "react-toastify";
import { getAdminCreateLiveTv } from "../../store/LiveTv/liveTv.action";
import { useDispatch } from "react-redux";
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: "8px",
}));

const TimeButton = styled("button")(({ theme, active }) => ({
  padding: "8px 16px",
  margin: "0 4px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  background: active ? "#fc7c05" : "white",
  color: active ? "white" : "black",
  cursor: "pointer",
  "&:hover": {
    background: active ? "#fc7c05" : "#f5f5f5",
  },
}));
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
const Analytics = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const channelId = queryParams.get("channelId");
  const { adminCreateLiveTv } = useSelector((state) => state.liveTv);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState({
    label: "7 Days",
    value: 7,
  });
  const [tabValue, setTabValue] = useState(0);
  const [channelData, setChannelData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    views: 0,
    viewingHours: 0,
    devices: [],
    locations: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
      dispatch(getAdminCreateLiveTv());  // Fetch live TV channels
  }, [dispatch]);
  useEffect(() => {
    if (adminCreateLiveTv?.length > 0) {
      let defaultChannel;
  
      if (channelId) {
        defaultChannel = adminCreateLiveTv.find((ch) => ch._id === channelId);
      }
  
      if (defaultChannel) {
        setSelectedChannel(defaultChannel.channelName);
        setChannelData(defaultChannel);
      } else {
        const firstChannel = adminCreateLiveTv[0];
        setSelectedChannel(firstChannel.channelName);
        setChannelData(firstChannel);
        // Update URL so it's always in sync
        history.replace(`/admin/analytics?channelId=${firstChannel._id}`);
      }
    }
  }, [channelId, adminCreateLiveTv, history]);
  

  // Fetch analytics data when channel changes
  const fetchAnalyticsData = async (afterDate) => {
    if (!channelData?._id) return;

    setLoading(true);
    setError(null);
    try {
      let url = `tv-watch-session/analytics/channel/${channelData._id}`;
      
      if (selectedPeriod.startDate && selectedPeriod.endDate) {
        url += `?startDate=${selectedPeriod.startDate}&endDate=${selectedPeriod.endDate}`;
      } else if (afterDate) {
        url += `?afterDate=${afterDate}`;
      }

      const response = await apiInstanceFetch.get(url);
      if (response.status) {
        setAnalyticsData(response.data);
        // Show success toast if data is fetched successfully
        // toast.success("Analytics data loaded successfully");
      } else {
        const errorMessage =
          response.message || "Failed to fetch analytics data";
        setError(errorMessage);
        // Show error toast
        // toast.error(errorMessage);
        // Reset analytics data when there's an error
        setAnalyticsData({
          views: 0,
          viewingHours: 0,
          deviceInstalls: 0,
          devices: [],
          locations: [],
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      const errorMessage = "An error occurred while fetching analytics data";
      setError(errorMessage);
      // Show error toast
      // toast.error(errorMessage);
      // Reset analytics data when there's an error
      setAnalyticsData({
        views: 0,
        viewingHours: 0,
        deviceInstalls: 0,
        devices: [],
        locations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(selectedPeriod?.value || null);
  }, [channelData, selectedPeriod]);
  const getDeviceColor = (label) => {
    const colorMap = {
      Roku: "#8B0000",
      "Fire TV": "#B22222",
      "Apple TV": "#A9A9A9",
      "Android TV": "#90EE90",
      "Web Player": "#FFFF99",
      Android: "#7B68EE",
      IOS: "#000000",
    };
    return colorMap[label] || "#000000";
  };
  // Update chart data with real data
  const chartData = analyticsData.devices.map((device) => ({
    ...device,
    color: getDeviceColor(device.label),
  }));

  // Helper function to get device colors

  const handleChannelChange = (event) => {
    const channelName = event.target.value;
    setSelectedChannel(channelName);

    // Find and set the channel data
    const channel = adminCreateLiveTv.find(
      (ch) => ch.channelName === channelName
    );
    if (channel) {
      setChannelData(channel);
      // Update URL with new channel ID without page reload
      history.replace(`/admin/analytics?channelId=${channel._id}`);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  console.log("chartData", chartData);

  let viewersChartOptions = {
    chart: {
      type: "donut",
    },
    labels: chartData.map((item) => item.label),
    colors: chartData.map((item) => item.color),
    legend: {
      show: false, // Hide default legend to use custom legend
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Add custom date range handler
  const handleCustomDateRange = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  // Add date range apply handler
  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      setSelectedPeriod({
        label: `Custom (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`,
        value: daysDiff,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      setShowDatePicker(false);
    }
  };

  const handleQuickSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setDateRange([start, end]);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDateRange([start, end]);
  };

  return (
    <div id="content-page" className="content-page">
      <div className="container-fluid">
      <div className="custom_page_wrapper">
        <div className="header_heading p_zero" style={{paddingLeft:"14px"}}>
  <h3>Analytics Overview</h3>
</div>

        <div className="layout-top-spacing">
          {/* Channel Selection and Time Period */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // mb: 3,
              // paddingLeft:"16px"
            }}

          >
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }} style={{paddingLeft:"14px"}}>
              <Typography variant="h6" sx={{fontWeight:350}}>Channel Selected:</Typography>
              <Select
                value={selectedChannel}
                onChange={handleChannelChange}
                size="small"
                sx={{
                  minWidth: 200,
                  color: "black",
                  "& .MuiSelect-select": {
                    color: "black !important", // Ensures the selected text is black
                  },
                  "& .MuiSelect-icon": {
                    color: "#fc7c05", // Sets the dropdown icon color to orange
                  },
                }}
                displayEmpty
                IconComponent={(props) => (
                  <ArrowDropDownIcon
                    {...props}
                    sx={{ color: "#fc7c05 !important" }}
                  />
                )}
              >
                {!selectedChannel && <MenuItem value="">Select a channel</MenuItem>}
                {adminCreateLiveTv?.map((channel) => (
                  <MenuItem key={channel._id} value={channel.channelName}>
                    {channel.channelName}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              {[
                { label: "7 Days", value: 7 },
                { label: "30 Days", value: 30 },
                { label: "3 Months", value: 90 },
                { label: "1 Year", value: 365 },
              ].map((period) => (
                <TimeButton
                  key={period.value}
                  active={selectedPeriod.value === period.value && !selectedPeriod.startDate}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period.label}
                </TimeButton>
              ))}
              <TimeButton
                active={selectedPeriod.startDate !== undefined}
                onClick={handleCustomDateRange}
              >
                {selectedPeriod.startDate ? selectedPeriod.label : 'Custom'}
              </TimeButton>
            </Box>
          </Box>

          {/* Show channel details only when a channel is selected */}
          {channelData && (
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }} style={{paddingLeft:"14px"}}>
              Channel ID: {channelData._id} | Stream Type: {channelData.streamType || "N/A"}
            </Typography>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Typography>Loading analytics data...</Typography>
            </Box>
          )}

          {/* Enhanced Date Range Picker Dialog */}
          <Dialog 
            open={showDatePicker} 
            onClose={() => setShowDatePicker(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '8px',
                maxWidth: '360px',
              }
            }}
          >
            <DialogTitle sx={{ 
              borderBottom: '1px solid #eee', 
              padding: '16px 24px',
              fontSize: '18px',
              fontWeight: 500
            }}>
              Select Date Range
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Box>

                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    monthsShown={1}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                    inline
                    calendarClassName="custom-calendar"
                  />
                </Box>

                {startDate && endDate && (
                  <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    bgcolor: '#f8f9fa', 
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Selected Range:
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ 
              padding: '16px 24px', 
              borderTop: '1px solid #eee',
              '& .MuiButton-root': {
                textTransform: 'none',
                minWidth: '80px'
              }
            }}>
              <Button 
                onClick={() => {
                  setShowDatePicker(false);
                  setDateRange([null, null]);
                }}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDateRangeApply}
                variant="contained"
                disabled={!startDate || !endDate}
                sx={{ 
                  bgcolor: '#fc7c05', 
                  '&:hover': { 
                    bgcolor: '#e66a00' 
                  },
                  '&.Mui-disabled': { 
                    bgcolor: '#ffd3a6' 
                  }
                }}
              >
                Apply
              </Button>
            </DialogActions>
          </Dialog>

          <Divider />
          <Grid container alignItems={"stretch"}>
            <Grid item xs={12} md={6}>
              <StyledPaper
                sx={{
                  minHeight: 250,
                  p: 3,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: 6,
                    margin:"0 !important",
                  },
                  height: "90%",
                }}
              >
                {[
                  {
                    title: "Views",
                    value: analyticsData.views,
                    subtitle: "Total views",
                    icon: <VisibilityIcon color="primary" />,
                  },
                  {
                    title: "Viewing Hours",
                    value: analyticsData.viewingHours,
                    subtitle: "Total viewing hours",
                    icon: <VisibilityIcon color="primary" />,
                  },
                ].map((stat, idx) => (
                  <Box
                    key={stat.title}
                    sx={{
                      flex: 1,
                      textAlign: "center",
                      px: 2,
                      borderLeft: idx === 1 ? "1px solid #e0e0e0" : "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      {stat.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {stat.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                ))}
              </StyledPaper>
            </Grid>

            {/* How Viewers Watch Section */}
            <Grid item xs={6}>
              <StyledPaper
                sx={{
                  p: 3,
                  minHeight: 250,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: 6,
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  How Viewers Watch
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    {chartData.map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            backgroundColor: item.color,
                            borderRadius: "50%",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {`${item.label} - ${item.value}%`}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <ReactApexChart
                      options={viewersChartOptions}
                      series={chartData.map((item) => item.value)}
                      type="donut"
                      height={180}
                    />
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>

            {/* Top Locations Section */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Top Locations
                </Typography>
                {
                  analyticsData?.locations && analyticsData?.locations <= 0 && (
                    <Box sx={{textAlign: "center"}}>No data found.</Box>
                  )
                }
                <Box sx={{ minHeight: 270, maxHeight: 400, overflow: "auto" }}>
                  {analyticsData.locations.map((location, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Typography>{location.country}</Typography>
                      <Typography>{location.count}</Typography>
                    </Box>
                  ))}
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>
        </div>
        </div>
      </div>
    </div>
  );
};

// Update the styles with additional customizations
const styles = `
  .react-datepicker {
    font-family: inherit;
    border: none !important;
    box-shadow: none !important;
    width: 100%;
  }
  .custom-calendar {
    width: 100% !important;
  }
  .react-datepicker__month-container {
    width: 100%;
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #eee;
    padding: 16px 0 8px;
  }
  .react-datepicker__current-month {
    color: #333;
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 12px;
  }
  .react-datepicker__day-names {
    margin-top: 4px;
  }
  .react-datepicker__day-name {
    margin: 2px;
    width: 36px;
    color: #666;
    font-weight: 500;
  }
  .react-datepicker__day {
    margin: 2px;
    width: 36px;
    height: 36px;
    line-height: 36px;
    border-radius: 50%;
    color: #333;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background-color: #fc7c05;
    color: white;
    font-weight: 500;
  }
  .react-datepicker__day--in-selecting-range {
    background-color: #ffd3a6;
    color: #333;
  }
  .react-datepicker__day:hover {
    background-color: #fff3e5;
  }
  .react-datepicker__navigation {
    top: 18px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #666;
  }
  .react-datepicker__day--today {
    font-weight: bold;
    color: #fc7c05;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Analytics;
