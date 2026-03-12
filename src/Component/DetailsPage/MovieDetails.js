import React, { useState, useEffect } from "react";
import $ from "jquery";

import defaultUserPicture from "../assets/images/defaultUserPicture.jpg";
//image
import placeholderImage from "../assets/images/singleUser.png";
import moviePlaceHolder from "../assets/images/movieDefault.png";

// antd
// import { Popconfirm } from "antd";

//react-router-dom
import { useLocation } from "react-router-dom";

// slick-carousel

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  viewDetails,
  getComment,
  deleteComment,
} from "../../store/Movie/movie.action";

//html Parser
import parse from "html-react-parser";
import Slider from "react-slick";

import { useHistory } from "react-router-dom";

//react player
import ReactPlayer from "react-player";

//react-skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../assets/js/SkeletonColor";
import { handleImageError } from "../../util/helperFunctions";

const MovieDetails = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [season, setSeason] = useState("");

  const [index, setIndex] = useState(0);
  // const [showURLs, setShowURLs] = useState([]);
  // const [showURLsRole, setShowURLsRole] = useState([]);

  const id = location.state;

  const history = useHistory();

  useEffect(() => {
    dispatch(viewDetails(id));
    dispatch(getComment(id));
  }, [dispatch]);

  const { movieDetails, comment } = useSelector((state) => state.movie);

  useEffect(() => {
    setData(movieDetails ? movieDetails[0] : "");
    setComments(comment ? comment : "");
  }, [movieDetails, comment]);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  const settings2 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 889,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: true,
        },
      },

      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  const handleDelete = (commentId) => {
    props.deleteComment(commentId);
  };

  //update button
  const updateOpen = (data) => {
    sessionStorage.setItem("trailerId", data?._id);
    localStorage.setItem("updateMovieData1", JSON.stringify(data));
    history.push({ pathname: "/admin/movie/movie_form", state: data });
  };

  const videoData = data?.trailer || [];
  const videoTop = videoData[0];

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="row d-flex align-items-center">
                <div className="col-10">
                  <div class="iq-header-title">
                    <h4 class="card-title mb-3">Movie Details</h4>
                  </div>
                </div>
                <div className="col-2 px-4">
                  <button
                    type="button"
                    className="btn iq-bg-primary btn-sm float-right "
                    onClick={() => updateOpen(data)}
                  >
                    <i
                      className="ri-pencil-fill"
                      style={{ fontSize: "19px" }}
                    />
                  </button>
                </div>
              </div>

              <div className="iq-card">
                <div
                  className="iq-card-body profile-page p-0 "
                  style={{ padding: "0px !important" }}
                >
                  <div className="profile-header">
                    <div className="cover-container">
                      <img
                        src={
                          movieDetails[0]?.image
                            ? movieDetails[0]?.image
                            : defaultUserPicture
                        }
                        alt="profile-bg"
                        className="img-fluid posterImage"
                        onError={(e) => handleImageError(e, defaultUserPicture)}
                      />
                    </div>
                    <div
                      className="profile-info "
                      style={{ paddingBottom: "0px !important" }}
                    >
                      <div className="row">
                        <div className="col-md-2 iq-item-product-left thumbnailPoster d-flex justify-content-start">
                          <img
                            src={
                              movieDetails[0]?.thumbnail
                                ? movieDetails[0]?.thumbnail
                                : moviePlaceHolder
                            }
                            style={{ objectFit: "cover" }}
                            alt="profile-img"
                            className="img-fluid movie-web-thumbnail-image"
                            onError={(e) =>
                              handleImageError(e, moviePlaceHolder)
                            }
                          />
                        </div>
                        <div className="col-md-10 iq-item-product-left mt-4">
                          <h4>{data?.title}</h4>

                          <div className="row">
                            <div className="col-12 col-md-3">
                              <form>
                                <table>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      Year
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td>{data?.year}</td>
                                  </tr>

                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2  fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      RunTime
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 ">
                                      {data?.runtime} min
                                    </td>
                                  </tr>

                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2  fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      Type
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 ">{data?.type}</td>
                                  </tr>

                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2  fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      Regin
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 ">
                                      {data?.region?.name}
                                    </td>
                                  </tr>
                                </table>
                              </form>
                            </div>
                            <div className="col-12 col-md-9">
                              <from>
                                <table>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989f7" }}
                                    >
                                      Genre
                                    </td>
                                    <td
                                      className="py-2 mb-2"
                                      style={{ color: "#4989f7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2">
                                      {data?.genre?.map((genreData) => {
                                        return genreData?.name + ",";
                                      })}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 align-top fw-bold "
                                      style={{ color: "#4989f7" }}
                                    >
                                      Description
                                    </td>
                                    <td
                                      className="py-2 mb-2 align-top"
                                      style={{ color: "#4989f7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 description-text">
                                      {parse(`${data?.description}`)}
                                    </td>
                                  </tr>
                                </table>
                              </from>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 product-description-details mt-5 pl-0">
                        <h4
                          style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <span class="card-title mb-3">Trailer</span>
                        </h4>

                        {data?.trailer?.length > 0 && (
                          <>
                            <Slider {...settings}>
                              {data?.trailer?.map((trailerValue, index) => {
                                return (
                                  <>
                                    <div
                                      className="card-background mb-4"
                                      style={{
                                        margin: " 5px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "0px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            height: "250px",
                                          }}
                                        >
                                          <ReactPlayer
                                            url={trailerValue.videoUrl}
                                            className="react-player img-fluid"
                                            playing={false}
                                            width="100%"
                                            height="100%"
                                            style={{
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>

                                        <p
                                          className="mt-3 text-center mb-0"
                                          style={{
                                            fontWeight: "600",
                                          }}
                                        >
                                          {trailerValue?.type}
                                        </p>
                                        <p
                                          className="text-center pt-2 text-capitalize"
                                          style={{ marginBottom: "13px" }}
                                        >
                                          {trailerValue?.name?.length > 50
                                            ? trailerValue?.name.substr(0, 40) +
                                              "..."
                                            : trailerValue?.name}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </Slider>
                          </>
                        )}
                      </div>
                      <div className="mb-5">
                        {data?.role?.length > 0 && (
                          <>
                            <div className="d-flex justify-content-between">
                              <div className="d-flex">
                                <h4
                                  style={{
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    marginLeft: "18px",
                                  }}
                                >
                                  <span class="card-title mb-3">Cast</span>
                                </h4>
                              </div>
                            </div>

                            <Slider {...settings2} className="roleSlider">
                              {data?.role?.map((roleData_, index) => {
                                return (
                                  <>
                                    <div style={{ margin: "20px" }}>
                                      <a
                                        className="card"
                                        href={() => false}
                                        style={{
                                          background: "#f1f5f9",
                                          padding: "5px",
                                        }}
                                      >
                                        <div className="card__preview img-fluid">
                                          <img
                                            className="roleImage"
                                            src={
                                              roleData_?.image
                                                ? roleData_?.image
                                                : placeholderImage
                                            }
                                            draggable={false}
                                            style={{
                                              width: "120px",
                                              height: "150px",
                                            }}
                                            alt="Cast"
                                            onError={(e) =>
                                              handleImageError(
                                                e,
                                                placeholderImage
                                              )
                                            }
                                          />
                                          <div className="card__body">
                                            <div className="row ml-0">
                                              <div className="col-12">
                                                <div className="d-flex align-items-center justify-content-center">
                                                  <div className="text-start">
                                                    <h6 className="mt-0 mb-3">
                                                      {roleData_.name}
                                                    </h6>

                                                    <span
                                                      className="ml-2 px-3 py-2"
                                                      style={{
                                                        color: "#56939F",
                                                        background: "#374b4b4f",
                                                      }}
                                                    >
                                                      {roleData_.position}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                  </>
                                );
                              })}
                            </Slider>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
  viewDetails,
  getComment,
  deleteComment,
})(MovieDetails);
