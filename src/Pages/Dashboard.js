import React, { useEffect, useState } from "react";

//routing
import { useHistory } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//dayjs
import dayjs from "dayjs";

//action
import {
  getDashboard,
  getAnalytic,
  getCountryWiseUser,
  getMovieSeriesAnalytic,
} from "../store/dashboard/dashboard.action";
import { getTop10Movie, getTop10WebSeries } from "../store/Movie/movie.action";
import Chart from "react-apexcharts";

//datepicker
import DateRangePicker from "react-bootstrap-daterangepicker";
// import "bootstrap-daterangepicker/daterangepicker.css";

//chart
// import { Chart as ChartJS } from "chart.js/auto";

import "apexcharts/dist/apexcharts.css";

//type
import { MOVIE_DETAILS } from "../store/Movie/movie.type";
import { TV_SERIES_DETAILS } from "../store/TvSeries/tvSeries.type";

// icon
import User from "../Component/assets/images/User.png";
import movieIcon from "../Component/assets/images/movie.png";
import webSeriesIcon from "../Component/assets/images/Web Series.png";
import revenueIcon from "../Component/assets/images/PurchaseHistory.png";

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [movies, setMovies] = useState([]);
  const [WebSeries, setWebSeries] = useState([]);

  let label = [];
  let dataUser = [];
  let movieLabel = [];
  let dataMovie = [];
  let data = ["no data found!!"];

  const [type, setType] = useState("User");
  const [chartType, setChartType] = useState("Movie");

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  var lastDay = new Date();

  const startDate = dayjs(firstDay).format("YYYY-MM-DD");
  const endDate = dayjs(lastDay).format("YYYY-MM-DD");

  const [sDate, setSDate] = useState(startDate);
  const [eDate, setEDate] = useState(endDate);
  const [analyticData, setAnalyticData] = useState([]);
  const [analyticMovieData, setAnalyticMovieData] = useState([]);

  const { dashboard } = useSelector((state) => state.dashboard);
  const { analytic, movieAnalytic } = useSelector((state) => state.dashboard);

  //Get Data
  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getAnalytic("User", sDate, eDate));
    dispatch(getMovieSeriesAnalytic("Movie", sDate, eDate));
    dispatch(getTop10Movie());
    dispatch(getTop10WebSeries());
    dispatch(getCountryWiseUser());
  }, [dispatch]);

  // user Revenue Data
  useEffect(() => {
    setAnalyticData(analytic);
  }, [analytic]);

  // movie series data
  useEffect(() => {
    setAnalyticMovieData(movieAnalytic);
  }, [movieAnalytic]);

  const { movie, web_Series } = useSelector((state) => state.movie);

  useEffect(() => {
    setMovies(movie);
  }, [movie]);

  useEffect(() => {
    setWebSeries(web_Series);
  }, [web_Series]);

  if (analyticData.length > 0) {
    if (type === "User" || type === "Revenue") {
      if (type === "User") {
        analyticData.map((data_) => {
          const newDate = data_._id;

          var date;
          if (newDate._id) {
            date = newDate?._id.split("T");
          } else {
            date = newDate.split("T");
          }
          date?.length > 0 && label.push(date[0]);
          if (data_.count || data_.count === 0) dataUser.push(data_.count);
        });
      } else {
        analyticData.map((data_) => {
          const newDate = data_?._id;
          const date = newDate?.split("T");
          date?.length > 0 && label.push(date[0]);
          if (data_.dollar || data_.dollar === 0) dataUser.push(data_.dollar);
        });
      }
    }
  }

  if (analyticMovieData.length > 0) {
    if (chartType === "Movie" || chartType === "WebSeries") {
      analyticMovieData.map((data_) => {
        const newDate = data_._id;
        const date = newDate.split("T");
        movieLabel.push(date[0]);
        dataMovie.push(data_.count);
      });
    }
  }

  const handleAnalytic = (type) => {
    setSDate(startDate);
    setEDate(endDate);
    setType(type);
    if (type === "User" || type === "Revenue") {
      dispatch(getAnalytic(type, startDate, endDate));
    } else if (chartType === "Movie" || chartType === "WebSeries") {
      dispatch(getMovieSeriesAnalytic(chartType, startDate, endDate));
    }
  };

  const handleAnalyticsChart = (chartType) => {
    setSDate(startDate);
    setEDate(endDate);
    setChartType(chartType);
    dispatch(getMovieSeriesAnalytic(chartType, startDate, endDate));
  };

  var state = {
    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        stroke: {
          curve: "smooth",
          width: 3,
        },

        zoom: {
          type: "x",
          enabled: false,
          autoScaleYaxis: false,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      colors: ["#4CAF50"],
      // fill: {
      //   type: "gradient",
      //   gradient: {
      //     shadeIntensity: 1,
      //     opacityFrom: 0.7,
      //     opacityTo: 0.1,
      //     stops: [0, 50, 100],
      //     gradientToColors: ['#FEAB01'],
      //     type: "vertical",
      //     colorStops: [
      //       {
      //         offset: 0,
      //         color: '#FEAB01',
      //         // opacity: 0.7
      //       },
      //       {
      //         offset: 100,
      //         color: '#FF0901',
      //         // opacity: 0.1
      //       }
      //     ]
      //   }
      // },
      xaxis: {
        categories: label,
      },
      stroke: {
        show: false,
        curve: "smooth",
        width: 2,
      },
    },
    series: [
      {
        name: "User",
        data: dataUser,
      },
    ],
  };

  var stateData = {
    options: {
      chart: {
        type: "area",
        width: "100%",
        height: 350,

        zoom: {
          type: "x",
          enabled: false,
          autoScaleYaxis: false,
        },
        toolbar: {
          autoSelected: "zoom",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
      },
      colors: ["#4CAF50"],
      xaxis: {
        categories: movieLabel,
      },
    },
    series: [
      {
        name: "Movie",
        data: dataMovie,
      },
    ],
  };

  // const moviesSmallChart = {
  //   options: {
  //     chart: {
  //       type: "area",
  //       width: "100%",
  //       height: 350,

  //       zoom: {
  //         type: "x",
  //         enabled: false,
  //         autoScaleYaxis: false,
  //       },
  //       toolbar: {
  //         autoSelected: "zoom",
  //       },
  //       fill: {
  //         type: "gradient",
  //         gradient: {
  //           shadeIntensity: 1,
  //           opacityFrom: 0.4,
  //           opacityTo: 0.9,
  //           stops: [0, 90, 100],
  //         },
  //       },
  //     },
  //     colors: ["#4CAF50"],
  //     xaxis: {
  //       categories: movieLabel,
  //       labels: {
  //         show: false
  //       }
  //     },
  //     yaxis: {
  //       labels: {
  //         show: false
  //       },
  //       opposite: true
  //     },
  //     grid: {
  //       show: false // remove grid lines
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Movie",
  //       data: dataMovie,
  //     },
  //   ],
  // };

  const handleResize = () => {
    const width = this.chartRef.current.clientWidth;
    if (width < 600) {
      this.chart.updateOptions({
        chart: {
          height: 200,
          width: "100%",
        },
      });
    } else {
      this.chart.updateOptions({
        chart: {
          height: 400,
          width: "80%",
        },
      });
    }
  };

  const chartData = {
    labels: label,
    datasets: [
      {
        label: type,
        data: dataUser,
        fill: true,
        fillOpacity: 1,
        backgroundColor: "rgba(255,255,255, 0.01)",
        borderColor: "hsl(253deg 61% 55%)",
        lineTension: 0.5,
      },
    ],
  };

  var stateRevenue = {
    options: {
      chart: {
        type: "area",
        width: "100%",
        height: 350,

        zoom: {
          type: "x",
          enabled: false,
          autoScaleYaxis: false,
        },
        toolbar: {
          autoSelected: "zoom",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
      },
      colors: ["#4CAF50"],
      xaxis: {
        categories: label,
      },
    },
    series: [
      {
        name: "Revenue",
        data: dataUser,
      },
    ],
  };

  const defaultChartData = {
    labels: label,
    datasets: [
      {
        label: type,
        data: data,
        fill: true,
        fillOpacity: 1,
        backgroundColor: "rgba(255,255,255, 0.01)",
        borderColor: "hsl(253deg 61% 55%)",
        lineTension: 0.5,
      },
    ],
  };

  const analciteChartData = {
    labels: movieLabel,
    datasets: [
      {
        label: chartType,
        data: dataMovie,
        fill: true,
        fillOpacity: 1,
        backgroundColor: "rgba(255,255,255, 0.01)",
        borderColor: "hsl(253deg 61% 55%)",
        lineTension: 0.5,
      },
    ],
  };

  const defaultAnalciteChartData = {
    labels: movieLabel,
    datasets: [
      {
        label: chartType,
        data: data,
        fill: true,
        fillOpacity: 1,
        backgroundColor: "rgba(255,255,255, 0.01)",
        borderColor: "hsl(253deg 61% 55%)",
        lineTension: 0.5,
      },
    ],
  };

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    if (type === "User" || type === "Revenue") {
      picker.element.val(
        picker.startDate.format("M/DD/YYYY") +
          " - " +
          picker.endDate.format("M/DD/YYYY")
      );
      const dayStart = dayjs(picker.startDate).format("M/DD/YYYY");
      const dayEnd = dayjs(picker.endDate).format("M/DD/YYYY");

      setSDate(dayStart);
      setEDate(dayEnd);

      dispatch(getAnalytic(type, dayStart, dayEnd));
    }
  };

  const handleApplyMovie = (event, picker) => {
    if (chartType === "Movie" || chartType === "WebSeries") {
      picker.element.val(
        picker.startDate.format("M/DD/YYYY") +
          " - " +
          picker.endDate.format("M/DD/YYYY")
      );
      const dayStart = dayjs(picker.startDate).format("M/DD/YYYY");
      const dayEnd = dayjs(picker.endDate).format("M/DD/YYYY");

      setSDate(dayStart);
      setEDate(dayEnd);

      dispatch(getMovieSeriesAnalytic(chartType, dayStart, dayEnd));
    }
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker.element.val("");
    dispatch(getAnalytic(type, startDate, endDate));
  };
  const handleMovieCancel = (event, picker) => {
    picker.element.val("");
    dispatch(getMovieSeriesAnalytic(chartType, startDate, endDate));
  };

  //Total Of All
  const total =
    dashboard?.movie +
    dashboard?.user +
    dashboard?.revenue?.dollar +
    dashboard?.series;

  //Percentage Of Every Table
  // const userPer = ((dashboard?.user * 100) / total).toFixed(2);
  // const moviePer = ((dashboard?.movie * 100) / total).toFixed(2);
  // const revenuePer = ((dashboard?.revenue?.dollar * 100) / total).toFixed(2);
  // const webSeriesPer = ((dashboard?.series * 100) / total).toFixed(2);
  const userPer = (
    (isNaN(total) || total === 0) ? 0 : ((dashboard?.user ?? 0) * 100) / total
  ).toFixed(2);
  const moviePer = (
    (isNaN(total) || total === 0) ? 0 : ((dashboard?.movie ?? 0) * 100) / total
  ).toFixed(2);
  const revenuePer = (
    (isNaN(total) || total === 0) ? 0 : ((dashboard?.revenue?.dollar ?? 0) * 100) / total
  ).toFixed(2);
  const webSeriesPer = (
    (isNaN(total) || total === 0) ? 0 : ((dashboard?.series ?? 0) * 100) / total
  ).toFixed(2);

  //Width Set For Progress bar
  const userWidth = userPer + "%";
  const movieWidth = moviePer + "%";
  const revenueWidth = revenuePer + "%";
  const webSeriesWidth = webSeriesPer + "%";

  //Movie Details
  const MovieDetails = (data) => {
    dispatch({ type: MOVIE_DETAILS, payload: data });
    // localStorage.setItem("movieDetails", JSON.stringify(data));
    history.push({
      pathname: "/admin/movie/movie_details",
      state: data,
    });
  };

  //Movie Details
  const SeriesDetails = (data) => {
    dispatch({ type: TV_SERIES_DETAILS, payload: data });
    // localStorage.setItem("movieDetails", JSON.stringify(data));
    history.push({
      pathname: "/admin/web_series/webSeriesDetail",
      state: data,
    });
  };

  var stateSeries = {
    options: {
      chart: {
        type: "area",
        height: 280,

        zoom: {
          type: "x",
          enabled: false,
          autoScaleYaxis: false,
        },
        toolbar: {
          autoSelected: "zoom",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
      },
      colors: ["#4CAF50"],
      xaxis: {
        categories: movieLabel,
      },
    },
    series: [
      {
        name: "Web Series",
        data: dataMovie,
      },
    ],
  };
  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          {/* <div class="iq-header-title">
                <h2 class="card-title my-4 ml-1" style={{ color: "#D5D5D5" }}>
                  Dashboard
                </h2>
              </div> */}

          <div className="dasboard_card_wrapper d-flex m-bot-20 asdfb2qa">
            <div className="iq-card-block iq-card-stretch iq-card-height dashboard-card">
              <div onClick={() => handleAnalytic("User")}>
                <div className="dashboard_top_card">
                  <h3>Users</h3>
                  <span className="card_number counter">
                    {dashboard?.user ? dashboard?.user : 0}
                  </span>
                  <img src={User} class="dashboard-card-icon" alt="" />
                  <p className="">
                    <i className="ri-arrow-up-line pb-1"></i>
                    {userPer ? userPer : 0}%
                  </p>
                  <div className="iq-progress-bar">
                    <span
                      data-percent={{
                        width: userWidth,
                        height: "6px",
                      }}
                      style={{
                        transition: "width 2s ease 0s",
                        width: userWidth,
                        fontSize: "18px",
                        background:
                          "linear-gradient(180deg, rgba(254,180,0,1) 0%, rgba(255,0,0,1) 100%)",
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="iq-card-block iq-card-stretch iq-card-height dashboard-card">
              <div onClick={() => handleAnalyticsChart("Movie")}>
                <div className="dashboard_top_card">
                  <h3>Movies</h3>
                  <span className="card_number counter">
                    {dashboard?.movie ? dashboard?.movie : 0}
                  </span>

                  <img src={movieIcon} class="dashboard-card-icon" alt="" />
                  <p className="">
                    <i className="ri-arrow-up-line pb-1"></i>
                    {moviePer ? moviePer : 0}%
                  </p>
                  <div className="iq-progress-bar">
                    <span
                      data-percent={{
                        width: movieWidth,
                        height: "6px",
                      }}
                      style={{
                        transition: "width 2s ease 0s",
                        width: movieWidth,
                        background:
                          "linear-gradient(180deg, rgba(254,180,0,1) 0%, rgba(255,0,0,1) 100%)",
                      }}
                    ></span>
                  </div>
                </div>
                {/* <div style={{ width: `70%`, position: 'absolute', right: -32, bottom: -32 }}>
                        <Chart
                          options={moviesSmallChart.options}
                          series={moviesSmallChart.series}
                          type="area"
                          height={120}
                        />
                      </div> */}
              </div>
            </div>

            <div className="iq-card-block iq-card-stretch iq-card-height dashboard-card">
              <div onClick={() => handleAnalyticsChart("WebSeries")}>
                <div className="dashboard_top_card">
                  <h3>Web Series</h3>
                  <span className="card_number counter">
                    {dashboard?.series ? dashboard?.series : 0}
                  </span>

                  <img src={webSeriesIcon} class="dashboard-card-icon" alt="" />
                  <p className="">
                    <i className="ri-arrow-up-line pb-1"></i>
                    {webSeriesPer ? webSeriesPer : 0}%
                  </p>
                  <div className="iq-progress-bar">
                    <span
                      data-percent={{
                        width: webSeriesWidth,
                        height: "6px",
                      }}
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(254,180,0,1) 0%, rgba(255,0,0,1) 100%)",
                        transition: "width 2s ease 0s",
                        width: webSeriesWidth,
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="iq-card-block iq-card-stretch iq-card-height dashboard-card">
              <div onClick={() => handleAnalytic("Revenue")}>
                <div className="dashboard_top_card">
                  <h3>Revenue</h3>
                  <span className="card_number counter">
                    {dashboard?.revenue?.dollar
                      ? dashboard?.revenue?.dollar
                      : 0}
                  </span>

                  <img src={revenueIcon} class="dashboard-card-icon" alt="" />
                  <p className="">
                    <i className="ri-arrow-up-line pb-1"></i>
                    {revenuePer ? revenuePer : 0}%
                  </p>
                  <div className="iq-progress-bar">
                    <span
                      data-percent={{
                        width: revenueWidth,
                        height: "6px",
                      }}
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(254,180,0,1) 0%, rgba(255,0,0,1) 100%)",
                        transition: "width 2s ease 0s",
                        width: revenueWidth,
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard_graph_col m-bot-20 ">
            <div class="custom_card_col">
              <div className="header_heading">
                <h3>{type}</h3>
              </div>
              {type === "User" ? (
                dataUser.length > 0 ? (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                          startDate: "01/01/2025",
                          endDate: "02/10/2025",
                        }}
                        onApply={handleApply}
                        onCancel={handleCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>

                    <div class="graph_card">
                      <Chart
                        options={state.options}
                        series={state.series}
                        type="bar"
                        height={350}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApply}
                        onCancel={handleCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>

                    <div class="graph_card">
                      <Chart
                        options={state.options}
                        series={state.series}
                        type="line"
                        height={350}
                      />
                    </div>
                  </>
                )
              ) : type === "Revenue" ? (
                dataUser.length > 0 ? (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApply}
                        onCancel={handleCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>

                    <div class="graph_card">
                      <Chart
                        options={stateRevenue.options}
                        series={stateRevenue.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApply}
                        onCancel={handleCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>

                    <div class="graph_card">
                      <Chart
                        options={stateRevenue.options}
                        series={stateRevenue.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="custom_date_filter">
                    <DateRangePicker
                      initialSettings={{
                        autoUpdateInput: false,
                        locale: {
                          cancelLabel: "Clear",
                        },
                        maxDate: new Date(),
                      }}
                      onApply={handleApply}
                      onCancel={handleCancel}
                    >
                      <input
                        readOnly
                        type="text"
                        class="form-control float-right"
                        placeholder={`${sDate} - ${eDate}`}
                        style={{
                          fontWeight: 500,
                        }}
                      />
                    </DateRangePicker>
                  </div>

                  <div class="graph_card">
                    <Chart
                      options={stateRevenue.options}
                      series={stateRevenue.series}
                      type="area"
                      height={350}
                    />
                  </div>
                </>
              )}
            </div>

            <div class="custom_card_col">
              <div className="header_heading">
                <h3>{chartType}</h3>
              </div>

              {chartType === "Movie" ? (
                dataMovie.length > 0 ? (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApplyMovie}
                        onCancel={handleMovieCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>
                    <div className="graph_card">
                      <Chart
                        options={stateData.options}
                        series={stateData.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApplyMovie}
                        onCancel={handleMovieCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>
                    <div className="graph_card">
                      <Chart
                        options={stateData.options}
                        series={stateData.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  </>
                )
              ) : chartType === "WebSeries" ? (
                dataMovie.length > 0 ? (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApplyMovie}
                        onCancel={handleMovieCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder={`${sDate} - ${eDate}`}
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>

                    <div className="graph_card">
                      <div id="chart">
                        <Chart
                          options={stateSeries.options}
                          series={stateSeries.series}
                          type="area"
                          height={350}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="custom_date_filter">
                      <DateRangePicker
                        initialSettings={{
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApplyMovie}
                        onCancel={handleMovieCancel}
                      >
                        <input
                          readOnly
                          type="text"
                          class="form-control float-right"
                          placeholder="Select Date"
                          style={{
                            fontWeight: 500,
                          }}
                        />
                      </DateRangePicker>
                    </div>
                    <div className="graph_card">
                      <Chart
                        options={stateSeries.options}
                        series={stateSeries.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="custom_date_filter">
                    <DateRangePicker
                      initialSettings={{
                        autoUpdateInput: false,
                        locale: {
                          cancelLabel: "Clear",
                        },
                        maxDate: new Date(),
                      }}
                      onApply={handleApplyMovie}
                      onCancel={handleMovieCancel}
                    >
                      <input
                        type="text"
                        readonly
                        class="form-control float-right"
                        placeholder="Select Date"
                        style={{
                          fontWeight: 500,
                        }}
                      />
                    </DateRangePicker>
                  </div>
                  <div className="graph_card">
                    <Chart
                      options={stateSeries.options}
                      series={stateSeries.series}
                      type="area"
                      height={350}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="dashboard_graph_col m-bot-20 ">
            <div class="iq-card iq-card-block iq-card-stretch  iq-card-height overflow-hidden mb-3 custom_card_col">
              <div className="header_heading ">
                <h3>Most Viewed Movies</h3>
              </div>
              <div class="iq-card-body">
                <div class="table-responsive card_border">
                  <table class="table mb-0 table-borderless custom_table">
                    <thead className="dashboard-table">
                      <tr className="text-center">
                        <th>ID</th>
                        <th className="text-left" scope="col">
                          Name
                        </th>
                        <th scope="col">Type</th>

                        <th scope="col">View</th>
                        <th scope="col">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies ? (
                        movies.map((data, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr>
                                <td className="text-center">{index + 1}</td>

                                <td className="text-start">
                                  {data?.title?.length > 17
                                    ? data?.title.slice(0, 17) + "...."
                                    : data?.title}
                                </td>
                                <td className="pr-3 tableAlign text-center">
                                  {data?.type === "Premium" ? (
                                    <div class="badge badge-pill badge-danger">
                                      {data?.type}
                                    </div>
                                  ) : (
                                    <div class="badge badge-pill badge-info">
                                      {data?.type}
                                    </div>
                                  )}
                                </td>

                                <td className="text-center">{data?.view}</td>

                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn iq-bg-primary btn-sm"
                                    onClick={() => MovieDetails(data._id)}
                                  >
                                    <i
                                      class="ri-information-line"
                                      style={{ fontSize: "19px" }}
                                    ></i>
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No data Found!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="iq-card iq-card-block iq-card-stretch iq-card-height overflow-hidden custom_card_col">
              <div className="header_heading">
                <h3>Most Viewed Web Series</h3>
              </div>
              <div class="iq-card-body">
                <div class="table-responsive card_border">
                  <table class="table mb-0 table-borderless custom_table">
                    <thead className="dashboard-table">
                      <tr className="text-center">
                        <th>ID</th>
                        <th className="text-left" scope="col">
                          Name
                        </th>
                        <th scope="col">Type</th>
                        <th scope="col">View</th>
                        <th scope="col">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {WebSeries ? (
                        WebSeries.map((data, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr>
                                <td className="text-center">{index + 1}</td>

                                <td className="text-start">
                                  {data?.title?.length > 17
                                    ? data?.title.slice(0, 17) + "...."
                                    : data?.title}
                                </td>
                                <td className="pr-3 tableAlign text-center">
                                  {data?.type === "Premium" ? (
                                    <div class="badge badge-pill badge-danger">
                                      {data?.type}
                                    </div>
                                  ) : (
                                    <div class="badge badge-pill badge-info">
                                      {data?.type}
                                    </div>
                                  )}
                                </td>

                                <td className="text-center">{data?.view}</td>

                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn iq-bg-primary btn-sm"
                                    onClick={() => SeriesDetails(data?._id)}
                                  >
                                    <i
                                      class="ri-information-line"
                                      style={{ fontSize: "19px" }}
                                    ></i>
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No data Found!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getDashboard,
  getAnalytic,
  getTop10Movie,
  getTop10WebSeries,
  getCountryWiseUser,
  getMovieSeriesAnalytic,
})(Dashboard);
