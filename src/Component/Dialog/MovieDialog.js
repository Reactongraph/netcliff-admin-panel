import React, { useState, useRef, useEffect } from "react";
import UploadProgress from "../../Pages/UploadProgress";
import { setUploadFile } from "../../store/Movie/movie.action";
//react-router-dom
import { useHistory, NavLink, useLocation } from "react-router-dom";
import { EMPTY_TMDB_MOVIES_DIALOGUE } from "../../store/Movie/movie.type";

//material-ui
import { Chip, DialogActions, Stack, Switch, Typography } from "@mui/material";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import TranslateIcon from "@mui/icons-material/Translate";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";

import Paper from "@mui/material/Paper";

import card from "../assets/images/1.png";
import thumb from "../assets/images/5.png";

//editor
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

//Multi Select Dropdown
import Multiselect from "multiselect-react-dropdown";

//react-redux
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

//all actions

import {
  updateMovie,
  loadMovieData,
  ImdbMovieCreate,
} from "../../store/Movie/movie.action";
import { getGenre } from "../../store/Genre/genre.action";
import { getRegion } from "../../store/Region/region.action";
import { getTeamMember } from "../../store/TeamMember/teamMember.action";

//jquery
import $ from "jquery";
import noImage from "../../Component/assets/images/noImage.png";
//Alert

import { projectName, baseURL, secretKey } from "../../util/config";
import { Toast } from "../../util/Toast_";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import VideoLoader from "../../util/VideoLoader";
import { handleImageError } from "../../util/helperFunctions";
import VerticalTab, { TabPanel } from "../Tab/VerticalTab";
import GeoBlockingForm from "./GeoBlockingForm";
import { videoQualities } from "../../util/videoQualities";
import { maturityRatings } from "../../util/maturityRatings";
import axios from "axios";
import { getLanguages } from "../../store/Language/language.action";
import { uploadFileToSignedUrl } from "../../util/aws";
import { contentRatings } from "../../util/contentRatings";

