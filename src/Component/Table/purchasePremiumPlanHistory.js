import React, { useEffect, useState } from "react";

//jquery
import $ from "jquery";

//dayjs
import dayjs from "dayjs";

//redux
import { connect, useSelector } from "react-redux";

//action
import { premiumPlanHistory } from "../../store/PremiumPlan/plan.action";

import PurchasePremiumPlan from "./History/PurchasePremiumPlan";

//datepicker
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//Pagination
import Pagination from "../../Pages/Pagination";

const PurchasePremiumPlanTable = (props) => {
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");
  const { history, totalPlan } = useSelector((state) => state.premiumPlan);

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    props.premiumPlanHistory(null, activePage, rowsPerPage, sDate, eDate);
  }, [activePage, rowsPerPage, sDate, eDate]);

  useEffect(() => {
    setData(history);
  }, [history]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker").removeClass("show");
    setData(history);
  }, [date, history]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const getAllHistory = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    props.premiumPlanHistory(null, activePage, rowsPerPage, sDate, eDate);
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");
    setsDate(start);
    seteDate(end);
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker.element.val("");
    setsDate("");
    seteDate("");
    props.premiumPlanHistory(null, activePage, rowsPerPage, sDate, eDate);
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Purchase Plan History</h3>
            <div className="header_heading_right_col">
              <button className="btn btn-primary" onClick={getAllHistory}>
                All
              </button>
              {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                      <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                       
                        <button
                          className="collapsed btn btn-primary"
                          value="check"
                          data-toggle="collapse"
                          data-target="#datePicker2"
                          onClick={collapsedDatePicker}
                        >
                          Analytics
                          <ExpandMoreIcon />
                        </button>
                        <p style={{ paddingLeft: 10 }} className="my-2 ">
                          {sDate !== "ALL" && sDate + " to " + eDate}
                        </p>
                      </div>
                    </div> */}
              <div>
                <DateRangePicker
                  initialSettings={{
                    autoUpdateInput: false,
                    locale: {
                      cancelLabel: "Clear",
                    },
                    maxDate: new Date(),

                    buttonClasses: ["btn btn-dark"],
                  }}
                  onApply={handleApply}
                  onCancel={handleCancel}
                >
                  <input
                    readOnly
                    type="text"
                    class="btn dark-icon btn-primary"
                    value="Analytics"
                    style={{
                      width: 120,

                      backgroundColor: "#673ab7",
                      color: "#ffff",
                    }}
                  />
                </DateRangePicker>
              </div>
              {sDate === "" ||
              eDate === "" ||
              sDate === "ALL" ||
              sDate === "ALL" ? (
                ""
              ) : (
                <div className="dateShow ml-3 fs-5 text-white fw-bold mt-2">
                  <span className="mr-2">{sDate}</span>
                  <span className="mr-2">To</span>
                  <span>{eDate}</span>
                </div>
              )}
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mt-lg-0 mt-xl-0"></div>
              <div
                id="datePicker2"
                className="collapse mt-5 pt-3 pl-5 ml-5"
                aria-expanded="false"
              >
                <div className="container table-responsive">
                  <div key={JSON.stringify(date)}>
                    <DateRangePicker
                      initialSettings={{
                        autoUpdateInput: false,
                        locale: {
                          cancelLabel: "Clear",
                        },
                        maxDate: new Date(),
                        buttonClasses: ["btn btn-dark"],
                      }}
                      onApply={handleApply}
                      onCancel={handleCancel}
                    >
                      <input
                        readOnly
                        type="text"
                        class="daterange form-control float-left bg-primary text-white"
                        placeholder="Select Date"
                        style={{ width: 120, fontWeight: 700 }}
                      />
                    </DateRangePicker>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="iq-card mb-5" id="card">
            <div className="iq-card-body">
              <PurchasePremiumPlan data={data} />
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalPlan}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { premiumPlanHistory })(PurchasePremiumPlanTable);
