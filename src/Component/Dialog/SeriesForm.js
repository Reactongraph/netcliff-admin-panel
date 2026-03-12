import { useState, useRef, useEffect } from "react";

//react-router-dom
import { useHistory, NavLink } from "react-router-dom";

//material-ui
import { Chip, DialogActions, Stack, Typography } from "@mui/material";

import card from "../assets/images/defaultUserPicture.jpg";
import thumb from "../assets/images/5.png";

// MUI Icons
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TvIcon from "@mui/icons-material/Tv";

//react-redux
import { connect, useSelector, useDispatch } from "react-redux";

import {
  loadSeriesData,
  setUploadTvFile,
  updateTvSeries,
} from "../../store/TvSeries/tvSeries.action";

import { getGenre } from "../../store/Genre/genre.action";
import { getTags } from "../../store/Tags/tags.action";
import { getRegion } from "../../store/Region/region.action";

import { projectName } from "../../util/config";
import VerticalTab, { TabPanel } from "../Tab/VerticalTab";
import GeoBlockingForm from "./GeoBlockingForm";
import { videoQualities } from "../../util/videoQualities";
import { maturityRatings } from "../../util/maturityRatings";
import { getLanguages } from "../../store/Language/language.action";
import { getBadge } from "../../store/Badge/badge.action";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import Input from "../molecules/Input";
import Select from "../molecules/Select";
import Switch from "../molecules/Switch";
import CustomSunEditor from "../molecules/CustomSunEditor";
import CustomMultiselect from "../molecules/CustomMultiselect";
import { Toast } from "../../util/Toast_";
import { ImdbSeriesCreate } from "../../store/TvSeries/tvSeries.action";
import { EMPTY_TMDB_SERIES_DIALOGUE } from "../../store/TvSeries/tvSeries.type";
import "suneditor/dist/css/suneditor.min.css";
import { seriesFormTabs } from "../../util/contants";

const editorOptions = {
  buttonList: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],

    ["fontColor", "hiliteColor", "textStyle"],
    ["removeFormat"],
    ["bold", "underline", "italic", "subscript", "superscript"],

    ["align", "list", "lineHeight"],
    ["link"],
    ["fullScreen"],
  ],
};

