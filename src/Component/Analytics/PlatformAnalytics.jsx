import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { apiInstanceFetch } from "../../util/api";
import ReactApexChart from "react-apexcharts";
import AnalyticsDataGrid from "./AnalyticsDataGrid";

const RootPaper = styled("div")(({ theme }) => ({
  padding: 0,
  margin: 0,
  borderRadius: 0,
  backgroundColor: "transparent",
}));

// Helper chart components kept inside this file for simplicity
const EventsTrendsChart = ({ summary }) => {
  const dailyTrends = summary?.dailyTrends || [];
  const eventTypeSummary = summary?.eventTypeSummary || [];

  const { options, series } = useMemo(() => {
    if (!dailyTrends.length) {
      return { options: {}, series: [] };
    }

    const topEvents = eventTypeSummary
      .slice()
      .sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0))
      .slice(0, 5)
      .map((e) => e.eventType);

    // Build a continuous daily range from min to max date, filling gaps with 0
    const sortedByDate = [...dailyTrends].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const startTs = new Date(sortedByDate[0].date).setHours(0, 0, 0, 0);
    const endTs = new Date(
      sortedByDate[sortedByDate.length - 1].date
    ).setHours(0, 0, 0, 0);

    const allDays = [];
    for (let ts = startTs; ts <= endTs; ts += 24 * 60 * 60 * 1000) {
      allDays.push(ts);
    }

    const visibleCount = 10;
    const minVisibleIndex =
      allDays.length > visibleCount ? allDays.length - visibleCount : 0;
    const minVisible = allDays[minVisibleIndex];
    const maxVisible = allDays[allDays.length - 1];

    const seriesData = topEvents.map((eventType) => ({
      name: eventType,
      data: allDays.map((ts) => {
        const isoDay = new Date(ts).toISOString().slice(0, 10);
        const match = dailyTrends.find(
          (d) => d.eventType === eventType && d.date === isoDay
        );
        return { x: ts, y: match ? match.count : 0 };
      }),
    }));

    return {
      options: {
        chart: {
          type: "line",
          height: 320,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        xaxis: {
          type: "datetime",
          min: minVisible,
          max: maxVisible,
          labels: {
            rotate: -45,
          },
        },
        stroke: { width: 2 },
        dataLabels: { enabled: false },
        legend: {
          position: "top",
        },
      },
      series: seriesData,
    };
  }, [dailyTrends, eventTypeSummary]);

  if (!series.length) return null;

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={320}
    />
  );
};

const TopContentChart = ({ topContent }) => {
  const { options, series } = useMemo(() => {
    if (!topContent || !topContent.length) {
      return { options: {}, series: [] };
    }

    const top = topContent.slice(0, 10);
    return {
      options: {
        chart: {
          type: "bar",
          height: 320,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        xaxis: {
          categories: top.map((t) => t.title || "Untitled"),
        },
        dataLabels: { enabled: false },
      },
      series: [
        {
          name: "Views",
          data: top.map((t) => t.thumbnailViews || 0),
        },
      ],
    };
  }, [topContent]);

  if (!series.length) return null;

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={320}
    />
  );
};

