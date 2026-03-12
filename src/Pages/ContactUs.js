import React, { useState, useEffect } from "react";

//react-router-dom
import { NavLink } from "react-router-dom";

//Alert
import Swal from "sweetalert2";

import { setToast } from "../util/Toast";
import { warning, alert } from "../util/Alert";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getContactUs, deleteContact } from "../store/Contact/contact.action";
import {
  OPEN_CONTACT_DIALOG,
  CLOSE_CONTACT_US_TOAST,
} from "../store/Contact/contact.type";

//component
import ContactDialog from "../Component/Dialog/ContactDialog";
import { covertURl } from "../util/AwsFunction";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import noImage from "../Component/assets/images/noImage.png";

const ContactUs = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getContactUs());
  }, [dispatch]);

  const { contact, toast, toastData, actionFor } = useSelector(
    (state) => state.contact
  );
  const [showURLs, setShowURLs] = useState([]);

  //Set Data after Getting
  useEffect(() => {
    setData(contact);
  }, [contact]);

  useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        data.map(async (item) => {
          const fileNameWithExtension = item?.image.split("/").pop();
          const { imageURL } = await covertURl(
            "contactUs/" + fileNameWithExtension
          );
          return imageURL;
        })
      );
      setShowURLs(urls);
    };
    fetchData();
  }, [data]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_CONTACT_DIALOG });
  };

  //Update Dialog
  const handleEdit = (data) => {
    dispatch({ type: OPEN_CONTACT_DIALOG, payload: data });
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_CONTACT_US_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          props.deleteContact(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div class="iq-card-body">
        <div className="header_heading  help_center_card">
          <h3>Contact Us</h3>
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

        <div className="help-center-scroll m-2">
          {data.length > 0
            ? data.map((data, index) => {
                return (
                  <>
                    <div className="iq-email-listbox">
                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="mail-inbox"
                          role="tabpanel"
                        >
                          <ol className="iq-email-sender-list">
                            <li>
                              <div
                                className="d-flex align-items-center"
                                style={{ paddingTop: "25px" }}
                              >
                                <div className="iq-email-sender-info">
                                  <img
                                    className="rounded-circle img-fluid avatar-40"
                                    src={data?.image ? data?.image : noImage}
                                    alt="profile"
                                  />
                                  <span>{data?.name}</span>
                                </div>
                                <div class="iq-email-content">
                                  <span>{data?.link}</span>
                                  {/* <a
                                    href="javascript: void(0);"
                                    class="iq-email-subject"
                                  >
                                    {data?.link}
                                  </a> */}
                                </div>
                                <ul class="iq-social-media">
                                  <li>
                                    <button
                                      type="button"
                                      className="btn iq-pf-primary btn-sm mr-2"
                                      onClick={() => handleEdit(data)}
                                    >
                                      <i
                                        className="ri-pencil-fill"
                                        style={{ fontSize: "19px" }}
                                      />
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn iq-pf-primary btn-sm mr-2"
                                      onClick={() => handleDelete(data._id)}
                                    >
                                      <i
                                        className="ri-delete-bin-6-line"
                                        style={{ fontSize: "19px" }}
                                      />
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            : [...Array(9)].map((x, i) => {
                return (
                  <>
                    <div className="iq-email-listbox">
                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="mail-inbox"
                          role="tabpanel"
                        >
                          <ol className="iq-email-sender-list">
                            <li>
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ paddingTop: "25px" }}
                              >
                                <div className="iq-email-sender-info">
                                  <Skeleton
                                    width="50px"
                                    height="50px"
                                    style={{ borderRadius: "50%" }}
                                    baseColor="#1A2B2F"
                                    highlightColor="#151F24"
                                  />
                                </div>

                                <div class="iq-email-content">
                                  <a
                                    href="javascript: void(0);"
                                    class="iq-email-subject"
                                  >
                                    <Skeleton
                                      width="200px"
                                      height="10px"
                                      baseColor="#1A2B2F"
                                      highlightColor="#151F24"
                                    />
                                  </a>
                                </div>

                                <ul class="iq-social-media">
                                  <li>
                                    <button
                                      type="button"
                                      className="btn iq-pf-primary btn-sm mr-2"
                                    >
                                      <i
                                        className="ri-pencil-fill"
                                        style={{ fontSize: "19px" }}
                                      />
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn iq-pf-primary btn-sm mr-2"
                                    >
                                      <i
                                        className="ri-delete-bin-6-line"
                                        style={{ fontSize: "19px" }}
                                      />
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
        </div>
        <ContactDialog />
      </div>
    </>
  );
};

export default connect(null, { getContactUs, deleteContact })(ContactUs);