const MovieDialog = (props) => {
  const { region } = useSelector((state) => state.region);
  const { teamMember } = useSelector((state) => state.teamMember);
  const { languages: reducerLanguages } = useSelector(
    (state) => state.language
  );
  const { genre } = useSelector((state) => state.genre);
  const dispatch = useDispatch();

  const ref = useRef();
  const seoDesEditor = useRef(null);
  const imageRef = useRef();
  const editor = useRef(null);
  const history = useHistory();

  const handlePaste = (e) => {
    const bufferText = (e?.originalEvent || e).clipboardData.getData(
      "text/plain"
    );
    e.preventDefault();
    document.execCommand("insertText", false, bufferText);
  };

  const [tabValue, setTabValue] = useState(0);
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

  const [tmdbId, setTmdbId] = useState("");
  const [tmdbTitle, setTmdbTitle] = useState("");
  const [genres, setGenres] = useState([]);
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [description, setDescription] = useState("");
  const [imageUpdateType, setImageUpdateType] = useState();
  const [trailerUrl, setTrailerUrl] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [movieId, setMovieId] = useState("");
  const [type, setType] = useState("Premium");
  const [runtime, setRuntime] = useState("");
  const [videoType, setVideoType] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [m3u8Url, setM3u8Url] = useState("");
  const [movUrl, setMovUrl] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const [mkvUrl, setMkvUrl] = useState("");
  const [webmUrl, setWebmUrl] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [update, setUpdate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [convertUpdateType, setConvertUpdateType] = useState({
    image: "",
    thumbnail: "",
    link: "",
  });
  const [genreData, setGenreData] = useState([{ value: "", label: "" }]);
  const [editorOptions, setEditorOptions] = useState({
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
  });

  const [allowedCountries, setAllowedCountries] = useState([]);
  const [blockedCountries, setBlockedCountries] = useState([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoTags, setSeoTags] = useState([]);
  const [tagValue, setTagvalue] = useState("");
  const [language, setLanguage] = useState("");
  const [maturity, setMaturity] = useState("");
  const [videoQuality, setVideoQuality] = useState("");
  const [contentRating, setContentRating] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newReleased, setNewReleased] = useState(false);

  const [existingHlsFileName, setExistingHlsFileName] = useState("");

  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    movieImageResURL: "",
    movieVideoResURL: "",
  });

  const location = useLocation();

  const dialogDatas = JSON.parse(localStorage.getItem("updateMovieData1"));

  const dialogData = location?.state ? location?.state : dialogDatas;
  const [data, setData] = useState({
    title: "",
    description: "",
    year: "",
    categories: "",
    genres: [],
    thumbnail: [],
    image: [],
    type: "",
    country: "",
    runtime: "",
    tmdbMovieId: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
  });

  const [error, setError] = useState({
    videoType: "",
    youtubeUrl: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    m3u8Url: "",
  });

  const { movieDetailsTmdb, showData } = useSelector((state) => state.movie);

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getGenre());
    dispatch(getRegion());
    dispatch(getLanguages());
  }, []);

  useEffect(() => {
    if (dialogDatas) {
      dispatch(getTeamMember(dialogDatas?._id));
    }
  }, []);

  //set data in dialog

  const genreId_ = dialogData?.genre?.map((value) => {
    return value._id;
  });

  const genreId = movieDetailsTmdb?.genre?.map((id) => {
    return id;
  });

  useEffect(() => {
    setGenres(genreId);
  }, [movieDetailsTmdb]);

  useEffect(() => {
    if (dialogData) {
      setTitle(dialogData.title);

      setUpdateType(dialogData?.updateType);
      setConvertUpdateType({
        image: dialogData?.convertUpdateType?.image
          ? dialogData?.convertUpdateType?.image
          : "",
        thumbnail: dialogData?.convertUpdateType?.thumbnail
          ? dialogData?.convertUpdateType?.thumbnail
          : "",
        link: dialogData?.convertUpdateType?.link
          ? dialogData?.convertUpdateType?.link
          : "",
      });
      setDescription(dialogData.description);
      setYear(dialogData.year);
      setCountry(dialogData.region._id);
      setGenres(genreId !== undefined ? genreId : genreId_);
      setMovieId(dialogData._id);
      setType(dialogData.type);
      setThumbnailPath(dialogData.thumbnail);
      setImagePath(dialogData?.image);

      setRuntime(dialogData.runtime);
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
      } else if (dialogData?.videoType == 7) {
        setVideoPath(dialogData?.link);
      }

      setSeoTitle(dialogData.seoTitle);
      setSeoDescription(dialogData.seoDescription);
      setSeoTags(dialogData.seoTags);

      // const languageId_ = dialogData?.language?.map((value) => {
      //   return value?._id || value;
      // });

      setLanguage(
        dialogData.language?.[0]?._id
          ? dialogData.language[0]._id
          : dialogData.language[0]
      );
      setMaturity(dialogData.maturity);
      setVideoQuality(dialogData.videoQuality);
      // setContentRating(dialogData.contentRating);
      setExclusive(dialogData.exclusive);
      setFeatured(dialogData.featured);
      setNewReleased(dialogData.newReleased);
      setExistingHlsFileName(dialogData.hlsFileName || "");
    }
    localStorage.setItem("trailerId", JSON.stringify(dialogData));
    localStorage.setItem("movieTitle", dialogData?.title);
  }, []);

  const tmdbMovieDetail = async () => {
    await props.loadMovieData(tmdbId, tmdbTitle);
  };

  //Set Data after Getting
  useEffect(() => {
    setGenreData(
      genre?.map((val) => ({
        value: val?.name,
        label: val?.name,
      }))
    );
  }, [genre]);

  //Set Data after Getting
  useEffect(() => {
    setCountries(region);
    if (
      dialogData?.blockedCountries &&
      dialogData.blockedCountries.length > 0
    ) {
      const blockedList = [];
      const allowedList = [];
      region.forEach((r) => {
        if (dialogData.blockedCountries.includes(r._id)) {
          blockedList.push(r);
        } else {
          allowedList.push(r);
        }
      });
      setBlockedCountries(blockedList);
      setAllowedCountries(allowedList);
    } else {
      setBlockedCountries([]);
      setAllowedCountries(region);
    }
  }, [region]);

  //call teamMember and set teamMember

  useEffect(() => {
    setTeamMemberData(teamMember);
  }, [teamMember]);

  let folderStructureMovieImage = projectName + "movieImage";

  //  Image Load
  const imageLoad = async (event) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      image: 1,
    });
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResURL({ ...resURL, movieImageResURL: resDataUrl });

    setImagePath(imageURL);
  };
  let folderStructureThumbnail = projectName + "movieThumbnail";

  // Thumbnail Load
  const thumbnailLoad = async (event) => {
    setConvertUpdateType({
      ...convertUpdateType,
      thumbnail: 1,
    });
    setUpdateType(1);
    setThumbnail(event.target.files[0]);

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureThumbnail
    );
    setResURL({ ...resURL, thumbnailImageResURL: resDataUrl });
    setThumbnailPath(imageURL);
  };

  let folderStructureMovieVideo = projectName + "movieVideo";

  const videoLoad = async (event) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      link: 1,
    });
    setVideo(event.target.files[0]);
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(event.target.files[0]);
    videoElement.addEventListener("loadedmetadata", () => {
      const durationInSeconds = videoElement.duration;
      const durationInMilliseconds = durationInSeconds * 1000;
      setRuntime(parseInt(durationInMilliseconds));
    });

    // try {
    const formData = new FormData();
    formData.append("folderStructure", folderStructureMovieVideo);
    formData.append("keyName", event.target.files[0]?.name);
    formData.append("content", event.target.files[0]);
    const uploadUrl = baseURL + `file/upload-file`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);
    // Set up event listener for tracking progress
    xhr.upload.onprogress = (event) => {
      const progress = (event.loaded / event.total) * 100;
      setUploadProgress(progress);
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

                    setVideoPath(imageURL);
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

    // Set request headers
    xhr.setRequestHeader("key", secretKey); // Your API key if required

    // Send the request with the form data
    xhr.send(formData);
  };

  const validateUrlByType = (url, videoType) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const setUrlErrorByType = (videoType, url, setError, updateError) => {
    const error = {};
    if (!validateUrlByType(url, videoType)) {
      error[`${videoType}Url`] = "Invalid URL format";
      updateError(error);
    }
  };

  //insert function

  const handleSubmit = () => {
    console.log({
      runtime,
      type,
      maturity,
      language,
      videoQuality,
      videoType,
    });
    if (
      !runtime ||
      !type ||
      type === "select Type" ||
      !maturity ||
      !language ||
      !videoQuality ||
      // !contentRating ||
      videoType === "selectVideoType" ||
      (videoType == 1 && !youtubeUrl) ||
      (videoType == 1 && !m3u8Url) ||
      (videoType == 2 && !movUrl) ||
      (videoType == 3 && !mp4Url) ||
      (videoType == 4 && !mkvUrl) ||
      (videoType == 5 && !webmUrl) ||
      (videoType == 6 && !embedUrl) ||
      (videoType === 7 && !videoPath)
    ) {
      const error = {};
      if (!runtime) error.runtime = "runTime is Required";

      if (videoType == 0 && !youtubeUrl)
        error.youtubeUrl = "Link is Not Required !";
      if (videoType == 1 && !m3u8Url) error.m3u8Url = "Link is Not Required !";
      if (videoType == 2 && !movUrl) error.movUrl = "Link is Not Required !";
      if (videoType == 3 && !mp4Url) error.mp4Url = "Link is Not Required !";
      if (videoType == 4 && !mkvUrl) error.mkvUrl = "Link is Not Required !";
      if (videoType == 5 && !webmUrl) error.webmUrl = "Link is Not Required !";
      if (videoType == 6 && !embedUrl)
        error.embedUrl = "Video is Not Required !";
      if (videoType == 7 && video?.length === 0)
        error.video = "Link is Not Required !";
      if (type === "select Type" || !type) error.type = "Type Is Required";
      if (!runtime) error.runtime = "runtime is Required !";
      if (videoType == "selectVideoType" || !videoType)
        error.videoType = "Video Type is Required !";
      if (!language) error.language = "Language is Required !";
      if (!maturity) error.maturity = "Maturity rating is required !";
      if (!videoQuality) error.videoQuality = "Video quality is required !";
      // if (!contentRating) error.contentRating = "Conent rating isrequired !";

      switch (videoType) {
        case 1:
          setUrlErrorByType(videoType, m3u8Url, setError, (error) =>
            setError({ ...error, m3u8Url: error[`${m3u8Url}Url`] })
          );
          break;
        case 2:
          setUrlErrorByType(videoType, movUrl, setError, (error) =>
            setError({ ...error, movUrl: error[`${movUrl}Url`] })
          );
          break;
        case 3:
          setUrlErrorByType(videoType, mp4Url, setError, (error) =>
            setError({ ...error, mp4Url: error[`${mp4Url}Url`] })
          );
          break;
        case 4:
          setUrlErrorByType(videoType, mkvUrl, setError, (error) =>
            setError({ ...error, mkvUrl: error[`${mkvUrl}Url`] })
          );
          break;
        case 5:
          setUrlErrorByType(videoType, webmUrl, setError, (error) =>
            setError({ ...error, webmUrl: error[`${webmUrl}Url`] })
          );
          break;
        case 6:
          setUrlErrorByType(videoType, embedUrl, setError, (error) =>
            setError({ ...error, embedUrl: error[`${embedUrl}Url`] })
          );
          break;
        default:
          break;
      }

      return setError({ ...error });
    } else {
      if (dialogData) {
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
          language: [language],
          seoTitle,
          seoDescription,
          seoTags,
          blockedCountries: blockedCountries.map((a) => a._id),
          region: country,
          convertUpdateType: convertUpdateType,
          updateType: updateType,
          runtime,
          videoType,
          genre: genres,
          hlsFileName: existingHlsFileName,
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
              : videoType == 7
              ? ""
              : "",
        };
        if (resURL?.thumbnailImageResURL) {
          objData.thumbnail = resURL?.thumbnailImageResURL;
        }
        if (resURL?.movieImageResURL) {
          objData.image = resURL?.movieImageResURL;
        }
        if (resURL?.movieImageResURL && videoType == 7) {
          objData.link = resURL?.movieImageResURL;
        }
        if (videoType == 8 && resURL?.hlsFileName) {
          objData.hlsFileName = resURL?.hlsFileName;
          objData.hlsFileExt = resURL?.hlsFileExt;
        }
        props.updateMovie(objData, dialogData?._id);
      } else {
        let imdbObjData = {
          tmdbId: movieDetailsTmdb?.TmdbMovieId,
          videoType,
          updateType: updateType,

          maturity,
          videoQuality,
          contentRating: Math.random() * 10,
          exclusive,
          featured,
          newReleased,
          language: [language],
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
          imdbObjData.hlsFileName = resURL.hlsFileName;
          imdbObjData.hlsFileExt = resURL.hlsFileExt;
        }

        props.ImdbMovieCreate(imdbObjData);
      }

      setUpdate("update");

      setTimeout(() => {
        dispatch({ type: EMPTY_TMDB_MOVIES_DIALOGUE });
        history.push({
          pathname: "/admin/movie",
          state: data,
        });
      }, 3000);

      localStorage.removeItem("updateMovieData");
    }
  };

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    genres?.push(selectedItem?._id);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");
    history.replace("/admin/movie");
  };

  const handleClick = (e) => {
    ref.current.click();
  };

  const handleClickImage = (e) => {
    imageRef.current.click();
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

  // function onSelectLanguages(selectedList, selectedItem) {
  //   languages?.push(selectedItem?._id);
  // }

  // function onRemoveLanguages(selectedList, removedItem) {
  //   setLanguage(selectedList.map((data) => data._id));
  // }

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
      setExistingHlsFileName(name);
      setLoading(false);
      Toast("success", "File uploaded.");
    } catch (error) {
      setLoading(false);
      Toast("error", "Something went wrong while uploading file.");
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
      // error?.contentRating
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

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          {dialogData && (
            <div className="header_heading p_zero">
              <h3>{dialogData?.title}</h3>
              <div className="header_heading_right_col">
                <ul className="sub_tab_col">
                  <li>
                    <NavLink to="/admin/movie/movie_form">
                      <EditIcon />
                      Edit
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/movie/trailer">
                      <i className="ri-vidicon-line mr-1" />
                      Trailer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/movie/cast">
                      <RecentActorsIcon />
                      Cast
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/movie/subtitle">
                      <TranslateIcon />
                      Subtitles
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="row ">
            <div className="col-lg-12">
              {dialogData ? (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card mt-3 ml-4"></div>
                </div>
              ) : (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div className="header_heading p_zero">
                    <h3>Insert Movie</h3>
                    <div className="header_heading_right_col">
                      <NavLink
                        class="defualt_btn"
                        id="pills-home-tab"
                        data-toggle="pill"
                        href="#pills-home"
                        to="/admin/movie/movie_form"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        <GetAppIcon />
                        TMDB
                      </NavLink>
                      <NavLink
                        class="defualt_btn whte_btn"
                        id="pills-profile-tab"
                        data-toggle="pill"
                        href="#pills-profile"
                        to="/admin/movie/movie_manual"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="false"
                      >
                        <AddIcon
                          className="mb-1"
                          sx={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Manual
                      </NavLink>
                    </div>
                  </div>

                  <div class="iq-card">
                    <div class="iq-card-body">
                      <ul
                        class="nav nav-pills mb-2 ml-0"
                        id="pills-tab"
                        style={{ marginLeft: "21px" }}
                        role="tablist"
                      >
                        <li class="nav-item navCustom"></li>
                        <li class="nav-item navCustom"></li>
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
              )}

              {!dialogData && (
                <>
                  <div className="import_content">
                    <h3>Import Contents From TMDB</h3>
                    <div className="import_fields">
                      <input
                        class="form-control"
                        id="imdb_id"
                        type="text"
                        placeholder="Enter IMDB ID. Ex:tt0120338"
                        value={tmdbId}
                        onChange={(e) => {
                          setTmdbId(e.target.value);
                        }}
                      />
                      <p className="or_class">or</p>
                      <input
                        class="form-control"
                        id="imdb_id"
                        type="text"
                        placeholder="Enter Movie Title"
                        value={tmdbTitle}
                        onChange={(e) => {
                          setTmdbTitle(e.target.value);
                        }}
                      />
                      <button
                        type="submit"
                        onClick={tmdbMovieDetail}
                        id="import_btn"
                        className="defualt_btn"
                      >
                        {" "}
                        Fetch{" "}
                      </button>
                    </div>
                    <h4>
                      {" "}
                      Get IMDB or IMDB ID from here:{" "}
                      <ard-body
                        href="https://www.themoviedb.org/movie/"
                        target="_blank"
                      >
                        TheMovieDB.org
                      </ard-body>{" "}
                      or{" "}
                      <a href="https://www.imdb.com/" target="_blank">
                        Imdb.com
                      </a>{" "}
                    </h4>
                  </div>
                </>
              )}

              <div className="iq-card mb-5 ">
                <div className="iq-card-body">
                  {showData ? (
                    <>
                      <VerticalTab
                        tabs={tabs}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      >
                        <TabPanel value={tabValue} index={0}>
                          <div class="ml-3">
                            <label className="float-left styleForTitle movieForm">
                              Title
                            </label>

                            <input
                              type="text"
                              placeholder="Title"
                              className="form-control form-control-line"
                              Required
                              name="title"
                              value={movieDetailsTmdb?.title}
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
                          <div class="ml-3 my-4">
                            <label
                              htmlFor="description"
                              className="styleForTitle mt-3 movieForm"
                            >
                              Description
                            </label>

                            <SunEditor
                              value={movieDetailsTmdb?.description}
                              setContents={movieDetailsTmdb?.description}
                              ref={editor}
                              height={318}
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
                          <div className="ml-3 my-4">
                            <label className="float-left styleForTitle movieForm">
                              Release Year
                            </label>

                            <input
                              type="data"
                              placeholder="YYYY-MM-DD"
                              className="form-control form-control-line"
                              Required
                              min="1950"
                              value={movieDetailsTmdb?.year}
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
                          <div className="ml-3 my-4">
                            <label className="float-left">
                              Runtime (MilliSeconds)
                            </label>
                            <input
                              type="text"
                              placeholder="Runtime"
                              className="form-control form-control-line"
                              required
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
                          <div className="ml-3 my-4">
                            <label className="float-left movieForm">
                              Free/Premium
                            </label>

                            <select
                              name="type"
                              className="form-control form-control-line selector"
                              id="type"
                              value={type}
                              onChange={(e) => {
                                setType(e.target.value);

                                if (!e.target.value) {
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
                              <option value="select Type">Select Type</option>
                              <option value="Free">Free</option>
                              <option vlaue="Premium">Premium</option>
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
                          <div className="ml-3 my-4">
                            <label
                              htmlFor="earning"
                              className="styleForTitle movieForm"
                            >
                              Country
                            </label>
                            <select
                              name="type"
                              style={{ textTransform: "capitalize" }}
                              className="form-control form-control-line"
                              id="type"
                              value={country}
                              onChange={(e) => {
                                setCountry(e.target.value);

                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    country: "Country is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    country: "",
                                  });
                                }
                              }}
                            >
                              <option>Select Country</option>
                              {countries.map((data, i) => {
                                return (
                                  <option
                                    value={data._id}
                                    key={i}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {data.name.toLowerCase()}
                                  </option>
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
                          <div className="ml-3 my-4">
                            <label className="styleForTitle movieForm">
                              Genre
                            </label>

                            <Multiselect
                              displayValue="name"
                              options={genre ? genre : null}
                              selectedValues={
                                movieDetailsTmdb
                                  ? movieDetailsTmdb?.genre
                                  : null
                              }
                              onSelect={onSelect}
                              onRemove={onRemove}
                              // id="css_custom"
                              // placeholder="Select Genre"
                              style={{
                                chips: {},
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
                          <div className="col-md-12 my-2">
                            <label className="styleForTitle movieForm">
                              Language
                            </label>
                            {/* {dialogData ? (
                              <Multiselect
                                options={reducerLanguages}
                                selectedValues={dialogData?.language}
                                onSelect={onSelectLanguages}
                                onRemove={onRemoveLanguages}
                                displayValue="name"
                                id="css_custom"
                                style={{
                                  chips: {},
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
                                options={reducerLanguages}
                                selectedValues={movieDetailsTmdb?.languages}
                                onSelect={onSelectLanguages}
                                onRemove={onRemoveLanguages}
                                displayValue="name"
                                id="css_custom"
                                style={{
                                  chips: {},
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
                              className="form-control form-control-line"
                              id="type"
                              value={language}
                              style={{ textTransform: "capitalize" }}
                              onChange={(e) => {
                                setLanguage(e.target.value);

                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    language: "Language is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    language: "",
                                  });
                                }
                              }}
                            >
                              <option>Select Language</option>
                              {reducerLanguages.map((data, i) => {
                                return (
                                  <option
                                    value={data._id}
                                    key={i}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {data.name.toLowerCase()}
                                  </option>
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
                          <div className="ml-3 my-4">
                            <label className="float-left movieForm">
                              Maturity Rating
                            </label>

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
                          <div className="ml-3 my-4">
                            <label className="float-left movieForm">
                              Video Quality
                            </label>

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
                          {/* <div className="ml-3 my-4">
                            <label className="float-left movieForm">
                              Content Rating
                            </label>

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
                                    contentRating:
                                      "Content Rating is Required!",
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
                              {contentRatings.map((lang) => {
                                return (
                                  <option key={lang.value} value={lang.value}>
                                    {lang.label}
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
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                          <div class="ml-3" style={{ minWidth: "50vw" }}>
                            <label
                              className="movieForm"
                              style={{
                                paddingTop: "1.5px",
                                marginTop: "9px",
                              }}
                            >
                              Video Type
                            </label>
                            <div>
                              <select
                                id="contentType"
                                name="contentType"
                                class="form-control form-control-line"
                                required
                                value={videoType}
                                onChange={(e) => {
                                  setVideoType(e.target.value);
                                  if (!e.target.value === "selectVideoType") {
                                    return setError({
                                      ...error,
                                      videoType: "Video Tyasdsdpe is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      videoType: "",
                                    });
                                  }
                                }}
                              >
                                <option value="selectVideoType">
                                  Select Video Type
                                </option>
                                <option value={0}>Youtube Url </option>
                                <option value={1}>m3u8 Url </option>
                                <option value={2}>MOV Url </option>
                                <option value={3}>MP4 Url</option>
                                <option value={4}>MKV Url</option>
                                <option value={5}>WEBM Url</option>
                                <option value={6}>Embed source</option>
                                <option value={7}>
                                  File (MP4/MOV/MKV/WEBM)
                                </option>
                                <option value={8}>
                                  File (MP4/MOV/MKV/WEBM for HLS)
                                </option>
                              </select>
                              {error.videoType && (
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
                              )}
                            </div>
                          </div>

                          <div class="my-4 ml-3">
                            <label
                              className="movieForm"
                              style={{ marginTop: "14px" }}
                              onChange={(e) => {
                                setVideoUrl(e.target.value);
                                if (!e.target.value) {
                                  return setError({
                                    ...error,
                                    trailerUrl: "Trailer is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    trailerUrl: "",
                                  });
                                }
                              }}
                            >
                              {existingHlsFileName ? "Video" : "Video URL"}
                            </label>
                            {error.videoUrl && (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.videoUrl}
                                </Typography>
                              </div>
                            )}
                            {videoType == 0 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={youtubeUrl}
                                  onChange={(e) => {
                                    setYoutubeUrl(e.target.value);
                                  }}
                                />
                              </>
                            )}
                            {videoType == 1 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={m3u8Url}
                                  onChange={(e) => {
                                    setM3u8Url(e.target.value);
                                  }}
                                />
                              </>
                            )}
                            {videoType == 2 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={movUrl}
                                  onChange={(e) => {
                                    setMovUrl(e.target.value);
                                  }}
                                />
                              </>
                            )}
                            {videoType == 3 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={mp4Url}
                                  onChange={(e) => {
                                    setMp4Url(e.target.value);
                                  }}
                                />
                              </>
                            )}
                            {videoType == 4 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={mkvUrl}
                                  onChange={(e) => {
                                    setMkvUrl(e.target.value);
                                  }}
                                />
                              </>
                            )}
                            {videoType == 5 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={webmUrl}
                                  onChange={(e) => {
                                    setWebmUrl(e.target.value);
                                  }}
                                />
                              </>
                            )}
                            {videoType == 6 && (
                              <>
                                <input
                                  type="text"
                                  id="link"
                                  placeholder="Link"
                                  class="form-control "
                                  value={embedUrl}
                                  onChange={(e) => {
                                    setEmbedUrl(e.target.value);
                                  }}
                                />
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
                                {loading ? (
                                  <div style={{ marginTop: "30px" }}>
                                    {" "}
                                    <VideoLoader />
                                  </div>
                                ) : (
                                  videoPath && (
                                    <>
                                      <video
                                        height="100px"
                                        width="100px"
                                        controls
                                        alt="app"
                                        src={videoPath}
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
                                  )
                                )}
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
                                    {existingHlsFileName && (
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
                                        {existingHlsFileName}.m3u8
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                          <div className="ml-3">
                            <label className="mt-3 movieForm">Thumbnail </label>
                            <div className="d-flex justify-content-center align-item-center">
                              <img
                                alt="app"
                                src={
                                  movieDetailsTmdb.thumbnail
                                    ? movieDetailsTmdb.thumbnail
                                    : thumb
                                }
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                  borderRadius: "0.25rem",
                                  marginTop: 10,
                                  marginBottom: 30,
                                  height: "240px",
                                  width: "170px",
                                }}
                                onError={(e) => handleImageError(e, thumb)}
                              />
                            </div>

                            {!thumbnailPath ? (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.thumbnail}
                                </Typography>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div class="my-4 ml-3">
                            <label className="mt-3 movieForm">Image</label>
                            <div className="d-flex justify-content-center align-item-center">
                              <img
                                className="img-fluid"
                                alt="app"
                                src={
                                  movieDetailsTmdb.image
                                    ? movieDetailsTmdb.image
                                    : card
                                }
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                  borderRadius: "0.25rem",
                                  marginTop: 10,
                                  marginBottom: 30,
                                  maxWidth: "305px",
                                  height: "auto",
                                }}
                                onError={(e) => handleImageError(e, card)}
                              />
                            </div>

                            {!imagePath ? (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.image}
                                </Typography>
                              </div>
                            ) : (
                              ""
                            )}
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
                                    seoDescription:
                                      "SEO Description is Required !",
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
                            <div
                              className="col-md-6 my-2"
                              style={{ width: 450 }}
                            >
                              <GeoBlockingForm
                                originalList={allowedCountries}
                                action={moveToBlocked}
                                actionTitle="Block"
                                title="Available Regions"
                              />
                            </div>
                            <div
                              className="col-md-6 my-2"
                              style={{ width: 450 }}
                            >
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
                      <DialogActions className="mb-3 mr-3">
                        <button
                          type="button"
                          className="btn btn-success btn-sm px-3 py-1 mt-4"
                          onClick={handleSubmit}
                        >
                          Insert
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-3 py-1 mt-4"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      </DialogActions>
                    </>
                  ) : (
                    dialogData && (
                      <>
                        <VerticalTab
                          tabs={tabs}
                          tabValue={tabValue}
                          setTabValue={setTabValue}
                        >
                          <TabPanel value={tabValue} index={0}>
                            <div class="custom_field_col wdt100">
                              <label>Title</label>

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
                                height={318}
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
                            <div class="custom_field_col wdt100">
                              <label>Release Year</label>

                              <input
                                type="data"
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
                            <div class="custom_field_col wdt100">
                              <label>Runtime (MilliSeconds)</label>
                              <input
                                type="text"
                                placeholder="Runtime"
                                className="form-control form-control-line"
                                required
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
                            <div class="custom_field_col wdt100">
                              <label>Free/Premium</label>

                              <select
                                name="type"
                                className="form-control form-control-line selector"
                                id="type"
                                value={type}
                                onChange={(e) => {
                                  setType(e.target.value);

                                  if (!e.target.value) {
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
                                <option value="select Type">Select Type</option>
                                <option value="Free">Free</option>
                                <option vlaue="Premium">Premium</option>
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
                            <div class="custom_field_col wdt100">
                              <label htmlFor="earning">Country</label>
                              <select
                                name="type"
                                style={{ textTransform: "capitalize" }}
                                className="form-control form-control-line"
                                id="type"
                                value={country}
                                onChange={(e) => {
                                  setCountry(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      country: "Country is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      country: "",
                                    });
                                  }
                                }}
                              >
                                <option>Select Country</option>
                                {countries.map((data, i) => {
                                  return (
                                    <option
                                      value={data._id}
                                      key={i}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {data.name.toLowerCase()}
                                    </option>
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
                            <div class="custom_field_col wdt100">
                              <label>Genre</label>

                              <Multiselect
                                displayValue="name"
                                options={genre ? genre : null}
                                selectedValues={
                                  dialogData ? dialogData?.genre : null
                                }
                                onSelect={onSelect}
                                onRemove={onRemove}
                                style={{
                                  chips: {},
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
                            <div class="custom_field_col wdt100">
                              <label>Language</label>
                              {/* {dialogData ? (
                                <Multiselect
                                  options={reducerLanguages}
                                  selectedValues={dialogData?.language}
                                  onSelect={onSelectLanguages}
                                  onRemove={onRemoveLanguages}
                                  displayValue="name"
                                  id="css_custom"
                                  style={{
                                    chips: {},
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
                                  options={reducerLanguages}
                                  selectedValues={movieDetailsTmdb?.languages}
                                  onSelect={onSelectLanguages}
                                  onRemove={onRemoveLanguages}
                                  displayValue="name"
                                  id="css_custom"
                                  style={{
                                    chips: {},
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
                              )} */}
                              <select
                                name="type"
                                className="form-control form-control-line"
                                id="type"
                                value={language}
                                style={{ textTransform: "capitalize" }}
                                onChange={(e) => {
                                  setLanguage(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      language: "Language is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      language: "",
                                    });
                                  }
                                }}
                              >
                                <option>Select Language</option>
                                {reducerLanguages.map((data, i) => {
                                  return (
                                    <option
                                      value={data._id}
                                      key={i._id}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {data.name.toLowerCase()}
                                    </option>
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
                            <div class="custom_field_col wdt100">
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
                                <option value="maturity">
                                  Select Maturity
                                </option>
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
                            <div class="custom_field_col wdt100">
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
                                      videoQuality:
                                        "Video quality is Required!",
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
                            {/* <div class="custom_field_col wdt100">
                            <label className="float-left movieForm">
                              Content Rating
                            </label>

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
                                    contentRating:
                                      "Content Rating is Required!",
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
                              {contentRatings.map((lang) => {
                                return (
                                  <option key={lang.value} value={lang.value}>
                                    {lang.label}
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
                                <label className="float-left">
                                  New Released
                                </label>
                              </div>
                            </div>
                          </TabPanel>
                          <TabPanel value={tabValue} index={1}>
                            <div class="custom_field_col wdt100">
                              <label>Video Type</label>
                              <div>
                                <select
                                  id="contentType"
                                  name="contentType"
                                  class="form-control form-control-line"
                                  required
                                  value={videoType}
                                  onChange={(e) => {
                                    setVideoType(e.target.value);
                                    if (!e.target.value === "selectVideoType") {
                                      return setError({
                                        ...error,
                                        videoType:
                                          "Video Tyasdsdpe is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        videoType: "",
                                      });
                                    }
                                  }}
                                >
                                  <option value="selectVideoType">
                                    Select Video Type
                                  </option>
                                  <option value={0}>Youtube Url </option>
                                  <option value={1}>m3u8 Url </option>
                                  <option value={2}>MOV Url </option>
                                  <option value={3}>MP4 Url</option>
                                  <option value={4}>MKV Url</option>
                                  <option value={5}>WEBM Url</option>
                                  <option value={6}>Embed source</option>
                                  <option value={7}>
                                    File (MP4/MOV/MKV/WEBM)
                                  </option>
                                  <option value={8}>
                                    File (MP4/MOV/MKV/WEBM for HLS)
                                  </option>
                                </select>
                                {error.videoType && (
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
                                )}
                              </div>
                            </div>

                            <div class="custom_field_col wdt100">
                              <label
                                onChange={(e) => {
                                  setVideoUrl(e.target.value);
                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      trailerUrl: "Trailer is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      trailerUrl: "",
                                    });
                                  }
                                }}
                              >
                                {existingHlsFileName ? "Video" : "Video URL"}
                              </label>
                              {error.videoUrl && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.videoUrl}
                                  </Typography>
                                </div>
                              )}
                              {videoType == 0 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={youtubeUrl}
                                    onChange={(e) => {
                                      setYoutubeUrl(e.target.value);
                                    }}
                                  />
                                </>
                              )}
                              {videoType == 1 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={m3u8Url}
                                    onChange={(e) => {
                                      setM3u8Url(e.target.value);
                                    }}
                                  />
                                </>
                              )}
                              {videoType == 2 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={movUrl}
                                    onChange={(e) => {
                                      setMovUrl(e.target.value);
                                    }}
                                  />
                                </>
                              )}
                              {videoType == 3 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={mp4Url}
                                    onChange={(e) => {
                                      setMp4Url(e.target.value);
                                    }}
                                  />
                                </>
                              )}
                              {videoType == 4 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={mkvUrl}
                                    onChange={(e) => {
                                      setMkvUrl(e.target.value);
                                    }}
                                  />
                                </>
                              )}
                              {videoType == 5 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={webmUrl}
                                    onChange={(e) => {
                                      setWebmUrl(e.target.value);
                                    }}
                                  />
                                </>
                              )}
                              {videoType == 6 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={embedUrl}
                                    onChange={(e) => {
                                      setEmbedUrl(e.target.value);
                                    }}
                                  />
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
                                  {loading ? (
                                    <div style={{ marginTop: "30px" }}>
                                      {" "}
                                      <VideoLoader />
                                    </div>
                                  ) : (
                                    videoPath && (
                                      <>
                                        <video
                                          height="100px"
                                          width="100px"
                                          controls
                                          alt="app"
                                          src={videoPath}
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
                                    )
                                  )}
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
                                      {existingHlsFileName && (
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
                                          {existingHlsFileName}.m3u8
                                        </div>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </TabPanel>

                          <TabPanel value={tabValue} index={2}>
                            <div class="custom_field_col wdt100">
                              <label>Thumbnail</label>
                              <div className="d-flex align-item-center">
                                {thumbnailPath ? (
                                  <>
                                    <div>
                                      <input
                                        ref={ref}
                                        type="file"
                                        className="form-control"
                                        id="customFile"
                                        accept="image/png, image/jpeg ,image/jpg"
                                        Required=""
                                        onChange={thumbnailLoad}
                                        style={{ display: "none" }}
                                        enctype="multipart/form-data"
                                      />
                                      <img
                                        onClick={handleClick}
                                        alt="app"
                                        src={thumbnailPath || noImage}
                                        style={{
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                          borderRadius: "0.25rem",
                                          marginTop: 10,
                                          marginBottom: 30,
                                          height: "240px",
                                          width: "170px",
                                          // maxWidth: "150px",
                                          // height: "auto",
                                        }}
                                        onError={(e) =>
                                          handleImageError(e, noImage)
                                        }
                                      />
                                    </div>

                                    <div
                                      className="img-container"
                                      style={{
                                        display: "inline",
                                        position: "relative",
                                        float: "left",
                                      }}
                                    ></div>
                                  </>
                                ) : (
                                  <div
                                    style={{
                                      maxWidth: 345,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      "& > *": {
                                        marginBottom: "22px",
                                      },
                                    }}
                                  >
                                    <Paper elevation={5}>
                                      <div>
                                        <input
                                          ref={ref}
                                          type="file"
                                          className="form-control"
                                          id="customFile"
                                          accept="image/png, image/jpeg ,image/jpg"
                                          Required=""
                                          onChange={thumbnailLoad}
                                          style={{ display: "none" }}
                                          enctype="multipart/form-data"
                                        />
                                      </div>
                                      <img
                                        src={thumb || noImage}
                                        alt=""
                                        height="250"
                                        width="170"
                                        style={{
                                          zIndex: "-1",
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                          borderRadius: "0.25rem",
                                        }}
                                        onClick={handleClick}
                                        onError={(e) =>
                                          handleImageError(e, noImage)
                                        }
                                      />
                                    </Paper>
                                  </div>
                                )}
                              </div>

                              {!thumbnailPath ? (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.thumbnail}
                                  </Typography>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            <div class="custom_field_col wdt100">
                              <label>Image</label>
                              <div className="d-flex justify-content-center align-item-center">
                                {imagePath ? (
                                  <>
                                    <div>
                                      <input
                                        ref={imageRef}
                                        type="file"
                                        className="form-control"
                                        id="customFile"
                                        accept="image/png, image/jpeg ,image/jpg"
                                        Required=""
                                        onChange={imageLoad}
                                        style={{
                                          display: "none",
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                          borderRadius: "0.25rem",
                                        }}
                                        enctype="multipart/form-data"
                                      />
                                    </div>
                                    <img
                                      onClick={handleClickImage}
                                      className="img-fluid"
                                      alt="app"
                                      src={imagePath || noImage}
                                      style={{
                                        border:
                                          "0.5px solid rgba(255, 255, 255, 0.2)",
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                        borderRadius: "0.25rem",
                                        marginTop: 10,
                                        marginBottom: 30,
                                        maxWidth: "305px",
                                        height: "auto",
                                      }}
                                      onError={(e) =>
                                        handleImageError(e, noImage)
                                      }
                                    />

                                    <div
                                      className="img-container"
                                      style={{
                                        display: "inline",
                                        position: "relative",
                                        float: "left",
                                      }}
                                    ></div>
                                  </>
                                ) : (
                                  <div
                                    style={{
                                      maxWidth: 345,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      "& > *": {
                                        marginBottom: "22px",
                                      },
                                    }}
                                  >
                                    <Paper elevation={5}>
                                      <div>
                                        <input
                                          ref={imageRef}
                                          type="file"
                                          className="form-control"
                                          id="customFile"
                                          accept="image/png, image/jpeg ,image/jpg"
                                          Required=""
                                          onChange={imageLoad}
                                          style={{ display: "none" }}
                                          enctype="multipart/form-data"
                                        />
                                      </div>
                                      <img
                                        alt=""
                                        src={card}
                                        onClick={handleClickImage}
                                      />
                                    </Paper>
                                  </div>
                                )}
                              </div>

                              {!imagePath ? (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.image}
                                  </Typography>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </TabPanel>
                          <TabPanel value={tabValue} index={3}>
                            <div class="custom_field_col wdt100">
                              <label>SEO Title</label>
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
                            <div class="custom_field_col wdt100">
                              <label htmlFor="description">
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
                                      seoDescription:
                                        "SEO Description is Required !",
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
                            <div class="custom_field_col wdt100">
                              <label>SEO Tags</label>

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
                          </TabPanel>
                          <TabPanel value={tabValue} index={4}>
                            <div class="ml-3 row">
                              <div
                                className="col-md-6 my-2"
                                style={{ width: 450 }}
                              >
                                <GeoBlockingForm
                                  originalList={allowedCountries}
                                  action={moveToBlocked}
                                  actionTitle="Block"
                                  title="Available Regions"
                                />
                              </div>
                              <div
                                className="col-md-6 my-2"
                                style={{ width: 450 }}
                              >
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

                        <DialogActions className="mb-3 mr-3">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={loading === true ? true : false}
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary dark_btn"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>
                        </DialogActions>
                      </>
                    )
                  )}
                </div>

                <UploadProgress data={data} movieId={movieId} update={update} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  setUploadFile,
  getGenre,
  getRegion,
  getTeamMember,
  updateMovie,
  loadMovieData,
  ImdbMovieCreate,
})(MovieDialog);