const PlatformAnalytics = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsPage, setSubsPage] = useState(1);
  const [subsHasNext, setSubsHasNext] = useState(false);

  const [usersAnalytics, setUsersAnalytics] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersHasNext, setUsersHasNext] = useState(false);

  const [error, setError] = useState(null);

  const fetchData = async (options = {}) => {
    const { subsPageOverride, usersPageOverride } = options;

    const subsPageToUse = subsPageOverride || subsPage;
    const usersPageToUse = usersPageOverride || usersPage;

    setLoading(true);
    setError(null);
    try {
      const [summaryRes, topContentRes, subsRes, usersRes] =
        await Promise.all([
          apiInstanceFetch.get("analytics/summary"),
          apiInstanceFetch.get("analytics/top-content"),
          apiInstanceFetch.get(
            `analytics/subscriptions?page=${subsPageToUse}&limit=50`
          ),
          apiInstanceFetch.get(
            `analytics/users?page=${usersPageToUse}&limit=50`
          )
        ]);

      if (summaryRes.status) {
        setSummary(summaryRes.data || null);
      }
      if (topContentRes.status) {
        setTopContent(topContentRes.data?.topContent || []);
      }
      if (subsRes.status) {
        setSubscriptions(subsRes.data || []);
        setSubsPage(subsRes.page || subsPageToUse);
        setSubsHasNext(!!subsRes.hasNextPage);
      }
      if (usersRes.status) {
        setUsersAnalytics(usersRes.data || []);
        setUsersPage(usersRes.page || usersPageToUse);
        setUsersHasNext(!!usersRes.hasNextPage);
      }
    } catch (e) {
      console.error("Error loading platform analytics", e);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="content-page" className="content-page">
      <div className="container-fluid">
        <div className="custom_page_wrapper">
          <div className="header_heading p_zero" style={{ paddingLeft: "14px" }}>
            <h3>Platform Analytics</h3>
          </div>

          <RootPaper>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Events Overview" />
                <Tab label="Top Content" />
                <Tab label="Subscriptions" />
                {/* <Tab label="Users & Plans" /> */}
              </Tabs>
            </Box>

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            )}

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {!loading && !error && (
              <>
                {tab === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Event Type Summary
                    </Typography>
                    <AnalyticsDataGrid
                      title="Event Type Summary"
                      data={summary?.eventTypeSummary || []}
                      columns={[
                        {
                          id: "eventType",
                          header: "Event Type",
                          accessorKey: "eventType",
                        },
                        {
                          id: "totalCount",
                          header: "Total Count",
                          accessorKey: "totalCount",
                          meta: { align: "right" },
                        },
                      ]}
                      loading={loading}
                      enableColumnFilters={false}
                    />
                    {summary?.dailyTrends?.length > 0 && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Daily Trends
                        </Typography>
                        <EventsTrendsChart summary={summary} />
                      </Box>
                    )}
                  </Box>
                )}

                {tab === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Top Content (by thumbnail views)
                    </Typography>
                    <AnalyticsDataGrid
                      title="Top Content"
                      data={topContent}
                      columns={[
                        {
                          id: "title",
                          header: "Title",
                          accessorKey: "title",
                        },
                        {
                          id: "thumbnailViews",
                          header: "Views",
                          accessorKey: "thumbnailViews",
                          meta: { align: "right" },
                        },
                        {
                          id: "thumbnailClicks",
                          header: "Clicks",
                          accessorKey: "thumbnailClicks",
                          meta: { align: "right" },
                        },
                        {
                          id: "clickThroughRate",
                          header: "CTR %",
                          accessorKey: "clickThroughRate",
                          meta: { align: "right" },
                          cell: ({ getValue }) => {
                            const v = getValue();
                            if (v == null) return "-";
                            return (typeof v === "number" ? v.toFixed(2) : v) + "%";
                          },
                        },
                      ]}
                      loading={loading}
                      enablePagination
                      pageSize={20}
                      maxHeight={undefined}
                    />
                    {!!topContent.length && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Top Content by Views
                        </Typography>
                        <TopContentChart topContent={topContent} />
                      </Box>
                    )}
                  </Box>
                )}

                {tab === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Subscription Transactions
                    </Typography>
                    <AnalyticsDataGrid
                      title="Subscriptions"
                      data={subscriptions}
                      columns={[
                        {
                          id: "createdAt",
                          header: "Date",
                          accessorKey: "createdAt",
                          meta: { nowrap: true },
                          cell: ({ getValue }) => {
                            const v = getValue();
                            return v
                              ? new Date(v).toLocaleString()
                              : "-";
                          },
                        },
                        {
                          id: "email",
                          header: "Email",
                          accessorKey: "email",
                        },
                        {
                          id: "country",
                          header: "Country",
                          accessorKey: "country",
                        },
                        {
                          id: "planType",
                          header: "Plan",
                          accessorKey: "planType",
                        },
                        {
                          id: "status",
                          header: "Status",
                          accessorKey: "status",
                        },
                        {
                          id: "amount_total",
                          header: "Amount",
                          accessorKey: "amount_total",
                          meta: { align: "right" },
                        },
                        {
                          id: "currency",
                          header: "Currency",
                          accessorKey: "currency",
                        },
                        {
                          id: "flow",
                          header: "Gateway",
                          accessorKey: "flow",
                        },
                      ]}
                      loading={loading}
                      enablePagination
                      pageSize={20}
                    />
                  </Box>
                )}

                {/* {tab === 3 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Users & Plan Status
                    </Typography>
                    <AnalyticsDataGrid
                      title="Users & Plans"
                      data={usersAnalytics}
                      columns={[
                        {
                          id: "name",
                          header: "Name",
                          accessorKey: "name",
                        },
                        {
                          id: "country",
                          header: "Country",
                          accessorKey: "country",
                        },
                        {
                          id: "planType",
                          header: "Plan Type",
                          accessorKey: "planType",
                        },
                        {
                          id: "planStatus",
                          header: "Status",
                          accessorKey: "planStatus",
                        },
                        {
                          id: "subscriptionTimeRemaining",
                          header: "Days Remaining",
                          accessorKey: "subscriptionTimeRemaining",
                          meta: { align: "right" },
                        },
                        {
                          id: "createdAt",
                          header: "Joined At",
                          accessorKey: "createdAt",
                          cell: ({ getValue }) => {
                            const v = getValue();
                            return v
                              ? new Date(v).toLocaleDateString()
                              : "-";
                          },
                        },
                      ]}
                      loading={loading}
                      enablePagination
                      pageSize={20}
                    />
                  </Box>
                )} */}
              </>
            )}
          </RootPaper>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;

