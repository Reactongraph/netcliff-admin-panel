import react, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import $ from "jquery";
//action
import { viewDetails, getComment } from "../../store/TvSeries/tvSeries.action";

//image
import defaultUserPicture from "../assets/images/defaultUserPicture.jpg";
import movieDefault from "../assets/images/movieDefault.png";
import userDefault from "../assets/images/singleUser.png";
import noImage from "../assets/images/noImage.png";

import { useHistory } from "react-router-dom";

//html Parser
import parse from "html-react-parser";
import Slider from "react-slick";

//react player
import ReactPlayer from "react-player";

//react-skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../assets/js/SkeletonColor";

//react-router-dom
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// antd
// import { Popconfirm } from "antd";

//alert

import { covertURl } from "../../util/AwsFunction";
import { OPEN_DIALOG } from "../../store/TvSeries/tvSeries.type";
import { handleImageError } from "../../util/helperFunctions";

const WebSeriesDetail = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [comments, setComments] = useState([]);

  const id = location.state;

  useEffect(() => {
    dispatch(viewDetails(id));
    dispatch(getComment(id));
  }, [dispatch]);

  const { movieDetails, comment } = useSelector((state) => state.series);

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

  // Add play episode handler
  const handlePlayEpisode = (episode) => {
    // Navigate to MuxPlayer with episode data
    const params = new URLSearchParams({
      playbackId: episode.hlsFileName || episode._id,
      title: episode.name,
      userId: 'admin-user',
      episodeId: episode._id,
      seriesTitle: data?.title || 'Web Series',
      drmEnabled: episode.drmEnabled || false // Include DRM enabled flag
    });
    
    // Open in new tab/window for better user experience
    window.open(`/mux-player?${params.toString()}`, '_blank');
  };

  //Cast Slider Setting
  const castSliderShimmer = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: false,
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
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  //Episode Slider Setting

  const episodeSliderShimmer = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
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
        breakpoint: 889,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 679,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const history = useHistory();

  //update button
  const updateOpen = (data) => {
    dispatch({ type: OPEN_DIALOG, payload: data });
    localStorage.setItem("updateMovieData", JSON.stringify(data));
    sessionStorage.setItem("tvSeriesId", data._id);
    history.push("/admin/web_series/series_form");
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="row d-flex align-items-center">
                <div className="col-10">
                  <div class="iq-header-title">
                    <h4 class="card-title mb-3">Web Series Details</h4>
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
                          movieDetails &&
                          movieDetails.length > 0 &&
                          movieDetails[0].image
                            ? movieDetails[0].image
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
                              movieDetails && movieDetails[0]?.thumbnail
                                ? movieDetails[0]?.thumbnail
                                : movieDefault
                            }
                            alt="profile-img"
                            className="img-fluid"
                            width="200"
                            style={{ objectFit: "cover" }}
                            onError={(e) => handleImageError(e, movieDefault)}
                          />
                        </div>
                        <div className="col-md-10 iq-item-product-left mt-3">
                          <h3>{data?.title}</h3>

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
                                      className="py-2 mb-2 fw-bold"
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
                                      className="py-2 mb-2 fw-bold"
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
                                      className="py-2 mb-2 fw-bold"
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
                                      className="py-2 mb-2 align-top fw-bold"
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
                      <div className="col-sm-12 product-description-details mt-4 pl-0">
                        {data?.trailer?.length > 0 && (
                          <>
                            <h4
                              style={{
                                paddingTop: "10px",
                                paddingBottom: "10px",
                              }}
                            >
                              <span className="card-title mb-3">Trailer</span>
                            </h4>
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
                      {/* --------- episode ---------- */}

                      <div className="col-sm-12 product-description-details mt-4 pl-0">
                        <h4
                          style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <span className="card-title mb-3">Episode</span>
                        </h4>

                        <Slider {...episodeSliderShimmer}>
                          {data.episode?.length > 0 ? (
                            data.episode.map((trailerValue, index) => {
                              return (
                                <>
                                  <div style={{ margin: "15px" }}>
                                    <div
                                      className="card-background"
                                      style={{}}
                                      key={index} // Ensure to add a unique key to each element
                                    >
                                      <div
                                        style={{
                                          padding: "0px",
                                        }}
                                      >
                                        <div>
                                          <div className="card__pic">
                                            <img
                                              src={trailerValue?.image}
                                              alt=""
                                              width="100%"
                                              height="220px"
                                              style={{
                                                objectFit: "cover",
                                                cursor: (trailerValue?.hlsFileName || trailerValue?.videoUrl) ? "pointer" : "default"
                                              }}
                                              onClick={() => (trailerValue?.hlsFileName || trailerValue?.videoUrl) && handlePlayEpisode(trailerValue)}
                                              onError={(e) =>
                                                handleImageError(e, noImage)
                                              }
                                            />
                                          </div>
                                        </div>
                                        {/* <YouTube video={trailerValue?.key} autoplay /> */}

                                        <div className="px-2">
                                          <h6 className="pt-3">
                                            {trailerValue?.name}
                                          </h6>
                                          <div className="mb-3 ml-2">
                                            <span className="mr-1">
                                              Episode No :
                                            </span>
                                            <span>
                                              {trailerValue?.episodeNumber}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })
                          ) : (
                            <Skeleton
                              height={300}
                              width={500}
                              className="card__pic"
                              containerClassName="avatar-skeleton"
                              baseColor={colors.baseColor}
                              highlightColor={colors.highlightColor}
                            />
                          )}
                        </Slider>
                      </div>

                      {/* --------------cast------------- */}

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
                                  <span className="card-title mb-3">Cast</span>
                                </h4>
                              </div>
                            </div>

                            <Slider {...settings2} className="roleSlider">
                              {data?.role?.map((roleData_, index) => {
                                return (
                                  <>
                                    <div style={{ margin: "15px" }}>
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
                                              data?.image
                                                ? data?.image
                                                : userDefault
                                            }
                                            draggable={false}
                                            style={{
                                              width: "120px",
                                              height: "150px",
                                            }}
                                            alt="Cast"
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

export default connect(null, { viewDetails, getComment })(WebSeriesDetail);
