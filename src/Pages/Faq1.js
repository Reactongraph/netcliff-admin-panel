import React, { useState, useEffect } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//react-router-dom
import { NavLink } from "react-router-dom";

//action
import { getFaQ, deleteFaQ } from "../store/Faq/faq.action";
import { OPEN_FAQ_DIALOG, CLOSE_FAQ_TOAST } from "../store/Faq/faq.type";

//component
import FaqDialog from "../Component/Dialog/FaqDialog";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../util/Toast";
import { warning } from "../util/Alert";

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
          <div class="row">
            <div class="col-lg-3">
              <div class="iq-card">
                <div class="iq-card-body admininfo">
                  <div class="iq-edit-list">
                    <ul class="iq-edit-profile d-flex nav nav-pills">
                      <li class="col-md-6 p-0">
                        <a
                          class="nav-link active"
                          data-toggle="pill"
                          href="#personal-information"
                        >
                          FAQ
                        </a>
                      </li>
                      <li class="col-md-6 p-0">
                        <NavLink
                          to="/admin/help_center/contact_us"
                          class="nav-link"
                          data-toggle="pill"
                        >
                          Contact Us
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 mt-4">
              <div className="row ">
                <div className="iq-header-title d-flex justify-content-between ml-3">
                  <div>
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
                  <FaqDialog />
                </div>
              </div>
              <div className="row help-center-scroll">
                {data.length > 0
                  ? data.map((data, index) => {
                      return (
                        <>
                          <div className="col-md-6 mt-4">
                            <div class="iq-accordion career-style faq-style">
                              <div class="iq-card iq-accordion-block accordion ">
                                <div class="active-faq clearfix">
                                  <div class="container m-0">
                                    <div class="row">
                                      <div class="col-sm-12">
                                        <a
                                          class="accordion-title"
                                          href={() => false}
                                        >
                                          <span> {data?.question} </span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-details">
                                  <p class="mb-0">{data?.answer} </p>
                                </div>
                                <div class="contact-card-buttons d-flex justify-content-end pr-2 pb-1">
                                  <button
                                    type="button"
                                    className="btn iq-bg-primary btn-sm mr-2"
                                    onClick={() => handleEdit(data)}
                                  >
                                    <i
                                      className="ri-pencil-fill"
                                      style={{ fontSize: "19px" }}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="btn iq-bg-primary btn-sm"
                                    onClick={() => handleDelete(data._id)}
                                  >
                                    <i
                                      class="ri-delete-bin-6-line"
                                      style={{ fontSize: "19px" }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFaQ, deleteFaQ })(Faq);
