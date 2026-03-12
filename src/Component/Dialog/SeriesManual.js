import { useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  Chip,
  DialogActions,
  Stack,
  Tooltip,
} from "@mui/material";

import RecentActorsIcon from "@mui/icons-material/RecentActors";
import { getRegion } from "../../store/Region/region.action";
import { getGenre } from "../../store/Genre/genre.action";
import { getTags } from "../../store/Tags/tags.action";
import { useState } from "react";
import UploadProgress from "../../Pages/UploadProgress";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { createManualSeries } from "../../store/TvSeries/tvSeries.action";

import AddIcon from "@mui/icons-material/Add";

//Alert

import { projectName } from "../../util/config";
import { getLanguages } from "../../store/Language/language.action";
import { getBadge } from "../../store/Badge/badge.action";
import { videoQualities } from "../../util/videoQualities";
import { maturityRatings } from "../../util/maturityRatings";
import { Toast } from "../../util/Toast_";
import GeoBlockingForm from "./GeoBlockingForm";
import VerticalTab, { TabPanel } from "../Tab/VerticalTab";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import Input from "../molecules/Input";
import Select from "../molecules/Select";
import Switch from "../molecules/Switch";
import CustomSunEditor from "../molecules/CustomSunEditor";
import CustomMultiselect from "../molecules/CustomMultiselect";

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

