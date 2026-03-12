import React, { useEffect, useMemo, useRef, useState } from "react";
import VerticalTab, { TabPanel } from "../Tab/VerticalTab";
import {
  Chip,
  DialogActions,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { baseURL, projectName, secretKey } from "../../util/config";
import { Toast } from "../../util/Toast_";
import { covertURl } from "../../util/AwsFunction";
import SunEditor from "suneditor-react";
import Multiselect from "multiselect-react-dropdown";
import { connect, useDispatch, useSelector } from "react-redux";
import { maturityRatings } from "../../util/maturityRatings";
import { videoQualities } from "../../util/videoQualities";
import { useHistory, NavLink } from "react-router-dom";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import TranslateIcon from "@mui/icons-material/Translate";
import AddIcon from "@mui/icons-material/Add";
import {
  createManual,
  loadMovieData,
  setUploadFileManual,
  updateMovie,
} from "../../store/Movie/movie.action";
import { getGenre } from "../../store/Genre/genre.action";
import { getLanguages } from "../../store/Language/language.action";
import { getRegion } from "../../store/Region/region.action";
import { getTeamMember } from "../../store/TeamMember/teamMember.action";
import UploadProgressManual from "../../Pages/UploadProgressManual";
import GeoBlockingForm from "./GeoBlockingForm";
import axios from "axios";
import { uploadFileToSignedUrl } from "../../util/aws";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";

const MovieFormNew = (props) => {
  const editor = useRef(null);
  const seoDesEditor = useRef(null);
  const ref = useRef();
  const imageRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  const genre = useSelector((state) => state.genre?.genre);
  const movieDetailsTmdb = useSelector((state) => state.movie?.movieDetailsTmdb);
  const reducerLanguages = useSelector(
    (state) => state.language?.languages
  );
  const region = useSelector((state) => state.region?.region);
  const [tabValue, setTabValue] = useState(0);
  const [videoType, setVideoType] = useState("0");
  const [tabs, setTabs] = useState([
    {
      index: 0,
      label: "Details",
      disabled: false,
      hasError: false,
    },
    {
      index: 1,
      label: "Video",
      disabled: false,
      hasError: false,
    },
    {
      index: 2,
      label: "Images",
      disabled: false,
      hasError: false,
    },
    {
      index: 3,
      label: "SEO",
      disabled: false,
      hasError: false,
    },
    {
      index: 4,
      label: "Geo-blocking",
      disabled: false,
      hasError: false,
    },
  ]);
  const [error, setError] = useState({
    title: "",
    trailerType: "",
    trailerName: "",
    description: "",
    year: "",
    genres: [],
    thumbnail: [],
    image: [],
    trailerImage: [],
    type: "",

    country: "",
    runtime: "",
    trailerVideoType: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    trailerVideoUrl: "",
    trailerVideo: "",
  });
  const [countries, setCountries] = useState([]);
  const dialogData = JSON.parse(localStorage.getItem("updateMovieData"));
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [m3u8Url, setM3u8Url] = useState("");
  const [movUrl, setMovUrl] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const [mkvUrl, setMkvUrl] = useState("");
  const [webmUrl, setWebmUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [genres, setGenres] = useState([]);
  const [type, setType] = useState("Premium");
  const [year, setYear] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [maturity, setMaturity] = useState("");
  const [videoQuality, setVideoQuality] = useState("");
  // const [contentRating, setContentRating] = useState("");
  const [language, setLanguage] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState([]);
  const [trailerName, setTrailerName] = useState("");
  const [trailerType, setTrailerType] = useState("");
  const [trailerVideoType, setTrailerVideoType] = useState(0);
  const [trailerImage, setTrailerImage] = useState([]);
  const [trailerVideoUrl, setTrailerVideoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [newReleased, setNewReleased] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [showURL, setShowURL] = useState({
    thumbnailImageShowImage: "",
    movieImageShowURL: "",
    movieVideoShowURl: "",
    trailerImageShowURL: "",
    trailerVideoShowURL: "",
  });
  const [updateType, setUpdateType] = useState();
  const [convertUpdateType, setConvertUpdateType] = useState({
    image: "",
    thumbnail: "",
    link: "",
  });
  const [video, setVideo] = useState([]);
  const [runtime, setRuntime] = useState("");
  const [loading, setLoading] = useState(false);
  const [trailerVideo, setTrailerVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [movieId, setMovieId] = useState("");
  const [trailerVideoPath, setTrailerVideoPath] = useState("");
  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    movieImageResURL: "",
    movieVideoResURL: "",
    trailerImageResURL: "",
    trailerVideoResURL: "",
  });
  const [data, setData] = useState({
    title: "",
    trailerName: "",
    trailerType: "",
    description: "",
    year: "",
    categories: "",
    genres: [],
    thumbnail: [],
    image: [],
    trailerImage: [],
    type: "",
    country: "",
    runtime: "",
    videoType: "",
    trailerVideoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    trailerVideoUrl: "",
    trailerVideo: [],
  });
  const [seoTags, setSeoTags] = useState([]);
  const [tagValue, setTagvalue] = useState("");

  const [allowedCountries, setAllowedCountries] = useState([]);
  const [blockedCountries, setBlockedCountries] = useState([]);

  let folderStructureMovieVideo = projectName + "movieVideo";
  let folderStructureThumbnail = projectName + "movieThumbnail";
  let folderStructureMovieImage = projectName + "movieImage";
  localStorage.setItem("trillerId", movieId);

  useEffect(() => {
    if (dialogData) {
      const genreId = dialogData?.genre?.map((value) => {
        return value._id;
      });
      setTitle(dialogData.title);
      setConvertUpdateType({
        image: dialogData?.convertUpdateType?.image,
        thumbnail: dialogData?.convertUpdateType?.thumbnail,
        link: dialogData?.convertUpdateType?.link,
      });
      setTrailerName(dialogData.trailerName);
      setTrailerType(dialogData.trailerType);
      setDescription(dialogData.description);
      setYear(dialogData.year);
      setCountry(dialogData.region._id);
      setImagePath(dialogData.image);
      setThumbnailPath(dialogData.thumbnail);
      setMovieId(dialogData._id);
      setVideoPath(dialogData.link);
      setType(dialogData.type);

      setRuntime(dialogData.runtime);
      setUpdateType(dialogData?.updateType);
      setTrailerVideoType(dialogData.trailerVideoType);
      if (dialogData.trailerVideoType == 0) {
        setTrailerVideoUrl(dialogData.trailerVideoUrl);
      } else if (dialogData.trailerVideoType == 1) {
        setTrailerVideoPath(dialogData.trailerVideoUrl);
        setTrailerVideo(dialogData.trailerVideoUrl);
      }
      setVideoType(dialogData.videoType);
      if (dialogData.videoType == 0) {
        setYoutubeUrl(dialogData.link);
      } else if (dialogData.videoType == 1) {
        setM3u8Url(dialogData.link);
      } else if (dialogData.videoType == 2) {
        setMovUrl(dialogData.link);
      } else if (dialogData.videoType == 3) {
        setMp4Url(dialogData.link);
      } else if (dialogData.videoType == 4) {
        setMkvUrl(dialogData.link);
      } else if (dialogData.videoType == 5) {
        setWebmUrl(dialogData.link);
      } else if (dialogData.videoType == 6) {
        setEmbedUrl(dialogData.link);
      } else if (dialogData.videoType == 7) {
        setVideoPath(dialogData.link);
        setVideo(dialogData.link);
      }
    } else {
      setTitle("");
      setTrailerName("");
      setTrailerType("");
      setDescription("");
      setYear("");
      setCountry("");
      setImagePath("");
      setThumbnailPath("");
      setMovieId("");
      setVideoPath("");
      setType("");
      setRuntime("");
      setTrailerVideoType("");
      setTrailerVideoUrl("");
      setTrailerVideoPath("");
      setTrailerVideo("");
      setVideoType("");
      setYoutubeUrl("");
      setM3u8Url("");
      setMovUrl("");
      setMp4Url("");
      setMkvUrl("");
      setWebmUrl("");
      setEmbedUrl("");
      setVideoPath("");
      setVideo("");
    }
  }, [dialogData]);

  const handlePaste = (e) => {
    const bufferText = (e?.originalEvent || e).clipboardData.getData(
      "text/plain"
    );
    e.preventDefault();
    document.execCommand("insertText", false, bufferText);
  };
  const editorOptions = {
    buttonList: [
      ["undo", "redo"],
      ["font", "fontSize", "formatBlock"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["removeFormat"],
      ["outdent", "indent"],
      ["align", "horizontalRule", "list", "table"],
      ["link", "image", "video"],
      ["fullScreen", "showBlocks", "codeView"],
      ["preview", "print"],
      ["save"],
    ],
    onPaste: handlePaste,
  };

  const videoLoad = async (event) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      link: 1,
    });
    setVideo(event.target.files[0]);
    setVideo(event.target.files[0]);
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(event.target.files[0]);
    videoElement.addEventListener("loadedmetadata", () => {
      const durationInSeconds = videoElement.duration;
      const durationInMilliseconds = durationInSeconds * 1000;
      setRuntime(parseInt(durationInMilliseconds));
    });

    const formData = new FormData();
    formData.append("folderStructure", folderStructureMovieVideo);
    formData.append("keyName", event.target.files[0]?.name);
    formData.append("content", event.target.files[0]);
    const uploadUrl = baseURL + `file/upload-file`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);
    xhr.upload.onprogress = (event) => {
      const progress = (event.loaded / event.total) * 100;
      setLoading(true);

      if (progress === 100) {
        xhr.onload = async () => {
          if (xhr.status === 200) {
            try {
              const responseData = JSON?.parse(xhr.responseText);

              setResURL({ ...resURL, movieVideoResURL: responseData?.url });

              if (responseData?.status) {
                setLoading(false);

                Toast("success", "successfully Video Upload");

                const fileNameWithExtension = responseData?.url
                  .split("/")
                  .pop();
                const fetchData = async () => {
                  try {
                    const { imageURL } = await covertURl(
                      "movieVideo/" + fileNameWithExtension
                    );

                    setShowURL({ ...showURL, movieVideoShowURl: imageURL });
                  } catch (error) {
                    console.error(error);
                  }
                };

                fetchData();
                const interval = setInterval(fetchData, 1000 * 60);
                return () => clearInterval(interval);
              }
            } catch (error) {
              console.error("Error parsing response data:", error);
            }
          } else {
            console.error("HTTP error! Status:", xhr?.status);
          }
        };
      }
    };
    xhr.onerror = () => {
      console.error("Error during upload");
    };
    xhr.setRequestHeader("key", secretKey);
    xhr.send(formData);
  };

  function onSelect(selectedList, selectedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  // function onSelectLanguages(selectedList, selectedItem) {
  //   languages?.push(selectedItem?._id);
  // }

  // function onRemoveLanguages(selectedList, removedItem) {
  //   setLanguages(selectedList.map((data) => data._id));
  // }

  const handleThumbnailSuccess = ({ resDataUrl, imageURL, file }) => {
    setThumbnail(file);
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      thumbnail: 1,
    });
    setResURL({ ...resURL, thumbnailImageResURL: resDataUrl });
    setShowURL({ ...showURL, thumbnailImageShowImage: imageURL });
    setThumbnailPath(imageURL);
  };

  const handleClick = (e) => {
    ref.current.click();
  };

  const handleImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setImage(file);
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      image: 1,
    });
    setResURL({ ...resURL, movieImageResURL: resDataUrl });
    setShowURL({ ...showURL, movieImageShowURL: imageURL });
    setImagePath(imageURL);
  };

  const handleClickImage = (e) => {
    imageRef.current.click();
  };

  const handleSubmit = () => {
    if (
      !title ||
      !description ||
      !year ||
      !country ||
      !language ||
      !image ||
      !thumbnail ||
      !runtime ||
      !type ||
      !maturity ||
      !videoQuality ||
      (!videoType && videoType !== 0)
    ) {
      const error = {};
      if (!image || !imagePath) error.image = "Image is Required!";
      if (!title) error.title = "Title is Required !";
      if (!description) error.description = "Description is Required !";
      if (!year) error.year = "Year is Required !";
      if (genres.length === 0) error.genres = "Genre is Required !";
      if (!language) error.language = "Language is Required !";
      if (!country) error.country = "Country is Required !";
      if (!runtime) error.runtime = "Runtime is Required !";
      if (!thumbnail) error.thumbnail = "Thumbnail is Required !";
      if (!type) error.type = "Type is required !";
      if (!maturity) error.maturity = "Maturity rating is required !";
      if (!videoQuality) error.videoQuality = "Video quality is required !";
      // if (!contentRating) error.contentRating = "Content rating is required !";

      if (!videoType) error.videoType = "Video Type is required !";

      if (!video || !videoPath) error.video = "Video is Required !";

      if (!videoType || !youtubeUrl) {
        error.youtubeUrl = "Youtube URL is Required !";
      }

      return setError({ ...error });
    } else {
      setData({
        title,
        description,
        year,
        genres,
        language,
        thumbnail,
        image,
        type,
        maturity,
        videoQuality,
        contentRating: Math.random() * 10,
        runtime,
        exclusive,
        featured,
        newReleased,
        videoType,
        youtubeUrl,
        m3u8Url,
        movUrl,
        convertUpdateType,
        mp4Url,
        mkvUrl,
        webmUrl,
        embedUrl,
        country,
        seoTitle,
        seoDescription,
        seoTags,
        allowedCountries,
      });

      let objData = {
        title,
        description,
        year,
        type,
        maturity,
        videoQuality,
        contentRating: Math.random() * 10,
        exclusive,
        featured,
        newReleased,
        region: country,
        image: resURL?.movieImageResURL,
        runtime,
        thumbnail: resURL?.thumbnailImageResURL,
        videoType,
        convertUpdateType,
        updateType: updateType,
        genre: genres,
        language,
        seoTitle,
        seoDescription,
        seoTags,
        blockedCountries: blockedCountries.map((a) => a._id),
        link:
          videoType == 0
            ? youtubeUrl
            : videoType == 1
              ? m3u8Url
              : videoType == 2
                ? movUrl
                : videoType == 3
                  ? mp4Url
                  : videoType == 4
                    ? mkvUrl
                    : videoType == 5
                      ? webmUrl
                      : videoType == 6
                        ? embedUrl
                        : resURL?.movieVideoResURL,
      };

      if (videoType == 8) {
        objData.hlsFileName = resURL.hlsFileName;
        objData.hlsFileExt = resURL.hlsFileExt;
      }

      props.createManual(objData, history);
    }
  };

  const handleClose = () => {
    localStorage.removeItem("updateMovieData");

    if (dialogData) {
      history.goBack();
    } else {
      history.push("/admin/movie");
    }
  };

  const appendTabError = (index) => {
    setTabs((prev) =>
      prev.map((el) => {
        if (el.index === index) {
          return { ...el, hasError: true };
        } else {
          return el;
        }
      })
    );
  };
  const clearTabError = (index) => {
    setTabs((prev) =>
      prev.map((el) => {
        if (el.index === index) {
          return { ...el, hasError: false };
        } else {
          return el;
        }
      })
    );
  };

  const handleAddTag = () => {
    if (!tagValue || seoTags.includes(tagValue)) {
      return;
    }
    setSeoTags((prev) => [...new Set(prev), tagValue]);
    setTagvalue("");
  };

  const handleRemoveTag = (tagName) => {
    setSeoTags((prev) => prev.filter((el) => el !== tagName));
  };

  const moveToBlocked = (item) => {
    if (Array.isArray(item)) {
      setAllowedCountries([]);
      setBlockedCountries(countries);
    } else {
      setAllowedCountries((prev) => prev.filter((cid) => cid._id !== item._id));
      setBlockedCountries((prev) => [item, ...prev]);
    }
  };
  const moveToAllowed = (item) => {
    if (Array.isArray(item)) {
      setAllowedCountries(countries);
      setBlockedCountries([]);
    } else {
      setBlockedCountries((prev) => prev.filter((cid) => cid._id !== item._id));
      setAllowedCountries((prev) => [item, ...prev]);
    }
  };

  const videoLoadHls = async (event) => {
    try {
      const file = event.target.files[0];
      const name = Date.now();
      const ext = file.name.split(".").pop();
      const fileName = `${name}.${ext}`;
      setLoading(true);
      const {
        data: { signedUrl },
      } = await axios.post(`${baseURL}file/signed-url`, {
        fileName,
        fileType: file.type,
      });

      const uploadResponse = await uploadFileToSignedUrl(signedUrl, file);

      if (!uploadResponse.ok) throw new Error("File upload failed");

      setResURL((prev) => ({ ...prev, hlsFileName: name, hlsFileExt: ext }));
      setLoading(false);
      Toast("success", "File uploaded.");
    } catch (error) {
      setLoading(false);
      Toast("error", "Something went wrong while uploading file.");
    }
  };

  useEffect(() => {
    if (error?.videoType) {
      appendTabError(0);
    } else {
      clearTabError(0);
    }
    if (
      error?.title ||
      error?.description ||
      error?.year ||
      error?.runtime ||
      error?.type ||
      error?.country ||
      error?.movieRating ||
      error?.genres?.length > 0 ||
      error?.language ||
      error?.maturity ||
      error?.videoQuality
    ) {
      appendTabError(1);
    } else {
      clearTabError(1);
    }
    if (error?.thumbnail?.length > 0 || error?.image?.length > 0) {
      appendTabError(2);
    } else {
      clearTabError(2);
    }
    if (
      error?.trailerName ||
      error?.trailerImage?.length > 0 ||
      error?.trailerType ||
      error?.trailerVideoType ||
      error?.trailerVideoUrl
    ) {
      appendTabError(3);
    } else {
      clearTabError(3);
    }
  }, [error]);

  useEffect(() => {
    dispatch(getGenre());
    dispatch(getRegion());
    dispatch(getLanguages());
  }, [dispatch]);

  useEffect(() => {
    setCountries(region);
    setAllowedCountries(region);
    setBlockedCountries([]);
  }, [region]);

  const selectedGenre = useMemo(() => genre?.filter((val) => { return genres.includes(val._id) })?.map((val) => { return { _id: val._id, name: val.name } }), [genre, genres])

  return (
    <div id="content-page" className="content-page">
      <div className="container-fluid">
        <div className="header_heading p_zero">
          <h3>Insert Movie</h3>
          <div className="header_heading_right_col">
            <NavLink
              class="nav-link active"
              id="pills-home-tab"
              data-toggle="pill"
              href="#pills-home"
              to="/admin/movie/movie_form"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              <AddIcon
                className="mb-1"
                sx={{ fontSize: "16px", marginRight: "2px" }}
              />
              Add
            </NavLink>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
              <div class="iq-card ml-2">
                <div class="iq-card-body">
                  <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">
                    <li class="nav-item navCustom"></li>
                    <Tooltip title="Please complete basic informaion first!">
                      <li class="nav-item navCustom">
                        <span
                          class="nav-link"
                          style={{ cursor: "not-allowed" }}
                        >
                          <i
                            className="ri-vidicon-line mr-1"
                            style={{ fontSize: "18px" }}
                          />
                          Trailer
                        </span>
                      </li>
                    </Tooltip>

                    <Tooltip title="Please complete basic informaion first!">
                      <li class="nav-item navCustom">
                        <span
                          class="nav-link"
                          style={{ cursor: "not-allowed" }}
                        >
                          <RecentActorsIcon
                            className="mr-1"
                            sx={{ fontSize: "20px", marginBottom: "2px" }}
                          />
                          Cast
                        </span>
                      </li>
                    </Tooltip>
                    <Tooltip title="Please complete basic informaion first!">
                      <li class="nav-item navCustom">
                        <span
                          class="nav-link"
                          style={{ cursor: "not-allowed" }}
                        >
                          <TranslateIcon
                            className="mr-1"
                            sx={{ fontSize: "20px", marginBottom: "2px" }}
                          />
                          Subtitles
                        </span>
                      </li>
                    </Tooltip>
                  </ul>
                  <div class="tab-content" id="pills-tabContent-2">
                    <div
                      class="tab-pane fade show active"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                    ></div>
                    <div
                      class="tab-pane fade"
                      id="pills-profile"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                    ></div>
                    <div
                      class="tab-pane fade"
                      id="pills-contact"
                      role="tabpanel"
                      aria-labelledby="pills-contact-tab"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="iq-card mb-5 ">
              <div className="iq-card-body">
                <VerticalTab
                  tabs={tabs}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                >
                  <TabPanel value={tabValue} index={0}>
                    <div className="custom_field_wrapper">
                      <div class="custom_field_col wdt100">
                        <label>Title</label>
                        {dialogData ? (
                          <>
                            <input
                              type="text"
                              placeholder="Title"
                              className="form-control form-control-line"
                              Required
                              name="title"
                              value={title}
                              onChange={(e) => {
                                setTitle(
                                  e.target.value.charAt(0).toUpperCase() +
                                  e.target.value.slice(1)
                                );
                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    title: "Title is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    title: "",
                                  });
                                }
                              }}
                            />
                          </>
                        ) : (
                          <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            className="form-control form-control-line"
                            Required
                            value={title}
                            onChange={(e) => {
                              setTitle(
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1)
                              );

                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  title: "Title is Required!",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  title: "",
                                });
                              }
                            }}
                          />
                        )}

                        {error.title && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.title}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col wdt100">
                        <label htmlFor="description">Description</label>

                        <SunEditor
                          value={description}
                          setContents={description}
                          ref={editor}
                          height={200}
                          onChange={(e) => {
                            setDescription(e);

                            if (!e) {
                              return setError({
                                ...error,
                                description: "Description is Required !",
                              });
                            } else {
                              return setError({
                                ...error,
                                description: "",
                              });
                            }
                          }}
                          placeholder="Description"
                          setOptions={editorOptions}
                        />

                        {error.description && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.description}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label>Release Year</label>

                        <input
                          type="date"
                          placeholder="YYYY-MM-DD"
                          className="form-control form-control-line"
                          Required
                          min="1950"
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);

                            if (!e.target.value) {
                              return setError({
                                ...error,
                                year: "Year is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                year: "",
                              });
                            }
                          }}
                        />

                        {error.year && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.year}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label>Runtime (MilliSeconds)</label>
                        <input
                          type="number"
                          placeholder="Runtime"
                          className="form-control form-control-line"
                          requiredfru
                          value={runtime}
                          onChange={(e) => {
                            setRuntime(e.target.value);

                            if (!e.target.value) {
                              return setError({
                                ...error,
                                runtime: "Runtime is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                runtime: "",
                              });
                            }
                          }}
                        />
                        {error.runtime && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              color="error"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.runtime}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label>Free/Premium</label>

                        <select
                          name="type"
                          className="form-control form-control-line selector"
                          id="type"
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);

                            if (e.target.value === "select type") {
                              return setError({
                                ...error,
                                type: "Type is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                type: "",
                              });
                            }
                          }}
                        >
                          <option value="select type">Select Type</option>
                          <option value="Free">Free</option>
                          <option value="Premium">Premium</option>
                          {/* <option>Default</option> */}
                        </select>

                        {error.type && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.type}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label htmlFor="earning">Country</label>
                        <select
                          name="type"
                          style={{ textTransform: "capitalize" }}
                          className="form-control form-control-line minimal"
                          id="type"
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);

                            if (e.target.value === "Select Country") {
                              return setError({
                                ...error,
                                country: "Movie Country is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                country: "",
                              });
                            }
                          }}
                        >
                          <option value="Select Country">Select Country</option>
                          {countries.map((data, key) => {
                            return (
                              <>
                                <option
                                  value={data._id}
                                  key={key}
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {data.name.toLowerCase()}
                                </option>
                              </>
                            );
                          })}
                        </select>
                        {error.country && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.country}
                            </Typography>
                          </div>
                        )}
                      </div>

                      <div class="custom_field_col">
                        <label>Genre</label>
                        {dialogData ? (
                          <Multiselect
                            options={genre} // Options to display in the dropdown
                            selectedValues={selectedGenre} // Preselected value to persist in dropdown
                            onSelect={onSelect} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            id="css_custom"
                          // style={{
                          //   chips: {
                          //     // background: "rgba(145, 111, 203, 0.69)",
                          //   },
                          //   multiselectContainer: {
                          //     color: "rgba(174, 159, 199, 1)",
                          //   },
                          //   searchBox: {
                          //     border: "none",
                          //     "border-bottom": "1px solid blue",
                          //     "border-radius": "0px",
                          //   },
                          // }}
                          />
                        ) : (
                          <Multiselect
                            options={genre} // Options to display in the dropdown
                            selectedValues={selectedGenre} // Preselected value to persist in dropdown
                            onSelect={onSelect} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            id="css_custom movieDetailsTmdb"
                            style={{
                              chips: {
                                // background: "rgba(145, 111, 203, 0.69)",
                              },
                              multiselectContainer: {
                                color: "rgba(174, 159, 199, 1)",
                              },
                              searchBox: {
                                border: "none",
                                "border-bottom": "1px solid blue",
                                "border-radius": "0px",
                              },
                            }}
                          />
                        )}

                        {genres?.length === 0 ? (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.genres}
                            </Typography>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div class="custom_field_col">
                        <label>Language</label>
                        {/* {dialogData ? (
                          <Multiselect
                            options={reducerLanguages} // Options to display in the dropdown
                            selectedValues={dialogData?.languages} // Preselected value to persist in dropdown
                            onSelect={onSelectLanguages} // Function will trigger on select event
                            onRemove={onRemoveLanguages} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            id="css_custom"
                            style={{
                              chips: {
                                // background: "rgba(145, 111, 203, 0.69)",
                              },
                              multiselectContainer: {
                                color: "rgba(174, 159, 199, 1)",
                              },
                              searchBox: {
                                border: "none",
                                "border-bottom": "1px solid blue",
                                "border-radius": "0px",
                              },
                            }}
                          />
                        ) : (
                          <Multiselect
                            options={reducerLanguages} // Options to display in the dropdown
                            selectedValues={movieDetailsTmdb?.languages} // Preselected value to persist in dropdown
                            onSelect={onSelectLanguages} // Function will trigger on select event
                            onRemove={onRemoveLanguages} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            id="css_custom"
                            style={{
                              chips: {
                                // background: "rgba(145, 111, 203, 0.69)",
                              },
                              multiselectContainer: {
                                color: "rgba(174, 159, 199, 1)",
                              },
                              searchBox: {
                                border: "none",
                                "border-bottom": "1px solid blue",
                                "border-radius": "0px",
                              },
                            }}
                          />
                        )}

                        {languages?.length === 0 ? (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.languages}
                            </Typography>
                          </div>
                        ) : (
                          ""
                        )} */}
                        <select
                          name="type"
                          className="form-control form-control-line minimal"
                          id="type"
                          style={{ textTransform: "capitalize" }}
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);

                            if (e.target.value === "Select Language") {
                              return setError({
                                ...error,
                                language: "Movie Language is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                language: "",
                              });
                            }
                          }}
                        >
                          <option value="Select Language">
                            Select Language
                          </option>
                          {reducerLanguages.map((data, key) => {
                            return (
                              <>
                                <option
                                  value={data._id}
                                  key={key}
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {data.name.toLowerCase()}
                                </option>
                              </>
                            );
                          })}
                        </select>
                        {error.language && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.language}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label>Maturity Rating</label>

                        <select
                          name="maturity"
                          className="form-control form-control-line selector"
                          id="maturity"
                          value={maturity}
                          onChange={(e) => {
                            setMaturity(e.target.value);

                            if (e.target.value === "maturity") {
                              return setError({
                                ...error,
                                maturity: "Maturity is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                maturity: "",
                              });
                            }
                          }}
                        >
                          <option value="maturity">Select Maturity</option>
                          {maturityRatings.map((lang) => {
                            return (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            );
                          })}
                        </select>

                        {error.maturity && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.maturity}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label>Video Quality</label>

                        <select
                          name="videoQuality"
                          className="form-control form-control-line selector"
                          id="videoQuality"
                          value={videoQuality}
                          onChange={(e) => {
                            setVideoQuality(e.target.value);

                            if (e.target.value === "videoQuality") {
                              return setError({
                                ...error,
                                videoQuality: "Video quality is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                videoQuality: "",
                              });
                            }
                          }}
                        >
                          <option value="videoQuality">
                            Select Video Quality
                          </option>
                          {videoQualities.map((lang) => {
                            return (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            );
                          })}
                        </select>

                        {error.videoQuality && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.videoQuality}
                            </Typography>
                          </div>
                        )}
                      </div>
                      {/* <div class="custom_field_col">
                        <label>Content Rating</label>

                        <select
                          name="contentRating"
                          className="form-control form-control-line selector"
                          id="contentRating"
                          value={contentRating}
                          onChange={(e) => {
                            setContentRating(e.target.value);

                            if (e.target.value === "contentRating") {
                              return setError({
                                ...error,
                                contentRating: "Content Rating is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                contentRating: "",
                              });
                            }
                          }}
                        >
                          <option value="contentRating">
                            Select Content Rating
                          </option>
                          {contentRatings.map((elam) => {
                            return (
                              <option key={elam.value} value={elam.value}>
                                {elam.label}
                              </option>
                            );
                          })}
                        </select>

                        {error.contentRating && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.contentRating}
                            </Typography>
                          </div>
                        )}
                      </div> */}
                      <div style={{ display: "flex", gap: "40px" }}>
                        <div class="exclusiveContainer">
                          <div>
                            <Switch
                              checked={exclusive}
                              onChange={(e) => {
                                setExclusive(e.target?.checked);
                              }}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </div>
                          <label className="float-left">Exclusive</label>
                        </div>
                        <div class="exclusiveContainer">
                          <div>
                            <Switch
                              checked={featured}
                              onChange={(e) => {
                                setFeatured(e.target?.checked);
                              }}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </div>
                          <label className="float-left">Featured</label>
                        </div>
                        <div class="exclusiveContainer">
                          <div>
                            <Switch
                              checked={newReleased}
                              onChange={(e) => {
                                setNewReleased(e.target?.checked);
                              }}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </div>
                          <label className="float-left">New Released</label>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <div className="custom_field_wrapper">
                      <div class="custom_field_col">
                        <label>Video Type</label>

                        <select
                          id="contentType"
                          name="contentType"
                          class="form-control form-control-line"
                          required
                          value={videoType}
                          onChange={(e) => {
                            setVideoType(e.target.value);
                            setYoutubeUrl("");
                            setM3u8Url("");
                            setMovUrl("");
                            setMp4Url("");
                            setMkvUrl("");
                            setWebmUrl("");
                            setEmbedUrl("");
                            if (e.target.value === "select videoType") {
                              return setError({
                                ...error,
                                videoType: "Video Type is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                videoType: "",
                              });
                            }
                          }}
                        >
                          <option value="select videoType">
                            {" "}
                            Select Video Type
                          </option>
                          <option value={0}>Youtube Url </option>
                          <option value={1}>m3u8 Url </option>
                          <option value={2}>MOV Url </option>
                          <option value={3}>MP4 Url</option>
                          <option value={4}>MKV Url</option>
                          <option value={5}>WEBM Url</option>
                          <option value={6}>Embed source</option>
                          <option value={7}>File (MP4/MOV/MKV/WEBM)</option>
                          <option value={8}>
                            File (MP4/MOV/MKV/WEBM for HLS)
                          </option>
                        </select>
                        {!videoType ? (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.videoType}
                            </Typography>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div class="custom_field_col">
                        <label>
                          {resURL?.hlsFileName ? "Video" : "Video URL"}
                        </label>
                        {dialogData ? (
                          <div>
                            {videoType == 0 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={youtubeUrl}
                                  onChange={(e) => {
                                    setYoutubeUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        youtubeUrl: "Youtube url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        youtubeUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {!youtubeUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.youtubeUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 1 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={m3u8Url}
                                  onChange={(e) => {
                                    setM3u8Url(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        m3u8Url: "m3u8 url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        m3u8Url: "",
                                      });
                                    }
                                  }}
                                />
                                {error.m3u8Url && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.m3u8Url}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 2 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={movUrl}
                                  onChange={(e) => {
                                    setMovUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        movUrl: "mov url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        movUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.movUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      youtubeUrl
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.movUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 3 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={mp4Url}
                                  onChange={(e) => {
                                    setMp4Url(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        mp4Url: "mp4 url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        mp4Url: "",
                                      });
                                    }
                                  }}
                                />
                                {error.mp4Url && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.mp4Url}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 4 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={mkvUrl}
                                  onChange={(e) => {
                                    setMkvUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        mkvUrl: "mkv url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        mkvUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.mkvUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.mkvUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 5 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={webmUrl}
                                  onChange={(e) => {
                                    setWebmUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        webmUrl: "webm url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        webmUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.webmUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.webmUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 6 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={embedUrl}
                                  onChange={(e) => {
                                    setEmbedUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        embedUrl: "embed url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        embedUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.embedUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.embedUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 7 && (
                              <>
                                <input
                                  type="file"
                                  id="customFile"
                                  className="form-control"
                                  accept="video/*"
                                  required=""
                                  onChange={videoLoad}
                                />
                                <>
                                  <video
                                    height="100px"
                                    width="100px"
                                    controls
                                    alt="app"
                                    src={showURL?.movieVideoShowURL}
                                    style={{
                                      boxShadow:
                                        " rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                      border:
                                        "0.5px solid rgba(255, 255, 255, 0.2)",
                                      marginTop: "10px",
                                      float: "left",
                                    }}
                                  />

                                  <div
                                    class="img-container"
                                    style={{
                                      display: "inline",
                                      position: "relative",
                                      float: "left",
                                    }}
                                  ></div>
                                </>
                              </>
                            )}
                            {videoType == 8 && (
                              <>
                                <input
                                  type="file"
                                  id="customFile"
                                  className="form-control"
                                  accept="video/*"
                                  required=""
                                  onChange={videoLoadHls}
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <div>
                            {videoType == 0 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={youtubeUrl}
                                  onChange={(e) => {
                                    setYoutubeUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        youtubeUrl: "Youtube url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        youtubeUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {!youtubeUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.youtubeUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 1 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={m3u8Url}
                                  onChange={(e) => {
                                    setM3u8Url(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        m3u8Url: "m3u8 url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        m3u8Url: "",
                                      });
                                    }
                                  }}
                                />
                                {error.m3u8Url && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.m3u8Url}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 2 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={movUrl}
                                  onChange={(e) => {
                                    setMovUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        movUrl: "mov url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        movUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.movUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      youtubeUrl
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.movUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 3 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={mp4Url}
                                  onChange={(e) => {
                                    setMp4Url(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        mp4Url: "mp4 url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        mp4Url: "",
                                      });
                                    }
                                  }}
                                />
                                {error.mp4Url && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.mp4Url}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 4 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={mkvUrl}
                                  onChange={(e) => {
                                    setMkvUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        mkvUrl: "mkv url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        mkvUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.mkvUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.mkvUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 5 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={webmUrl}
                                  onChange={(e) => {
                                    setWebmUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        webmUrl: "webm url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        webmUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.webmUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.webmUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 6 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control form-control-line"
                                  value={embedUrl}
                                  onChange={(e) => {
                                    setEmbedUrl(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        embedUrl: "embed url is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        embedUrl: "",
                                      });
                                    }
                                  }}
                                />
                                {error.embedUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.embedUrl}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            )}
                            {videoType == 7 && (
                              <>
                                <input
                                  type="file"
                                  id="customFile"
                                  className="form-control"
                                  accept="video/*"
                                  required=""
                                  onChange={videoLoad}
                                />

                                <>
                                  <video
                                    height="100px"
                                    width="100px"
                                    controls
                                    alt="app"
                                    src={showURL?.movieVideoShowURl}
                                    style={{
                                      boxShadow:
                                        "rgb(101 146 173 / 34%) 0px 0px 0px 1.2px",
                                      marginTop: 10,
                                      float: "left",
                                    }}
                                  />
                                  {loading && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div className="loader" /> Uploading ...
                                    </div>
                                  )}
                                  {/* Show the loader when loading is true */}

                                  <div
                                    class="img-container"
                                    style={{
                                      display: "inline",
                                      position: "relative",
                                      float: "left",
                                    }}
                                  ></div>
                                </>
                              </>
                            )}
                            {videoType == 8 && (
                              <>
                                <input
                                  type="file"
                                  id="customFile"
                                  className="form-control"
                                  accept="video/*"
                                  required=""
                                  onChange={videoLoadHls}
                                />
                                <>
                                  {loading ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div className="loader" /> Uploading ...
                                    </div>
                                  ) : (
                                    <>
                                      {resURL.hlsFileName && (
                                        <div
                                          style={{
                                            border: "1px solid black",
                                            width: "fit-content",
                                            padding: "20px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "10px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {resURL.hlsFileName}.m3u8
                                        </div>
                                      )}
                                    </>
                                  )}
                                </>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <div className="row ml-3">
                      <ImageVideoFileUpload
                        label="Thumbnail"
                        imagePath={showURL?.thumbnailImageShowImage}
                        error={error.thumbnail}
                        folderStructure={projectName + "movieThumbnail"}
                        onUploadSuccess={handleThumbnailSuccess}
                        className="col-md-12 my-2"
                        labelClassName="movieForm"
                        imgStyle={{ height: 170, width: 170 }}
                        variant="advanced"
                      />
                    </div>
                    <div className="row ml-3 my-4">
                      <ImageVideoFileUpload
                        label="Image"
                        imagePath={showURL?.movieImageShowURL}
                        error={error.image}
                        folderStructure={projectName + "movieImage"}
                        onUploadSuccess={handleImageSuccess}
                        className="col-md-12 my-2"
                        labelClassName="movieForm"
                        imgStyle={{ width: "745px", height: "270px" }}
                        variant="advanced"
                      />
                    </div>
                  </TabPanel>

                  <TabPanel value={tabValue} index={3}>
                    <div class="ml-3">
                      <label className="float-left styleForTitle movieForm">
                        SEO Title
                      </label>
                      {dialogData ? (
                        <>
                          <input
                            type="text"
                            placeholder="SEO Title"
                            className="form-control form-control-line"
                            Required
                            name="seoTitle"
                            value={seoTitle}
                            onChange={(e) => {
                              setSeoTitle(
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1)
                              );
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  seoTitle: "SEO Title is Required!",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  seoTitle: "",
                                });
                              }
                            }}
                          />
                        </>
                      ) : (
                        <input
                          type="text"
                          name="seoTitle"
                          placeholder="SEO Title"
                          className="form-control form-control-line"
                          Required
                          value={seoTitle}
                          onChange={(e) => {
                            setSeoTitle(
                              e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1)
                            );

                            if (!e.target.value) {
                              return setError({
                                ...error,
                                seoTitle: "SEO Title is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                seoTitle: "",
                              });
                            }
                          }}
                        />
                      )}

                      {error.seoTitle && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            style={{
                              fontFamily: "Circular-Loom",
                              color: "#ee2e47",
                            }}
                          >
                            {error.seoTitle}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div class="ml-3 my-4">
                      <label
                        htmlFor="description"
                        className="styleForTitle mt-3 movieForm"
                      >
                        SEO Description
                      </label>

                      <SunEditor
                        value={seoDescription}
                        setContents={seoDescription}
                        ref={seoDesEditor}
                        height={100}
                        width={850}
                        onChange={(e) => {
                          setSeoDescription(e);

                          if (!e) {
                            return setError({
                              ...error,
                              seoDescription: "SEO Description is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              seoDescription: "",
                            });
                          }
                        }}
                        placeholder="SEO Description"
                        setOptions={editorOptions}
                      />

                      {error.seoDescription && (
                        <div className="pl-1 text-left">
                          <Typography
                            variant="caption"
                            style={{
                              fontFamily: "Circular-Loom",
                              color: "#ee2e47",
                            }}
                          >
                            {error.seoDescription}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div class="ml-3 row">
                      <div className="col-md-6 my-2">
                        <label className="float-left styleForTitle movieForm">
                          SEO Tags
                        </label>

                        <div>
                          <input
                            type="text"
                            name="seoTags"
                            placeholder="Add Tag"
                            className="form-control form-control-line"
                            value={tagValue}
                            onChange={(e) => {
                              setTagvalue(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary btn-sm px-3 py-1 mt-4"
                            onClick={handleAddTag}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6 my-2">
                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          sx={{ width: 400, flexWrap: "wrap" }}
                        >
                          {seoTags.map((tg) => {
                            return (
                              <Chip
                                color="primary"
                                key={tg}
                                label={tg}
                                onDelete={() => handleRemoveTag(tg)}
                              />
                            );
                          })}
                        </Stack>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue} index={4}>
                    <div class="ml-3 row">
                      <div className="col-md-6 my-2" style={{ width: 450 }}>
                        <GeoBlockingForm
                          originalList={allowedCountries}
                          action={moveToBlocked}
                          actionTitle="Block"
                          title="Available Regions"
                        />
                      </div>
                      <div className="col-md-6 my-2" style={{ width: 450 }}>
                        <GeoBlockingForm
                          originalList={blockedCountries}
                          action={moveToAllowed}
                          actionTitle="Allow"
                          title="Blocked Regions"
                        />
                      </div>
                    </div>
                  </TabPanel>
                </VerticalTab>
                <DialogActions className="mb-3  mr-2">
                  {dialogData ? (
                    <button
                      type="button"
                      // className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Insert
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary dark_btn"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </DialogActions>
                <UploadProgressManual data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  setUploadFileManual,
  getGenre,
  getLanguages,
  getRegion,
  getTeamMember,
  updateMovie,
  loadMovieData,
  createManual,
})(MovieFormNew);