const SeriesForm = (props) => {
  const seoDesEditor = useRef();
  const dispatch = useDispatch();

  const history = useHistory();

  const dialogData = JSON.parse(localStorage.getItem("updateMovieData"));

  const editor = useRef(null);
  const [tmdbId, setTmdbId] = useState("");
  const [tmdbTitle, setTmdbTitle] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [landscapeImagePath, setLandscapeImagePath] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [language, setLanguage] = useState([]);
  const [allowedCountries, setAllowedCountries] = useState([]);
  const [blockedCountries, setBlockedCountries] = useState([]);
  const [maturity, setMaturity] = useState("");
  const [videoQuality, setVideoQuality] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newReleased, setNewReleased] = useState(false);
  const [isCachedOnHome, setIsCachedOnHome] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [ads, setAds] = useState({adEnabled: true});
  const [seoDescription, setSeoDescription] = useState("");
  const [seoTags, setSeoTags] = useState([]);
  const [tagValue, setTagvalue] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [convertUpdateType, setConvertUpdateType] = useState({
    image: "",
    landscapeImage: "",
    thumbnail: "",
    link: "",
  });

  const [type, setType] = useState("Premium");
  const [status, setStatus] = useState("DRAFT");

  const { seriesDetailsTmdb, showData } = useSelector((state) => state.series);
  const { tags: tagsData } = useSelector((state) => state.tags);
  const { languages: reducerLanguages } = useSelector(
    (state) => state.language
  );
  const { badge: badgeList } = useSelector((state) => state.badge);
  localStorage.setItem("seriesTrailerId", seriesId);
  localStorage.setItem("seriesTitle", title);

  const [error, setError] = useState({
    title: "",
    thumbnail: "",
  });

  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    seriesImageResURL: "",
    seriesLandscapeImageResURL: "",
  });

  const handleAdChange = (e, fieldName) => {
    let value = e.target.value;
    if(fieldName === 'adEnabled'){
      value = e.target.checked;
    } else if(value == 0){
      value = null;
    }
   setAds({...ads, [fieldName]: value })
  };

  const handleInputChange = (e, setter, fieldName) => {
    let value = e.target.value;
    if (fieldName === "title" || fieldName === "seoTitle") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setter(value);

    // Dynamic error clearing
    if (value && value !== "Select Country" && value !== "Select Language" && value !== "maturity" && value !== "videoQuality" && value !== "Select Badge") {
      setError((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setTitle(seriesDetailsTmdb?.title);
    setYear(seriesDetailsTmdb?.year);
    setImagePath(seriesDetailsTmdb?.image);
    setDescription(seriesDetailsTmdb?.description);
    setThumbnailPath(seriesDetailsTmdb?.thumbnail);
    setLandscapeImagePath(seriesDetailsTmdb?.landscapeImage);
  }, [seriesDetailsTmdb]);

  const genreId = seriesDetailsTmdb?.genre?.map((value) =>
    value?._id ? value._id : value
  );

  // set data in dialog
  useEffect(() => {
    if (dialogData) {
      const genreId_ = dialogData?.genre?.map((value) =>
        value?._id ? value._id : value
      );

      setUpdateType(dialogData?.updateType);
      setConvertUpdateType({
        image: dialogData?.convertUpdateType?.image
          ? dialogData?.convertUpdateType?.image
          : "",
        landscapeImage: dialogData?.convertUpdateType?.landscapeImage
          ? dialogData?.convertUpdateType?.landscapeImage
          : "",
        thumbnail: dialogData?.convertUpdateType?.thumbnail
          ? dialogData?.convertUpdateType?.thumbnail
          : "",
        link: dialogData?.convertUpdateType?.link
          ? dialogData?.convertUpdateType?.link
          : "",
      });
      setTitle(dialogData.title || "");
      setDescription(dialogData.description || "");
      setYear(dialogData.year || "");
      setCountry(dialogData.region?._id || "");
      setGenres(genreId !== undefined ? genreId : genreId_);
      setTags(dialogData.tags?.map(tag => tag._id || tag) || []);
      setLanguage(
        dialogData.language?.[0]?._id
          ? dialogData.language[0]._id
          : dialogData.language?.[0] || ""
      );
      setMaturity(dialogData.maturity || "");
      setVideoQuality(dialogData.videoQuality || "");
      setExclusive(dialogData.exclusive || false);
      setFeatured(dialogData.featured || false);
      setNewReleased(dialogData.newReleased || false);
      setIsCachedOnHome(dialogData.isCachedOnHome || false);
      setSeoTitle(dialogData.seoTitle || "");
      setAds(dialogData.ads || {adEnabled: true});
      setSeoDescription(dialogData.seoDescription || "");
      setSeoTags(dialogData.seoTags || []);

      setImagePath(dialogData.image || "");
      setThumbnailPath(dialogData.thumbnail || "");
      setLandscapeImagePath(dialogData.landscapeImage || "");
      // setMovieId(dialogData._id);
      setSeriesId(dialogData._id);
      setType(dialogData.type || "Premium");

      if (dialogData.badges && dialogData.badges.length > 0)
        setSelectedBadge(dialogData.badges[0])
    }
  }, []);

  useEffect(() => {
    if (genreId) {
      setGenres(genreId);
    }
  }, [seriesDetailsTmdb]);

  //useEffect for Get Data
  useEffect(() => {
    dispatch(getGenre());
    dispatch(getTags());
    dispatch(getRegion());
    dispatch(getLanguages());
    dispatch(getBadge("active"));
  }, [dispatch]);

  const tmdbMovieDetail = async () => {
    await props.loadSeriesData(tmdbId, tmdbTitle);
  };

  //get genre list
  const { genre } = useSelector((state) => state.genre);

  //get country list
  const [countries, setCountries] = useState([]);

  const { region } = useSelector((state) => state.region);

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

  const handleImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      image: 1,
    });
    setResURL({ ...resURL, seriesImageResURL: resDataUrl });
    setImagePath(imageURL);
  };

  const handleLandscapeImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      landscapeImage: 1,
    });
    setResURL({ ...resURL, seriesLandscapeImageResURL: resDataUrl });
    setLandscapeImagePath(imageURL);
  };

  const handleThumbnailSuccess = ({ resDataUrl, imageURL, file }) => {
    setThumbnail(file);
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      thumbnail: 1,
    });
    setResURL({ ...resURL, thumbnailImageResURL: resDataUrl });
    setThumbnailPath(imageURL);
  };
  const handleSubmit = () => {
    if (
      !title ||
      (thumbnail.length === 0 && !thumbnailPath && !resURL?.thumbnailImageResURL)
    ) {
      let error = {};
      if (!title) {
        error.title = "title is required";
        Toast("error", "Title is required");
      }
      if (thumbnail.length === 0 && !thumbnailPath && !resURL?.thumbnailImageResURL) {
        error.thumbnail = "Thumbnail is required";
        Toast("error", "Thumbnail is required");
      }
      return setError({ ...error });
    } else {
      // Prepare data with proper handling of optional fields
      let objData = {
        title,
        year: year || "",
        description: description || "",
        type: type || "Premium",
        updateType: updateType,
        convertUpdateType: convertUpdateType,
        status: status || "DRAFT",
        contentRating: Math.random() * 10,
        exclusive: exclusive || false,
        featured: featured || false,
        newReleased: newReleased || false,
        isCachedOnHome: isCachedOnHome || false,
        seoTitle: seoTitle || "",
        ads: ads || null,
        seoDescription: seoDescription || "",
        seoTags: seoTags || [],
        blockedCountries: blockedCountries ? blockedCountries.map((a) => a._id) : [],
      };

      // Only include region if it's selected
      if (country && country !== "") {
        objData.region = country;
      }

      // Only include genre if it's selected
      if (genres && genres.length > 0) {
        objData.genre = genres;
      }

      // Only include tags if it's selected
      if (tags && tags.length > 0) {
        objData.tags = tags;
      }

      // Only include maturity if it's selected
      if (maturity && maturity !== "selectMaturity") {
        objData.maturity = maturity;
      }

      // Only include videoQuality if it's selected
      if (videoQuality && videoQuality !== "selectVideoQuality") {
        objData.videoQuality = videoQuality;
      }

      // Only include language if it's selected
      if (language &&
        ((Array.isArray(language) && language.length > 0) ||
          (typeof language === 'string' && language !== "Select Language" && language !== "" && language.trim() !== ""))) {
        objData.language = Array.isArray(language) ? language : [language];
      }

      // Final check to ensure we never send empty language array
      if (objData.language && objData.language.length === 0) {
        delete objData.language;
      }

      // Only include badge if it's selected
      if (selectedBadge && selectedBadge !== "Select Badge") {
        objData.badges = [selectedBadge];
      } else {
        objData.badges = [];
      }

      if (resURL?.thumbnailImageResURL) {
        objData.thumbnail = resURL?.thumbnailImageResURL;
      }
      if (resURL?.seriesImageResURL) {
        objData.image = resURL?.seriesImageResURL;
      }
      if (resURL?.seriesLandscapeImageResURL) {
        objData.landscapeImage = resURL?.seriesLandscapeImageResURL;
      }

      // Call the API and handle response properly
      props.updateTvSeries(dialogData?._id, objData).then((result) => {
        if (result && result.status) {
          setTimeout(() => {
            seriesDetailsTmdb && dispatch({ type: EMPTY_TMDB_SERIES_DIALOGUE });
            history.goBack();
          }, 3000);
        }
      });
    }
  };

  const [selectedGenres, setSelectedGenres] = useState([]);

  const formatSelectedTags = (selected) => {
    if (!selected) return [];
    const selectedArray = Array.isArray(selected) ? selected : [selected];

    return selectedArray
      .map((item) => {
        if (item && typeof item === "object") {
          return item;
        }
        if (!tagsData) {
          return null;
        }
        return tagsData.find((tag) => tag._id === item) || null;
      })
      .filter(Boolean);
  };

  // ...

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    const updatedGenres = [...selectedGenres, selectedItem._id];
    setSelectedGenres(updatedGenres);

    genres?.push(selectedItem?._id);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  //onselect function for tags
  function onSelectTags(selectedList, selectedItem) {
    tags.push(selectedItem?._id);
  }

  //onRemove function for tags
  function onRemoveTags(selectedList, removedItem) {
    setTags(selectedList.map((data) => data._id));
  }

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");
    history.goBack();
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
                    <NavLink to="/admin/web_series/series_form">
                      <EditIcon />
                      Edit
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/web_series/trailer">
                      <i className="ri-vidicon-line mr-1" />
                      Trailer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/web_series/season">
                      <DynamicFeedIcon />
                      Season
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/episode">
                      <TvIcon />
                      Episode
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/web_series/cast">
                      <RecentActorsIcon />
                      Cast
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-12">
              {dialogData ? (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card mt-3 ml-4"></div>
                </div>
              ) : (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div className="header_heading p_zero">
                    <h3>Insert Web Series</h3>
                    <div className="header_heading_right_col">
                      <NavLink
                        class="defualt_btn"
                        id="pills-home-tab"
                        data-toggle="pill"
                        href="#pills-home"
                        to="/admin/web_series/series_form"
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
                        to="/admin/web_series/series_manual"
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
                  <div className="row">
                    <div className="col-lg-3"></div>
                    <div class="col-lg-6">
                      <div
                        class="alert alert-info border-0 text-center movie_alert"
                        role="alert"
                      >
                        Import Contents From TMDB
                      </div>
                    </div>
                    <div className="col-lg-3"></div>
                  </div>
                  <div class="row justify-content-center align-items-baseline">
                    <div class="col-lg-3">
                      <input
                        class="form-control"
                        id="imdb_id"
                        type="text"
                        placeholder="Enter IMDB ID. Ex: tt9432978"
                        value={tmdbId}
                        onChange={(e) => {
                          setTmdbId(e.target.value);
                        }}
                        style={{
                          boxShadow: "0 0 0 1.5px #5fade726",
                        }}
                      />
                    </div>
                    <p className="text-center mt-1">
                      <strong>or</strong>
                    </p>
                    <div class="col-lg-3 d-flex">
                      <input
                        class="form-control"
                        id="imdb_id"
                        type="text"
                        placeholder="Enter Web Series Title"
                        value={tmdbTitle}
                        onChange={(e) => {
                          setTmdbTitle(e.target.value);
                        }}
                        style={{
                          boxShadow: "0 0 0 1.5px #5fade726",
                        }}
                      />
                      <div>
                        <button
                          type="submit"
                          onClick={tmdbMovieDetail}
                          id="import_btn"
                          className="btn btn-primary btn-sm px-3 py-2 ml-3"
                        >
                          Fetch
                        </button>
                      </div>
                    </div>
                  </div>
                  {error.tmdbTitle && (
                    <div className="pl-1 text-left">
                      <Typography
                        variant="caption"
                        style={{
                          fontFamily: "Circular-Loom",
                          color: "#ee2e47",
                        }}
                      >
                        {error.tmdbTitle}
                      </Typography>
                    </div>
                  )}
                  <div class="row justify-content-center mt-2 mb-5">
                    <div class="col-lg-5">
                      <h6>
                        <p>
                          Get IMDB or IMDB ID from here:
                          <a href={() => false} target="blank">
                            TheMovieDB.org
                          </a>
                          or
                          <a href={() => false} target="blank">
                            Imdb.com
                          </a>
                        </p>
                      </h6>
                    </div>
                  </div>
                </>
              )}

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  {showData ? (
                    <>
                      <VerticalTab
                        tabs={seriesFormTabs}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      >
                        <TabPanel value={tabValue} index={0}>
                          <Input
                            label="Title"
                            placeholder="Title"
                            required
                            name="title"
                            value={title}
                            onChange={(e) => handleInputChange(e, setTitle, "title")}
                            error={error.title}
                            className="ml-3"
                          />

                          <CustomSunEditor
                            label="Description"
                            value={description}
                            editorRef={editor}
                            height={318}
                            onChange={(e) => {
                              setDescription(e);
                              if (!e) {
                                setError({ ...error, description: "Description is Required !" });
                              } else {
                                setError({ ...error, description: "" });
                              }
                            }}
                            placeholder="Description"
                            error={error.description}
                            setOptions={editorOptions}
                            className="ml-3 my-4"
                          />

                          <Input
                            label="Release Year"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            required
                            name="year"
                            value={year}
                            onChange={(e) => handleInputChange(e, setYear, "year")}
                            error={error.year}
                            className="ml-3 my-4"
                          />

                          <Select
                            label="Free/Premium"
                            name="type"
                            value={type}
                            options={[
                              { value: "Free", label: "Free" },
                              { value: "Premium", label: "Premium" }
                            ]}
                            onChange={(e) => handleInputChange(e, setType, "type")}
                            error={error.type}
                            className="ml-3 my-4"
                          />

                          <Select
                            label="Country"
                            name="country"
                            value={country}
                            options={[
                              { value: "Select Country", label: "Select Country" },
                              ...countries.map(c => ({ value: c._id, label: c.name.toLowerCase() }))
                            ]}
                            onChange={(e) => handleInputChange(e, setCountry, "country")}
                            error={error.country}
                            className="ml-3 my-4"
                            style={{ textTransform: "capitalize" }}
                          />

                          <CustomMultiselect
                            label="Genre"
                            options={genre || []}
                            selectedValues={seriesDetailsTmdb ? seriesDetailsTmdb?.genre : []}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            error={genres?.length === 0 ? error.genres : ""}
                            placeholder="Select Genre"
                            className="ml-3 my-4"
                          />

                          <CustomMultiselect
                            label="Tags"
                            options={tagsData || []}
                            selectedValues={formatSelectedTags(dialogData?.tags || seriesDetailsTmdb?.tags)}
                            onSelect={onSelectTags}
                            onRemove={onRemoveTags}
                            error={tags?.length === 0 ? error.tags : ""}
                            placeholder="Select Tags"
                            className="ml-3 my-4"
                          />

                          <Select
                            label="Language"
                            name="language"
                            value={language}
                            options={[
                              { value: "Select Language", label: "Select Language" },
                              ...reducerLanguages.map(l => ({ value: l._id, label: l.name.toLowerCase() }))
                            ]}
                            onChange={(e) => handleInputChange(e, setLanguage, "language")}
                            error={error.language}
                            className="ml-3 my-4"
                            style={{ textTransform: "capitalize" }}
                          />

                          <Select
                            label="Maturity Rating"
                            name="maturity"
                            value={maturity}
                            options={[
                              { value: "maturity", label: "Select Maturity" },
                              ...maturityRatings
                            ]}
                            onChange={(e) => handleInputChange(e, setMaturity, "maturity")}
                            error={error.maturity}
                            className="ml-3 my-4"
                          />

                          <Select
                            label="Video Quality"
                            name="videoQuality"
                            value={videoQuality}
                            options={[
                              { value: "videoQuality", label: "Select Video Quality" },
                              ...videoQualities
                            ]}
                            onChange={(e) => handleInputChange(e, setVideoQuality, "videoQuality")}
                            error={error.videoQuality}
                            className="ml-3 my-4"
                          />

                          <Select
                            label="Badge"
                            name="badge"
                            value={selectedBadge}
                            options={[
                              { value: "Select Badge", label: "Select Badge" },
                              ...badgeList.map(b => ({ value: b._id, label: b.name }))
                            ]}
                            onChange={(e) => setSelectedBadge(e.target.value)}
                            className="ml-3 my-4"
                            style={{ textTransform: "capitalize" }}
                          />

                          <div className="ml-3 flex gap-40">
                            <Switch
                              label="Exclusive"
                              checked={exclusive}
                              onChange={(e) => setExclusive(e.target?.checked)}
                            />
                            <Switch
                              label="Featured"
                              checked={featured}
                              onChange={(e) => setFeatured(e.target?.checked)}
                            />
                            <Switch
                              label="New Released"
                              checked={newReleased}
                              onChange={(e) => setNewReleased(e.target?.checked)}
                            />
                            <Switch
                              label="Cached on Home"
                              checked={isCachedOnHome}
                              onChange={(e) => setIsCachedOnHome(e.target?.checked)}
                            />
                          </div>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                          <ImageVideoFileUpload
                            label="Thumbnail"
                            imagePath={thumbnailPath || seriesDetailsTmdb.thumbnail || thumb}
                            onUploadSuccess={handleThumbnailSuccess}
                            error={error.thumbnail}
                            imgStyle={{ height: "240px", width: "170px" }}
                            className="ml-3"
                            variant="advanced"
                            folderStructure={projectName + "seriesThumbnail"}
                            fallbackImage={thumb}
                          />
                          <ImageVideoFileUpload
                            label="Poster"
                            imagePath={imagePath || seriesDetailsTmdb.image || card}
                            onUploadSuccess={handleImageSuccess}
                            error={error.image}
                            imgStyle={{ maxWidth: "305px", width: "100%", height: "auto" }}
                            className="ml-3 my-4"
                            variant="advanced"
                            folderStructure={projectName + "seriesImage"}
                            fallbackImage={card}
                          />
                          <ImageVideoFileUpload
                            label="Landscape Image"
                            imagePath={landscapeImagePath || seriesDetailsTmdb.landscapeImage}
                            onUploadSuccess={handleLandscapeImageSuccess}
                            error={error.image}
                            imgStyle={{ width: "100%", height: "auto", objectFit: "cover" }}
                            className="ml-3 my-4"
                            variant="advanced"
                            folderStructure={projectName + "seriesLandscapeImage"}
                            // fallbackImage={thumb}
                          />
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                          <Input
                            label="SEO Title"
                            placeholder="SEO Title"
                            name="seoTitle"
                            value={seoTitle}
                            onChange={(e) => handleInputChange(e, setSeoTitle, "seoTitle")}
                            error={error.seoTitle}
                            className="ml-3"
                          />

                          <CustomSunEditor
                            label="SEO Description"
                            labelClassName="styleForTitle mt-3 movieForm"
                            value={seoDescription}
                            editorRef={seoDesEditor}
                            height={100}
                            onChange={(e) => {
                              setSeoDescription(e);
                              if (!e) {
                                setError({ ...error, seoDescription: "SEO Description is Required !" });
                              } else {
                                setError({ ...error, seoDescription: "" });
                              }
                            }}
                            placeholder="SEO Description"
                            error={error.seoDescription}
                            setOptions={editorOptions}
                            className="ml-3 my-4"
                          />

                          <div className="ml-3 row">
                            <div className="col-md-6 my-2">
                              <label className="float-left styleForTitle movieForm">
                                SEO Tags
                              </label>
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    name="seoTags"
                                    placeholder="Add Tag"
                                    className="form-control form-control-line"
                                    value={tagValue}
                                    onChange={(e) => setTagvalue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm px-3 py-1"
                                    onClick={handleAddTag}
                                  >
                                    Add
                                  </button>
                                </div>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  useFlexGap
                                  sx={{ width: 400, flexWrap: "wrap", mt: 2 }}
                                >
                                  {seoTags.map((tg) => (
                                    <Chip
                                      color="primary"
                                      key={tg}
                                      label={tg}
                                      onDelete={() => handleRemoveTag(tg)}
                                    />
                                  ))}
                                </Stack>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
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
                       <TabPanel value={tabValue} index={4}>
                          <h6 className="text-muted mb-3">
                              GAM Ad Config
                          </h6>   
                            <Switch
                                label="Ad Enabled"
                                checked={ads?.adEnabled}
                                onChange={(e) => handleAdChange(e, 'adEnabled')}
                              />
                            <Input
                              label="First Ad Episode After"
                              type="number"
                              placeholder="Enter First Ad Episode After "
                              min="1"
                              name="firstAdAfterEpisodes"
                              value={ads?.firstAdAfterEpisodes || ""}
                              onChange={(e) => handleAdChange(e, 'firstAdAfterEpisodes')}
                              className="ml-3"
                            />
                            <Input
                              label="Subsequent Episode Interval"
                              type="number"
                              placeholder="Enter Subsequent Episode Interval"
                              min="1"
                              name="subsequentAdInterval"
                              value={ads?.subsequentAdInterval || ""}
                              onChange={(e) => handleAdChange(e, 'subsequentAdInterval')}
                              className="ml-3"
                            />
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
                          tabs={seriesFormTabs}
                          tabValue={tabValue}
                          setTabValue={setTabValue}
                        >
                          <TabPanel value={tabValue} index={0}>
                            <Input
                              label="Title"
                              placeholder="Title"
                              required
                              name="title"
                              value={title}
                              onChange={(e) => handleInputChange(e, setTitle, "title")}
                              error={error.title}
                              className="ml-3"
                            />

                            <CustomSunEditor
                              label="Description"
                              value={description}
                              editorRef={editor}
                              height={318}
                              onChange={(e) => {
                                setDescription(e);
                                if (!e) {
                                  setError({ ...error, description: "Description is Required !" });
                                } else {
                                  setError({ ...error, description: "" });
                                }
                              }}
                              placeholder="Description"
                              error={error.description}
                              setOptions={editorOptions}
                              className="ml-3 my-4"
                            />

                            <Input
                              label="Release Year"
                              type="date"
                              placeholder="YYYY-MM-DD"
                              required
                              name="year"
                              value={year}
                              onChange={(e) => handleInputChange(e, setYear, "year")}
                              error={error.year}
                              className="ml-3 my-4"
                            />

                            <Select
                              label="Free/Premium"
                              name="type"
                              value={type}
                              options={[
                                { value: "Free", label: "Free" },
                                { value: "Premium", label: "Premium" }
                              ]}
                              onChange={(e) => handleInputChange(e, setType, "type")}
                              error={error.type}
                              className="ml-3 my-4"
                            />

                            <Select
                              label="Status"
                              name="status"
                              value={status}
                              options={[
                                { value: "DRAFT", label: "Draft" },
                                { value: "PUBLISHED", label: "Published" },
                                { value: "ARCHIVED", label: "Archived" }
                              ]}
                              onChange={(e) => setStatus(e.target.value)}
                              className="ml-3 my-4"
                            />

                            <Select
                              label="Country"
                              name="country"
                              value={country}
                              options={[
                                { value: "Select Country", label: "Select Country" },
                                ...countries.map(c => ({ value: c._id, label: c.name.toLowerCase() }))
                              ]}
                              onChange={(e) => handleInputChange(e, setCountry, "country")}
                              error={error.country}
                              className="ml-3 my-4"
                              style={{ textTransform: "capitalize" }}
                            />

                            <CustomMultiselect
                              label="Genre"
                              options={genre || []}
                              selectedValues={dialogData ? dialogData?.genre : []}
                              onSelect={onSelect}
                              onRemove={onRemove}
                              error={genres?.length === 0 ? error.genres : ""}
                              placeholder="Select Genre"
                              className="ml-3 my-4"
                            />

                            <CustomMultiselect
                              label="Tags"
                              options={tagsData || []}
                              selectedValues={formatSelectedTags(dialogData?.tags || seriesDetailsTmdb?.tags)}
                              onSelect={onSelectTags}
                              onRemove={onRemoveTags}
                              error={tags?.length === 0 ? error.tags : ""}
                              placeholder="Select Tags"
                              className="ml-3 my-4"
                            />

                            <Select
                              label="Language"
                              name="language"
                              value={language}
                              options={[
                                { value: "Select Language", label: "Select Language" },
                                ...reducerLanguages.map(l => ({ value: l._id, label: l.name.toLowerCase() }))
                              ]}
                              onChange={(e) => handleInputChange(e, setLanguage, "language")}
                              error={error.language}
                              className="ml-3 my-4"
                              style={{ textTransform: "capitalize" }}
                            />

                            <Select
                              label="Maturity Rating"
                              name="maturity"
                              value={maturity}
                              options={[
                                { value: "maturity", label: "Select Maturity" },
                                ...maturityRatings
                              ]}
                              onChange={(e) => handleInputChange(e, setMaturity, "maturity")}
                              error={error.maturity}
                              className="ml-3 my-4"
                            />

                            <Select
                              label="Video Quality"
                              name="videoQuality"
                              value={videoQuality}
                              options={[
                                { value: "videoQuality", label: "Select Video Quality" },
                                ...videoQualities
                              ]}
                              onChange={(e) => handleInputChange(e, setVideoQuality, "videoQuality")}
                              error={error.videoQuality}
                              className="ml-3 my-4"
                            />

                            <Select
                              label="Badge"
                              name="badge"
                              value={selectedBadge}
                              options={[
                                { value: "Select Badge", label: "Select Badge" },
                                ...badgeList.map(b => ({ value: b._id, label: b.name }))
                              ]}
                              onChange={(e) => setSelectedBadge(e.target.value)}
                              className="ml-3 my-4"
                              style={{ textTransform: "capitalize" }}
                            />

                            <div className="ml-3 d-flex flex-row gap-40">
                              <Switch
                                label="Exclusive"
                                checked={exclusive}
                                onChange={(e) => setExclusive(e.target?.checked)}
                              />
                              <Switch
                                label="Featured"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target?.checked)}
                              />
                              <Switch
                                label="New Released"
                                checked={newReleased}
                                onChange={(e) => setNewReleased(e.target?.checked)}
                              />
                              <Switch
                                label="Cached on Home"
                                checked={isCachedOnHome}
                                onChange={(e) => setIsCachedOnHome(e.target?.checked)}
                              />
                            </div>
                          </TabPanel>

                          <TabPanel value={tabValue} index={1}>
                            <ImageVideoFileUpload
                              label="Thumbnail"
                              imagePath={thumbnailPath || (dialogData && dialogData.thumbnail) || thumb}
                              onUploadSuccess={handleThumbnailSuccess}
                              error={error.thumbnail}
                              imgStyle={{ height: "240px", width: "170px" }}
                              className="ml-3"
                              variant="advanced"
                              folderStructure={projectName + "seriesThumbnail"}
                              fallbackImage={thumb}
                            />
                            <ImageVideoFileUpload
                              label="Poster"
                              imagePath={imagePath || (dialogData && dialogData.image) || card}
                              onUploadSuccess={handleImageSuccess}
                              error={error.image}
                              imgStyle={{ maxWidth: "305px", width: "100%", height: "auto" }}
                              className="ml-3 my-4"
                              variant="advanced"
                              folderStructure={projectName + "seriesImage"}
                              fallbackImage={card}
                            />
                            <ImageVideoFileUpload
                              label="Landscape Image"
                              imagePath={landscapeImagePath || seriesDetailsTmdb.landscapeImage}
                              onUploadSuccess={handleLandscapeImageSuccess}
                              error={error.image}
                              imgStyle={{ width: "100%", height: "auto", objectFit: "cover" }}
                              className="ml-3 my-4"
                              variant="advanced"
                              folderStructure={projectName + "seriesLandscapeImage"}
                              // fallbackImage={thumb}
                            />
                          </TabPanel>

                          <TabPanel value={tabValue} index={2}>
                            <Input
                              label="SEO Title"
                              placeholder="SEO Title"
                              name="seoTitle"
                              value={seoTitle}
                              onChange={(e) => handleInputChange(e, setSeoTitle, "seoTitle")}
                              error={error.seoTitle}
                              className="ml-3"
                            />

                            <CustomSunEditor
                              label="SEO Description"
                              labelClassName="styleForTitle mt-3 movieForm"
                              value={seoDescription}
                              editorRef={seoDesEditor}
                              height={100}
                              onChange={(e) => {
                                setSeoDescription(e);
                                if (!e) {
                                  setError({ ...error, seoDescription: "SEO Description is Required !" });
                                } else {
                                  setError({ ...error, seoDescription: "" });
                                }
                              }}
                              placeholder="SEO Description"
                              error={error.seoDescription}
                              setOptions={editorOptions}
                              className="ml-3 my-4"
                            />

                            <div className="ml-3 row">
                              <div className="col-md-6 my-2">
                                <label className="float-left styleForTitle movieForm">
                                  SEO Tags
                                </label>
                                <div className="flex flex-col gap-2">
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      name="seoTags"
                                      placeholder="Add Tag"
                                      className="form-control form-control-line"
                                      value={tagValue}
                                      onChange={(e) => setTagvalue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleAddTag();
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm px-3 py-1"
                                      onClick={handleAddTag}
                                    >
                                      Add
                                    </button>
                                  </div>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    useFlexGap
                                    sx={{ width: 400, flexWrap: "wrap", mt: 2 }}
                                  >
                                    {seoTags.map((tg) => (
                                      <Chip
                                        color="primary"
                                        key={tg}
                                        label={tg}
                                        onDelete={() => handleRemoveTag(tg)}
                                      />
                                    ))}
                                  </Stack>
                                </div>
                              </div>
                            </div>
                          </TabPanel>
                          <TabPanel value={tabValue} index={3}>
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
                          <TabPanel value={tabValue} index={4}>
                            <h6 className="text-muted mb-3">
                                GAM Ad Config
                            </h6>
                            <Switch
                                label="Ad Enabled"
                                checked={ads?.adEnabled}
                                onChange={(e) => handleAdChange(e, 'adEnabled')}
                              />
                            <Input
                              label="First Ad Episode After"
                              type="number"
                              placeholder="Enter First Ad Episode After "
                              min="1"
                              name="firstAdAfterEpisodes"
                              value={ads?.firstAdAfterEpisodes || ""}
                              onChange={(e) => handleAdChange(e, 'firstAdAfterEpisodes')}
                              className="ml-3"
                            />
                            <Input
                              label="Subsequent Episode Interval"
                              type="number"
                              placeholder="Enter Subsequent Episode Interval "
                              min="1"
                              name="subsequentAdInterval"
                              value={ads?.subsequentAdInterval || ""}
                              onChange={(e) => handleAdChange(e, 'subsequentAdInterval')}
                              className="ml-3"
                            />
                          </TabPanel>
                        </VerticalTab>

                        <DialogActions className="mb-3 mr-3">
                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3 py-1 mt-4"
                            onClick={handleSubmit}
                          >
                            Update
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
                    )
                  )}
                </div >
              </div >
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

export default connect(null, {
  setUploadTvFile,
  getGenre,
  getRegion,
  loadSeriesData,
  updateTvSeries,
  ImdbSeriesCreate,
})(SeriesForm);