const SeriesManual = (props) => {
  const seoDesEditor = useRef();
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [landscapeImagePath, setLandscapImagePath] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("Premium");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [convertUpdateType, setConvertUpdateType] = useState({
    image: "",
    landscapeImage: "",
    thumbnail: "",
    link: "",
  });
  const [data] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");
  const [language, setLanguage] = useState([]);
  const [maturity, setMaturity] = useState("");
  const [videoQuality, setVideoQuality] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newReleased, setNewReleased] = useState(false);
  const [isCachedOnHome, setIsCachedOnHome] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoTags, setSeoTags] = useState([]);
  const [tagValue, setTagvalue] = useState("");
  const [allowedCountries, setAllowedCountries] = useState([]);
  const [blockedCountries, setBlockedCountries] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [ads, setAds] = useState({adEnabled: true});
  const [showURL, setShowURL] = useState({
    thumbnailImageShowImage: "",
    seriesImageShowURL: "",
    landscapeImageShowURL: "",
  });
  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    seriesImageResURL: "",
    landscapeImageResURL: "",
  });

  const [error, setError] = useState({
    title: "",
    thumbnail: "",
  });

    const handleAdChange = (e, fieldName) => {
    let value = e.target.value;
    if(fieldName === 'adEnabled'){
      value = e.target.checked;
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
    } else {
      // Optional: set individual errors if needed, but keeping it simple for now
    }
  };

  const [tabs, setTabs] = useState([
    {
      index: 0,
      label: "Details",
      disabled: false,
      hasError: false,
    },

    {
      index: 1,
      label: "Images",
      disabled: false,
      hasError: false,
    },
    {
      index: 2,
      label: "SEO",
      disabled: false,
      hasError: false,
    },
    {
      index: 3,
      label: "Geo-blocking",
      disabled: false,
      hasError: false,
    },
    {
      index: 4,
      label: "Ad Config",
      disabled: false,
      hasError: false,
    },
  ]);
  const [tabValue, setTabValue] = useState(0);

  //get country list
  const [countries, setCountries] = useState([]);
  const { region } = useSelector((state) => state.region);
  const { seriesDetailsTmdb } = useSelector((state) => state.series);
  const { genre } = useSelector((state) => state.genre);
  const { tags: tagsData } = useSelector((state) => state.tags);
  const { languages: reducerLanguages } = useSelector(
    (state) => state.language
  );
  const { badge: badgeList } = useSelector((state) => state.badge);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRegion());
    dispatch(getGenre());
    dispatch(getTags());
    dispatch(getLanguages());
    dispatch(getBadge("active"));
  }, [dispatch]);

  //Set Data after Getting
  useEffect(() => {
    setCountries(region);
    setAllowedCountries(region);
    setBlockedCountries([]);
  }, [region]);

  //get genre list
  const [genreData, setGenreData] = useState([]);

  //Set Data after Getting
  useEffect(() => {
    setGenreData(genre);
  }, [genre]);

  //get tags list
  const [tagsDataState, setTagsDataState] = useState([]);

  //Set Data after Getting
  useEffect(() => {
    setTagsDataState(tagsData);
  }, [tagsData]);

  // Monitor errors and update tab indicators
  useEffect(() => {
    if (error?.title) {
      appendTabError(0); // Details tab
    } else {
      clearTabError(0);
    }

    if (error?.thumbnail) {
      appendTabError(1); // Images tab
    } else {
      clearTabError(1);
    }
  }, [error]);

  const dialogData = JSON.parse(localStorage.getItem("updateMovieData"));

  const history = useHistory();
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");
    if (dialogData) {
      history.goBack();
    } else {
      history.replace("/admin/web_series");
    }
  };

  const handleImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      image: 1,
    });
    setImage(file);
    setResURL({ ...resURL, seriesImageResURL: resDataUrl });
    setShowURL({ ...showURL, seriesImageShowURL: imageURL });
    setImagePath(imageURL);
  };

  const handleLandscapeImageSuccess = ({ resDataUrl, imageURL, file }) => {
    setUpdateType(1);
    setConvertUpdateType({
      ...convertUpdateType,
      landscapeImage: 1,
    });
    // setImage(file);
    setResURL({ ...resURL, landscapeImageResURL: resDataUrl });
    setShowURL({ ...showURL, landscapeImageShowURL: imageURL });
    setLandscapImagePath(imageURL);
  };

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

  // Clear state on dialog close
  useEffect(
    () => () => {
      setTitle("");
      setThumbnail("");
      setGenres([]);
      setCountry("");
      setType("Premium");
      setError({
        title: "",
        thumbnail: "",
      });
    },
    [dialogData]
  );

  const handleSubmit = () => {
    if (
      !title ||
      (!thumbnail && !thumbnailPath && !resURL?.thumbnailImageResURL)
    ) {
      let error = {};
      if (!title) {
        error.title = "title is required";
        Toast("error", "Title is required");
      }
      if (!thumbnail && !thumbnailPath && !resURL?.thumbnailImageResURL) {
        error.thumbnail = "Thumbnail is required";
        Toast("error", "Thumbnail is required");
      }
      return setError({ ...error });
    } else {
      // Prepare data with proper handling of optional fields
      let objData = {
        title,
        description: description || "",
        year: year || "",
        type: type || "Premium",
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
        updateType: updateType || 1,
        convertUpdateType: convertUpdateType || { image: 1, thumbnail: 1, landscapeImage: 1, link: 0 },
        image: resURL?.seriesImageResURL || "",
        thumbnail: resURL?.thumbnailImageResURL || "",
        landscapeImage: resURL?.landscapeImageResURL || "",
      };

      // Only include region if it's selected
      if (country && country !== "Select Country") {
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
      if (maturity && maturity !== "maturity") {
        objData.maturity = maturity;
      }

      // Only include videoQuality if it's selected
      if (videoQuality && videoQuality !== "videoQuality") {
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
      }

      // Call the API and handle response properly
      props.createManualSeries(objData).then((result) => {
        if (result && result.status) {
          history.push("/admin/web_series");
        }
      });
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

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    genres.push(selectedItem?._id);
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

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Insert Web Series</h3>
            <div className="header_heading_right_col">
              <NavLink
                class="nav-link active"
                id="pills-home-tab"
                data-toggle="pill"
                href="#pills-home"
                to="/admin/web_series/series_form"
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
                    <ul
                      class="nav nav-pills mb-2"
                      id="pills-tab"
                      role="tablist"
                    >
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

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <VerticalTab
                    tabs={tabs}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                  >
                    <TabPanel value={tabValue} index={0}>
                      <div className="custom_field_wrapper">
                        <Input
                          label="Title"
                          placeholder="Title"
                          required
                          name="title"
                          value={title}
                          onChange={(e) => handleInputChange(e, setTitle, "title")}
                          error={error.title}
                          className="custom_field_col wdt100"
                        />
                        <CustomSunEditor
                          label="Description"
                          value={description}
                          editorRef={editor}
                          height={200}
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
                          className="custom_field_col wdt100"
                        />
                        <Input
                          label="Release Year"
                          type="date"
                          placeholder="YYYY-MM-DD"
                          name="year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="custom_field_col"
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
                          className="custom_field_col"
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
                          className="custom_field_col"
                          style={{ textTransform: "capitalize" }}
                        />

                        <CustomMultiselect
                          label="Genre"
                          options={genre}
                          selectedValues={dialogData ? dialogData?.genre : seriesDetailsTmdb?.genre}
                          onSelect={onSelect}
                          onRemove={onRemove}
                          error={genres?.length === 0 ? error.genres : ""}
                          placeholder="Select Genre"
                        />

                        <CustomMultiselect
                          label="Tags"
                          options={tagsDataState}
                          selectedValues={dialogData ? dialogData?.tags : seriesDetailsTmdb?.tags}
                          onSelect={onSelectTags}
                          onRemove={onRemoveTags}
                          error={tags?.length === 0 ? error.tags : ""}
                          placeholder="Select Tags"
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
                          className="custom_field_col"
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
                          className="custom_field_col"
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
                          className="custom_field_col"
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
                          className="custom_field_col"
                          style={{ textTransform: "capitalize" }}
                        />

                        <div style={{ display: "flex", gap: "40px" }}>
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

                      </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                      <div className="row ml-3">
                        <ImageVideoFileUpload
                          label="Thumbnail"
                          imagePath={showURL?.thumbnailImageShowImage || thumbnailPath}
                          error={error.thumbnail}
                          folderStructure={projectName + "seriesThumbnail"}
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
                          imagePath={showURL?.seriesImageShowURL || imagePath}
                          error={error.image}
                          folderStructure={projectName + "seriesImage"}
                          onUploadSuccess={handleImageSuccess}
                          className="col-md-12 my-2"
                          labelClassName="movieForm"
                          imgStyle={{ width: "745px", height: "270px" }}
                          variant="advanced"
                        />
                      </div>
                      <div className="row ml-3 my-4">
                        <ImageVideoFileUpload
                          label="Landscape Image"
                          imagePath={showURL?.landscapeImageShowURL || landscapeImagePath}
                          // error={error.image}
                          folderStructure={projectName + "seriesLandscapeImage"}
                          onUploadSuccess={handleLandscapeImageSuccess}
                          className="col-md-12 my-2"
                          labelClassName="movieForm"
                          imgStyle={{width: "100%", height: "auto", objectFit: "cover" }}
                          variant="advanced"
                        />
                      </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                      <Input
                        label="SEO Title"
                        placeholder="SEO Title"
                        name="seoTitle"
                        value={seoTitle}
                        onChange={(e) => handleInputChange(e, setSeoTitle, "seoTitle")}
                        error={error.seoTitle}
                        className="wdt100"
                      />
                      <CustomSunEditor
                        label="SEO Description"
                        value={seoDescription}
                        editorRef={seoDesEditor}
                        height={100}
                        width={850}
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
                        labelClassName="styleForTitle mt-3 movieForm"
                      />
                      <div class="ml-3 row">
                        <div className="col-md-6 my-2">
                          <Input
                            label="SEO Tags"
                            placeholder="Add Tag"
                            name="seoTags"
                            value={tagValue}
                            onChange={(e) => setTagvalue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                            append={
                              <button
                                type="button"
                                className="btn btn-primary btn-sm px-3 py-1 mt-2"
                                onClick={handleAddTag}
                              >
                                Add
                              </button>
                            }
                          />
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
                    <TabPanel value={tabValue} index={3}>
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

                  <DialogActions className="mb-3  mr-2">
                    {dialogData ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm px-3 py-1 mt-4"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-3 py-1 mt-4"
                        onClick={handleSubmit}
                      >
                        Insert
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm px-3 py-1 mt-4"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </DialogActions>
                  <UploadProgress data={data} />
                </div>
              </div>
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

export default connect(null, { getRegion, getGenre, createManualSeries })(
  SeriesManual
);
