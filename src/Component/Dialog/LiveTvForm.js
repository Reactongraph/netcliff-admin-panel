import React, { useState, useRef, useEffect, useMemo } from "react";

//react-router-dom
import { useHistory, useLocation, NavLink } from "react-router-dom";

//material-ui
import { DialogActions, Typography } from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import TvIcon from "@mui/icons-material/Tv";
import EventNoteIcon from "@mui/icons-material/EventNote";

import noImage from "../assets/images/noImage.png";

//editor
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

//react-redux
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  updateMovie,
  loadMovieData,
  createManual,
} from "../../store/Movie/movie.action";
import { getGenre } from "../../store/Genre/genre.action";
import { getRegion } from "../../store/Region/region.action";
import { getTeamMember } from "../../store/TeamMember/teamMember.action";
import UploadProgressManual from "../../Pages/UploadProgressManual";
import { setUploadFileManual } from "../../store/Movie/movie.action";
//Alert

import { uploadFile } from "../../util/AwsFunction";
import { projectName } from "../../util/config";
import {
  capitalizeEachWord,
  handleImageError,
} from "../../util/helperFunctions";
import {
  createLiveChannel,
  createManualLiveChannel,
  getCountry,
  updateLiveTvChannel,
} from "../../store/LiveTv/liveTv.action";
import CustomRadioGroup from "../molecules/customRadioGroup";
import { SuccessAlert } from "../../util/Alert";
import Programs from "../molecules/liveTvPrograms";
import ProgramSchedule from "../molecules/bigCalender";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, TextField, IconButton, Grid } from "@mui/material";
import { Toast } from "../../util/Toast_";
import { InfoField } from "./LiveTvInfoDialog";
import { getLanguages } from "../../store/Language/language.action";
import { getRegion as continentRegion } from "../../store/ContinentRegion/continentRegion.action";
import { apiInstanceFetch } from "../../util/api";
import Multiselect from "multiselect-react-dropdown";
import { getAdminTvChannels } from "../../store/TvChannel/tvChannel.action";

const streamTypeOptions = [
  { value: "EXTERNAL", label: "External" },
  { value: "INTERNAL", label: "Internal" },
];

