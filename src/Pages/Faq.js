import { useState, useEffect } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getFaQ, deleteFaQ } from "../store/Faq/faq.action";
import { OPEN_FAQ_DIALOG, CLOSE_FAQ_TOAST } from "../store/Faq/faq.type";

//component
import FaqDialog from "../Component/Dialog/FaqDialog";
import ContactUs from "./ContactUs";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../util/Toast";
import { warning } from "../util/Alert";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Faq = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getFaQ());
  }, [dispatch]);

  const { FaQ, toast, toastData, actionFor } = useSelector(
    (state) => state.FaQ
  );

  //Set Data after Getting
  useEffect(() => {
    setData(FaQ);
  }, [FaQ]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_FAQ_DIALOG });
  };

  //Update Dialog
  const handleEdit = (data) => {
    dispatch({ type: OPEN_FAQ_DIALOG, payload: data });
  };

  // delete sweetAlert
  const handleDelete = (faqId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteFaQ(faqId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_FAQ_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" class="content-page">
        <div class="container-fluid">
          <div className="header_heading p_zero">
            <h3>Help Center</h3>
          </div>
          <div className="advertisment_wrapper">
            <div className="adver_col_flex flex_wrap">
              <div className="ad_col setting_card">
                <div className="header_heading  help_center_card">
                  <h3>FAQ</h3>
                  <div className="header_heading_right_col">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      // data-bs-toggle="modal"
                      id="create-btn"
                      data-bs-target="#showModal"
                      onClick={handleOpen}
                    >
                      <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
                    </button>
                  </div>
                </div>
                <div className="help-center-scroll">
                  {data.length > 0
                    ? data.map((data, index) => {
                      return (
                        <>
                          <div className="faq_col">
                            <div className="faq_col_heading">
                              <span>{data?.question}</span>
                              <span>
                                <button
                                  type="button"
                                  className="btn icon_wrap btn-sm mr-2"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="ri-pencil-fill" />
                                </button>

                                <button
                                  type="button"
                                  className="btn icon_wrap btn-sm mr-2"
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i class="ri-delete-bin-6-line"></i>
                                </button>
                              </span>
                            </div>
                            <div className="faq_col_content">
                              <p>{data?.answer} </p>
                            </div>
                          </div>
                        </>
                      );
                    })
                    : [...Array(4)].map((x, i) => {
                      return (
                        <>
                          <div className="col-md-12 mt-4">
                            <div class="iq-accordion career-style faq-style">
                              <div class="card iq-accordion-block accordion ">
                                <div class="active-faq clearfix">
                                  <div class="container m-0">
                                    <div class="row">
                                      <div class="col-sm-12">
                                        <a class="accordion-title">
                                          <Skeleton
                                            width="300px"
                                            height="20px"
                                            baseColor="#1A2B2F"
                                            highlightColor="#151F24"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  class="accordion-details"
                                  style={{ marginLeft: "15px" }}
                                >
                                  <Skeleton
                                    width="100%"
                                    height="10px"
                                    baseColor="#1A2B2F"
                                    highlightColor="#151F24"
                                  />
                                  <Skeleton
                                    width="100%"
                                    height="10px"
                                    baseColor="#1A2B2F"
                                    highlightColor="#151F24"
                                  />
                                  <Skeleton
                                    width="50%"
                                    height="10px"
                                    baseColor="#1A2B2F"
                                    highlightColor="#151F24"
                                  />
                                </div>
                                <div class="contact-card-buttons d-flex justify-content-end pr-2 pb-1">
                                  <button
                                    type="button"
                                    className="btn icon_wrap btn-sm mr-2"
                                  >
                                    <i
                                      className="ri-pencil-fill"
                                      style={{
                                        fontSize: "19px",
                                        color: "#151F24",
                                      }}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="btn icon_wrap btn-sm mr-2"
                                  >
                                    <i
                                      class="ri-delete-bin-6-line"
                                      style={{
                                        fontSize: "19px",
                                        color: "#151F24",
                                      }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
                <FaqDialog />
              </div>

              <div className="ad_col setting_card">
                <ContactUs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFaQ, deleteFaQ })(Faq);