const LiveTvForm = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  const existingCreateData = JSON.parse(
    localStorage.getItem("createChannelData")
  );

  const existingUpdateData = JSON.parse(
    localStorage.getItem("updateChannelData")
  );

  const history = useHistory();

  const editor = useRef(null);
  const imageRef = useRef();
  const [description, setDescription] = useState("");

  const handlePaste = (e) => {
    const bufferText = (e?.originalEvent || e).clipboardData.getData(
      "text/plain"
    );
    e.preventDefault();
    document.execCommand("insertText", false, bufferText);
  };
  const [editorOptions] = useState({
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

  const handleClickImage = (e) => {
    imageRef.current.click();
  };

  const dispatch = useDispatch();
  const genre = useSelector((state) => state.genre?.genre);
  const languages = useSelector((state) => state.language?.languages);
  const continents = useSelector((state) => state.continentRegion.region);

  const countries = useSelector((state) => state.geography?.countries);
  const allCountriesList = useSelector((state) => state.region.region);
  const tvChannelsList = useSelector((state) => state.tvChannel.tvChannels);

  const [allCities, setAllCities] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [streamURL, setStreamURL] = useState("");
  const [error, setError] = useState("");
  const [resURL, setResURL] = useState("");
  const [streamType, setStreamType] = useState("EXTERNAL");
  // const [programs, setPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState("DETAILS"); //DETAILS | PROGRAMS
  const [copyStatus, setCopyStatus] = useState({
    streamURL: false,
    streamKey: false,
    publishURL: false,
  });

  const [tvChannels, setTvChannels] = useState([]);
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (mode === "fetch") {
      setChannelName(existingCreateData?.channelName || "");
      setImagePath(existingCreateData?.channelLogo || "");
      // ONLY SET setResURL IF CREATING ---
      setResURL(existingCreateData?.channelLogo || "");
      setStreamURL(existingCreateData?.streamURL || "");
      setDescription(existingCreateData?.description || "");
      setCategory(existingCreateData?.category || "");
      setLanguage(existingCreateData?.language || "");
    }
    if (mode === "update") {
      setChannelName(existingUpdateData?.channelName || "");
      setImagePath(existingUpdateData?.channelLogo || "");
      setStreamURL(existingUpdateData?.streamURL || "");
      setDescription(existingUpdateData?.description || "");
      setCategory(existingUpdateData?.category?._id || "");
      setLanguage(existingUpdateData?.language?._id || "");
      setStreamType(existingUpdateData?.streamType || "");

      setContinent(existingUpdateData?.continent || "");
      setCountry(existingUpdateData?.country || "");
      setCity(existingUpdateData?.city || "");
      setTvChannels(existingUpdateData?.tvChannels || "");
    }
    setError({});

    return () => {
      localStorage.removeItem("updateChannelData");
    };
  }, []);

  useEffect(() => {
    if (genre && Array.isArray(genre) && genre.length === 0)
      dispatch(getGenre());

    if (languages && Array.isArray(languages) && languages.length === 0)
      dispatch(getLanguages());

    // dispatch(getCountry());
    // dispatch(getContinents());
    dispatch(getRegion({ includeContinentDetails: false }));
    dispatch(continentRegion());

    dispatch(getAdminTvChannels(1, 500));
  }, [dispatch]);

  useEffect(() => {
    if (country && country !== "select_country") {
      getCitiesByCountry(country);
    }
  }, [country]);

  const selectedTVChannels = useMemo(
    () => tvChannelsList.filter((channel) => tvChannels.includes(channel?._id)),
    [tvChannels, tvChannelsList]
  );

  const filteredCountries = useMemo(() => {
    if (!allCountriesList || !Array.isArray(allCountriesList)) {
      return [];
    }
    if (!continent || continent === "select_continent") {
      return [];
    }
    return allCountriesList.filter((reg) => reg.continent === continent);
  }, [allCountriesList, continent]);

  const handleClose = () => {
    localStorage.removeItem("createChannelData");
    localStorage.removeItem("updateChannelData");
    if (mode === "update") {
      history.goBack();
    } else {
      history.push("/admin/live_tv");
    }
  };

  let folderStructureMovieImage = projectName + "liveTvImage";
  const imageLoad = async (event) => {
    const file = event.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width === 1920 && img.height === 1080) {
        const { resDataUrl, imageURL } = await uploadFile(
          file,
          folderStructureMovieImage
        );

        setResURL(resDataUrl);
        setImagePath(imageURL);
        setError((prev) => ({
          ...prev,
          image: null,
        }));
      } else {
        setError((prev) => ({
          ...prev,
          image: "Please upload an image with dimensions 1920x1080.",
        }));
      }
    };
  };

  const handleTabClick = (tab, e) => {
    e.preventDefault(); // Prevent default navigation
    if (existingUpdateData?._id) {
      setActiveTab(tab);
    }
  };

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [field]: true });

      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [field]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getCitiesByCountry = async (countryId) => {
    try {
      const response = await apiInstanceFetch.get(
        `city?regionId=${countryId}&includeRegionDetails=false&start=1&limit=5000`
      );
      if (response?.status) setAllCities(response?.cities);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleContinentChange = (e) => {
    const selectedContinent = e.target.value;
    setContinent(selectedContinent);
    setCountry(""); // Reset country when continent changes
    setCity(""); // Reset city when continent changes
    if (selectedContinent !== "select_continent") {
      // dispatch(getCountriesByContinent(selectedContinent)); // You'll need to create this action
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setCountry(country);
    setCity(""); // Reset city when country changes
  };

  function onSelectTvChannel(selectedList, selectedItem) {
    setTvChannels(selectedList.map((item) => item._id));
  }

  function onRemoveTvChannel(selectedList, removedItem) {
    setTvChannels(selectedList.map((item) => item._id));
  }

  const handleSubmit = async () => {
    //validation rules based on streamType
    const isExternal = streamType === "EXTERNAL";

    if (
      !channelName ||
      !imagePath ||
      !description ||
      (isExternal && !streamURL)
      // || programs.length === 0
    ) {
      let error = {};
      if (!channelName) error.channelName = "Channel Name Is Required !";
      if (!imagePath) error.image = "Image is Required !";
      if (!description) error.description = "Description is Required !";

      if (isExternal && !streamURL)
        error.streamURL = "Stream URL Is Required !";

      // if (programs.length === 0) error.programs = "At least one program is required!";

      return setError({ ...error });
    } else {
      if (mode === "update") {
        const objData = {
          channelLogo: resURL ? resURL : undefined,
          channelName,
          description,
          tvChannels,
          category,
          language,
          continent,
          country,
          city,
        };
        if (isExternal) objData.streamURL = streamURL;
        props.updateLiveTvChannel(existingUpdateData?._id, objData);
      } else if (mode === "fetch") {
        const objData = {
          channelLogo: resURL ? resURL : undefined,
          channelId: existingCreateData?.channelId,
          channelName,
          description,
          streamURL,
          streamType,
          tvChannels,
        };

        if (category && category !== "select_category")
          objData.category = category;
        if (language && language !== "select_language")
          objData.language = language;
        if (continent && continent !== "select_continent")
          objData.continent = continent;
        if (country && country !== "select_country") objData.country = country;
        if (city && city !== "select_city") objData.city = city;

        const res = await props.createLiveChannel(objData);
        const { status, stream } = res ?? {};

        if (status === true) {
          setTimeout(() => {
            let message = "Channel has been created. Please schedule programs";

            SuccessAlert(message).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem(
                  "updateChannelData",
                  JSON.stringify(stream)
                );
                history.push("/admin/live_tv/customLiveTv?mode=update");
                setActiveTab("PROGRAMS");
              }
            });
          }, 800);
        }
      } else {
        const objData = {
          channelLogo: resURL,
          channelName,
          category,
          language,
          description,
          streamType,
          tvChannels,
        };

        if (category && category !== "select_category")
          objData.category = category;
        if (language && language !== "select_language")
          objData.language = language;
        if (continent && continent !== "select_continent")
          objData.continent = continent;
        if (country && country !== "select_country") objData.country = country;
        if (city && city !== "select_city") objData.city = city;

        if (isExternal) objData.streamURL = streamURL;

        const res = await props.createManualLiveChannel(objData);
        const { status, stream } = res ?? {};
        if (status === true) {
          setTimeout(() => {
            let message = "";
            if (stream?.streamType === "INTERNAL")
              message =
                "We are building infrastructure for your channel, please wait for 5-10 minutes and come back to start live stream. Until please schedule programs";
            else message = "Channel has been created. Please schedule programs";

            SuccessAlert(message).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem(
                  "updateChannelData",
                  JSON.stringify(stream)
                );
                history.push("/admin/live_tv/customLiveTv?mode=update");
                setActiveTab("PROGRAMS");

                // // moving to tv page
                // localStorage.removeItem("createChannelData");
                // localStorage.removeItem("updateChannelData");
                // window.location.href = "/admin/live_tv";
              }
            });
          }, 1200);
        }

        // .finally((res) => {
        //   console.log('res', res)
        //   // setTimeout(() => {
        //   //   SuccessAlert().then((result) => {
        //   //     if (result.isConfirmed) {
        //   //       handleClose();
        //   //     }
        //   //   });
        //   // }, 1200);

        // })
      }
      // handleClose();
    }
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="header_heading p_zero">
                <div className="d-flex align-items-center">
                  <div onClick={handleClose} style={{ cursor: "pointer" }}>
                    <i class="fa-solid fa-angles-left  p-2" />
                  </div>
                  {mode === "update" ? (
                    <h3>{existingUpdateData?.channelName}</h3>
                  ) : (
                    <h3>Insert Live Tv</h3>
                  )}
                </div>
                <div className="header_heading_right_col">
                  <NavLink
                    className={`defualt_btn ${
                      activeTab === "DETAILS" ? "active" : ""
                    }`}
                    id="pills-profile-tab"
                    data-toggle="pill"
                    href="#pills-profile"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected={activeTab === "DETAILS"}
                    to="/"
                    onClick={(e) => handleTabClick("DETAILS", e)}
                  >
                    <TvIcon className="mr-1" />
                    Details
                  </NavLink>

                  <NavLink
                    className={`defualt_btn whte_btn ${
                      activeTab === "PROGRAMS" ? "active" : ""
                    } ${!existingUpdateData?._id ? "disable" : ""}`}
                    id="pills-contact-tab"
                    data-toggle="pill"
                    href="#pills-contact"
                    role="tab"
                    aria-controls="pills-contact"
                    aria-selected={activeTab === "PROGRAMS"}
                    to="/"
                    onClick={(e) => handleTabClick("PROGRAMS", e)}
                    disabled={!existingUpdateData?._id}
                  >
                    {/* <RecentActorsIcon
                        className="mr-1"
                        sx={{ fontSize: "20px", marginBottom: "2px" }}
                      /> */}
                    <EventNoteIcon className="mr-1" />
                    Programs
                  </NavLink>
                </div>
              </div>

              <div className="iq-card mb-5">
                {activeTab === "DETAILS" ? (
                  <div className="iq-card-body">
                    <div className="row my-4">
                      <div className="col-md-6 iq-item-product-left">
                        <div className="iq-image-container">
                          <div className="iq-product-cover">
                            <div class="custom_field_col wdt100">
                              <label>Channel Name</label>
                              <input
                                type="text"
                                name="channelName"
                                placeholder="Channel Name"
                                className="form-control form-control-line"
                                Required
                                value={channelName}
                                onChange={(e) => {
                                  setChannelName(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      channelName: "Name is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      channelName: "",
                                    });
                                  }
                                }}
                              />

                              {error.channelName && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.channelName}
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

                            <div className="mb-4 ">
                              <label className=" styleForTitle movieForm">
                                TV channels
                              </label>
                              <Multiselect
                                options={tvChannelsList}
                                selectedValues={selectedTVChannels}
                                onSelect={onSelectTvChannel}
                                onRemove={onRemoveTvChannel}
                                displayValue="name"
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
                            </div>

                            {/* <div className="my-4">
                              <label className="float-left styleForTitle movieForm">
                                Country
                              </label>

                              <select
                                type="text"
                                placeholder="Select Country"
                                className="form-control form-control-line"
                                Required
                                value={country_}
                                onChange={(e) => {
                                  setCountry(e.target.value);

                                  if (e.target.value === "select country") {
                                    return setError({
                                      ...error,
                                      country_: "Country is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      country_: "",
                                    });
                                  }
                                }}
                              >
                                <option value="select country">
                                  Select country
                                </option>
                                {options.map((op) => {
                                  return (
                                    <option key={op.value} value={op.value}>
                                      {op.label}
                                    </option>
                                  );
                                })}
                              </select>

                              {error.country_ && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.country_}
                                  </Typography>
                                </div>
                              )}
                            </div> */}

                            <div class="custom_field_col wdt100">
                              <label>Category</label>

                              <select
                                name="category"
                                className="form-control form-control-line selector"
                                id="category"
                                value={category}
                                onChange={(e) => {
                                  setCategory(e.target.value);
                                }}
                              >
                                <option value="select_category">
                                  Select Category
                                </option>
                                {genre?.map((val, ind) => (
                                  <option key={ind} value={val?._id}>
                                    {capitalizeEachWord(val?.name)}
                                  </option>
                                ))}
                              </select>

                              {error.category && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.category}
                                  </Typography>
                                </div>
                              )}
                            </div>

                            <div class="custom_field_col wdt100">
                              <label>Language</label>

                              <select
                                name="language"
                                className="form-control form-control-line selector"
                                id="language"
                                value={language}
                                onChange={(e) => {
                                  setLanguage(e.target.value);
                                }}
                              >
                                <option value="select_language">
                                  Select Language
                                </option>
                                {languages.map((lang) => {
                                  return (
                                    <option key={lang._id} value={lang._id}>
                                      {lang.name}
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

                            <div className="custom_field_col wdt100">
                              <label>Continent</label>
                              <select
                                name="continent"
                                className="form-control form-control-line selector"
                                id="continent"
                                value={continent}
                                onChange={handleContinentChange}
                              >
                                <option value="select_continent">
                                  Select Continent
                                </option>
                                {continents?.map((cont) => (
                                  <option key={cont._id} value={cont._id}>
                                    {capitalizeEachWord(cont.name)}
                                  </option>
                                ))}
                              </select>
                              {error.continent && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.continent}
                                  </Typography>
                                </div>
                              )}
                            </div>

                            <div
                              className={`custom_field_col wdt100 ${
                                !continent ? "disabled-select" : ""
                              }`}
                            >
                              <label>Country</label>
                              <select
                                name="country"
                                className="form-control form-control-line selector"
                                id="country"
                                value={country}
                                onChange={handleCountryChange}
                                disabled={!continent}
                              >
                                <option value="select_country">
                                  Select Country
                                </option>
                                {filteredCountries?.map((country) => (
                                  <option key={country._id} value={country._id}>
                                    {capitalizeEachWord(country.name)}
                                  </option>
                                ))}
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

                            <div
                              className={`custom_field_col wdt100 ${
                                !country ? "disabled-select" : ""
                              }`}
                            >
                              <label>City</label>
                              <select
                                name="city"
                                className="form-control form-control-line selector"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={!country}
                              >
                                <option value="select_city">Select City</option>
                                {allCities?.map((city) => (
                                  <option key={city._id} value={city._id}>
                                    {capitalizeEachWord(city.name)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 iq-item-product-right">
                        <div className="product-additional-details">
                          {/* Radio button group for EXTERNAL and internal functionality */}
                          <div>
                            <CustomRadioGroup
                              label="Stream Type"
                              options={streamTypeOptions}
                              value={streamType}
                              onChange={setStreamType}
                              error={error.streamType}
                              disabled={mode === "update" || mode === "fetch"}
                            />
                          </div>

                          {streamType === "EXTERNAL" ? (
                            <div class="custom_field_col wdt100">
                              <label htmlFor="description">Stream URl</label>

                              <input
                                type="text"
                                name="streamUrl"
                                placeholder="Stream Url"
                                className="form-control form-control-line"
                                Required
                                value={streamURL}
                                onChange={(e) => {
                                  setStreamURL(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      streamURL: "stream URL is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      streamURL: "",
                                    });
                                  }
                                }}
                              />

                              {error.streamURL && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.streamURL}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}

                          <div class="custom_field_col wdt100">
                            <label>Image</label>

                            <div className="d-flex ">
                              {imagePath ? (
                                <>
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
                                  <img
                                    onClick={handleClickImage}
                                    alt="app"
                                    src={imagePath}
                                    style={{
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                      borderRadius: "0.25rem",

                                      maxWidth: "200px",
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                    }}
                                    onError={(e) =>
                                      handleImageError(e, noImage)
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  {imagePath ? (
                                    <img
                                      alt=""
                                      src={imagePath || noImage}
                                      onClick={handleClickImage}
                                      style={{
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                        borderRadius: "0.25rem",
                                        width: "745px",
                                        height: "270px",
                                      }}
                                      onError={(e) =>
                                        handleImageError(e, noImage)
                                      }
                                    />
                                  ) : (
                                    <div class="select_image">
                                      <i
                                        className="fas fa-plus"
                                        style={{
                                          paddingTop: 56,
                                          fontSize: 165,
                                          fontWeight: 400,
                                          color: "#4d848f",
                                        }}
                                      />

                                      <input
                                        autocomplete="off"
                                        tabIndex="-1"
                                        style={{
                                          position: "absolute",
                                          top: 112,
                                          transform: "scale(3.5)",
                                          opacity: 0,
                                        }}
                                        type="file"
                                        className="form-control"
                                        id="customFile"
                                        accept="image/png, image/jpeg ,image/jpg"
                                        Required=""
                                        onChange={imageLoad}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            {error.image ? (
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

                          {/* <div className="col-12 mb-3">
                            <Programs
                              programs={programs}
                              setPrograms={setPrograms}
                              error={error?.programs}
                            />
                            {error?.programs && (
                              <small className="text-danger">{error.programs}</small>
                            )}
                          </div> */}

                          <div className=" my-4">
                            {/* {streamURL && existingUpdateData?.streamType === "EXTERNAL" ? (
                              
                            ) : (
                              <></>
                            )} */}

                            {existingUpdateData?.streamType === "INTERNAL" &&
                            existingUpdateData?.streamKey &&
                            existingUpdateData?.streamPublishUrl ? (
                              <>
                                <InfoField
                                  label="Stream URL"
                                  value={streamURL || ""}
                                  field="streamURL"
                                  copyEnabled={true}
                                  handleCopy={handleCopy}
                                  copyStatus={copyStatus}
                                />

                                <InfoField
                                  label="Stream Key"
                                  value={existingUpdateData?.streamKey || ""}
                                  field="streamKey"
                                  copyEnabled={true}
                                  handleCopy={handleCopy}
                                  copyStatus={copyStatus}
                                />

                                <InfoField
                                  label="Stream Publish URL"
                                  value={
                                    existingUpdateData?.streamPublishUrl || ""
                                  }
                                  field="streamPublishUrl"
                                  copyEnabled={true}
                                  handleCopy={handleCopy}
                                  copyStatus={copyStatus}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogActions className="button_wrapper">
                      {mode === "update" ? (
                        <button
                          type="button"
                          className="defualt_btn whte_btn"
                          onClick={handleSubmit}
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="defualt_btn whte_btn"
                          onClick={handleSubmit}
                        >
                          Insert
                        </button>
                      )}
                      <button
                        type="button"
                        className="defualt_btn "
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </DialogActions>
                    {/* <UploadProgress data={data} movieId={movieId} /> */}
                    {/* <UploadProgressManual data={data} /> */}
                  </div>
                ) : (
                  <div className="iq-card-body">
                    <div className=" p-2 my-4">
                      <ProgramSchedule />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  setUploadFileManual,
  getGenre,
  getRegion,
  continentRegion,
  getLanguages,
  getTeamMember,
  updateMovie,
  loadMovieData,
  createManual,
  getCountry,
  createManualLiveChannel,
  updateLiveTvChannel,
  createLiveChannel,
})(LiveTvForm);
