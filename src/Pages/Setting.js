import React, { useState, useEffect } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getSetting, updateSetting, updateLoginScreenThumbnail } from "../store/Setting/setting.action";
import { CLOSE_SETTING_TOAST } from "../store/Setting/setting.type";

//Alert
import { setToast } from "../util/Toast";

// Material-UI Switch
import Switch from "@mui/material/Switch";

// API
import { apiInstanceFetch } from "../util/api";

const Setting = (props) => {
  const dispatch = useDispatch();
  const [mongoId, setMongoId] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [tncLink, setTncLink] = useState("");
  const [faqUrl, setFaqUrl] = useState("");
  const [uploadContentLink, setUploadContentLink] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [razorPayId, setRazorPayId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [anonymousEpisodeWatchLimit, setAnonymousEpisodeWatchLimit] = useState(5);
  const [viewMultiplier, setViewMultiplier] = useState(1);
  const [viewConstant, setViewConstant] = useState(0);
  const [favoriteMultiplier, setFavoriteMultiplier] = useState(1);
  const [favoriteConstant, setFavoriteConstant] = useState(0);
  const [likeMultiplier, setLikeMultiplier] = useState(1);
  const [likeConstant, setLikeConstant] = useState(0);
  const [isFreeTrialEnabled, setIsFreeTrialEnabled] = useState(false);
  const [isPaymentProviderFreeTrialEnabled, setIsPaymentProviderFreeTrialEnabled] = useState(false);
  const [isPaymentProviderFreeTrialBadgeEnabled, setIsPaymentProviderFreeTrialBadgeEnabled] = useState(false);
  const [paymentProviderFreeTrialDays, setPaymentProviderFreeTrialDays] = useState(7);
  const [userStickynessDays, setUserStickynessDays] = useState(30);
  const [subscriptionAuthPolling, setSubscriptionAuthPolling] = useState(20);  
  const [paymentProviderFreeTrialText, setPaymentProviderFreeTrialText] = useState("");
  const [androidVersion, setAndroidVersion] = useState("0.0.0");
  const [iosVersion, setIosVersion] = useState("0.0.0");
  const [updateType, setUpdateType] = useState("optional");
  const [ga4FirebaseAppId, setGa4FirebaseAppId] = useState("");
  const [ga4ApiSecret, setGa4ApiSecret] = useState("");
  const [thumbnailAnalyticsInterval, setThumbnailAnalyticsInterval] = useState(30);
  const [adjustEnvironment, setAdjustEnvironment] = useState("sandbox");
  const [continueWatchingRewindTime, setContinueWatchingRewindTime] = useState(0);
  const [subscriptionCronIntervalMinutes, setSubscriptionCronIntervalMinutes] = useState(0);
  const [activePaymentGateway, setActivePaymentGateway] = useState("razorpay");
  const [adjustWebCampaignReference, setAdjustWebCampaignReference] = useState([]);
  const [loginScreenThumbnailImage, setLoginScreenThumbnailImage] = useState("");
  const [loginScreenThumbnailVideo, setLoginScreenThumbnailVideo] = useState("");
  const [loginScreenThumbnailImageFile, setLoginScreenThumbnailImageFile] = useState(null);
  const [loginScreenThumbnailVideoFile, setLoginScreenThumbnailVideoFile] = useState(null);
  const [movieAd, setMovieAd] = useState(null);
  const [forYouAd, setForYouAd] = useState(null);

  const [error, setError] = useState({
    privateKey: "",
  });
  const [isFlushingCache, setIsFlushingCache] = useState(false);

  const addAdjustReference = () => {
    setAdjustWebCampaignReference([...adjustWebCampaignReference, { webTracker: "", appTracker: "" }]);
  };

  const removeAdjustReference = (index) => {
    const newList = [...adjustWebCampaignReference];
    newList.splice(index, 1);
    setAdjustWebCampaignReference(newList);
  };

  const handleAdjustReferenceChange = (index, field, value) => {
    const newList = [...adjustWebCampaignReference];
    newList[index][field] = value;
    setAdjustWebCampaignReference(newList);
  };


  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  const { setting, toast, toastData, actionFor } = useSelector(
    (state) => state.setting
  );

  useEffect(() => {
    setMongoId(setting._id);
    setPrivacyPolicyLink(setting.privacyPolicyLink);
    setTncLink(setting.tncLink);
    setFaqUrl(setting.faqUrl);
    setUploadContentLink(setting.uploadContentLink);
    setStripePublishableKey(setting.stripePublishableKey);
    setStripeSecretKey(setting.stripeSecretKey);
    setRazorPayId(setting.razorPayId);
    setPrivateKey(JSON.stringify(setting.privateKey));
    setAnonymousEpisodeWatchLimit(setting.anonymousEpisodeWatchLimit || 5);
    setViewMultiplier(setting.viewMultiplier || 1);
    setViewConstant(setting.viewConstant || 0);
    setFavoriteMultiplier(setting.favoriteMultiplier || 1);
    setFavoriteConstant(setting.favoriteConstant || 0);
    setLikeMultiplier(setting.likeMultiplier || 1);
    setLikeConstant(setting.likeConstant || 0);
    setIsFreeTrialEnabled(setting.isFreeTrialEnabled || false);
    setIsPaymentProviderFreeTrialEnabled(setting.isPaymentProviderFreeTrialEnabled || false);
    setIsPaymentProviderFreeTrialBadgeEnabled(setting.isPaymentProviderFreeTrialBadgeEnabled || false);
    setPaymentProviderFreeTrialDays(setting.paymentProviderFreeTrialDays || 7);
    setUserStickynessDays(setting.userStickynessDays || 30);
    setMovieAd(
      setting.movieAd || {
        adEnabled: false,
        firstAdAfterEpisodes: null,
        subsequentAdInterval: null,
      },
    );
    setForYouAd(
      setting.forYouAd || { adEnabled: false, subsequentAdInterval: null },
    );
    setSubscriptionAuthPolling(setting.subscriptionAuthPolling || 20);
    setPaymentProviderFreeTrialText(setting.paymentProviderFreeTrialText || "");
    setAndroidVersion(setting.androidVersion || "0.0.0");
    setIosVersion(setting.iosVersion || "0.0.0");
    setUpdateType(setting.updateType || "optional");
    setGa4FirebaseAppId(setting.ga4FirebaseAppId || "");
    setGa4ApiSecret(setting.ga4ApiSecret || "");
    setThumbnailAnalyticsInterval(setting.thumbnailAnalyticsInterval || 30);
    setAdjustEnvironment(setting.adjustEnvironment || "sandbox");
    setContinueWatchingRewindTime(setting.continueWatchingRewindTime || 0);
    setSubscriptionCronIntervalMinutes(setting.subscriptionCronIntervalMinutes || 0);
    setActivePaymentGateway(setting.activePaymentGateway || "razorpay");
    setLoginScreenThumbnailImage(setting.loginScreenThumbnailImage || "");
    setLoginScreenThumbnailVideo(setting.loginScreenThumbnailVideo || "");

    if (setting.adjustWebCampaignReference) {
      const formatted = Object.entries(setting.adjustWebCampaignReference).map(([web, app]) => ({
        webTracker: web,
        appTracker: app
      }));
      setAdjustWebCampaignReference(formatted);
    } else {
      setAdjustWebCampaignReference([]);
    }
  }, [setting]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate anonymousEpisodeWatchLimit
    let validEpisodeLimit = anonymousEpisodeWatchLimit;
    if (validEpisodeLimit === '' || validEpisodeLimit < 1) {
      validEpisodeLimit = 5; // Default value
    } else if (validEpisodeLimit > 100) {
      validEpisodeLimit = 100; // Max value
    }

    // Validate gamification settings
    let validViewMultiplier = viewMultiplier;
    if (validViewMultiplier === '' || validViewMultiplier < 1) {
      validViewMultiplier = 1; // Default value
    }

    let validViewConstant = viewConstant;
    if (validViewConstant === '' || validViewConstant < 0) {
      validViewConstant = 0; // Default value
    }

    // Validate favorite gamification settings
    let validFavoriteMultiplier = favoriteMultiplier;
    if (validFavoriteMultiplier === '' || validFavoriteMultiplier < 1) {
      validFavoriteMultiplier = 1; // Default value
    }

    let validFavoriteConstant = favoriteConstant;
    if (validFavoriteConstant === '' || validFavoriteConstant < 0) {
      validFavoriteConstant = 0; // Default value
    }

    // Validate like gamification settings
    let validLikeMultiplier = likeMultiplier;
    if (validLikeMultiplier === '' || validLikeMultiplier < 1) {
      validLikeMultiplier = 1; // Default value
    }

    let validLikeConstant = likeConstant;
    if (validLikeConstant === '' || validLikeConstant < 0) {
      validLikeConstant = 0; // Default value
    }

    // Validate subscription cron interval minutes
    let validCronIntervalMinutes = subscriptionCronIntervalMinutes;
    if (validCronIntervalMinutes === '' || validCronIntervalMinutes < 15) {
      validCronIntervalMinutes = 15; // Default minimum value
    }

    const data = {
      privacyPolicyLink,
      tncLink,
      faqUrl,
      uploadContentLink,
      stripePublishableKey,
      stripeSecretKey,
      razorPayId,
      privateKey,
      anonymousEpisodeWatchLimit: validEpisodeLimit,
      viewMultiplier: validViewMultiplier,
      viewConstant: validViewConstant,
      favoriteMultiplier: validFavoriteMultiplier,
      favoriteConstant: validFavoriteConstant,
      likeMultiplier: validLikeMultiplier,
      likeConstant: validLikeConstant,
      isFreeTrialEnabled,
      isPaymentProviderFreeTrialEnabled,
      isPaymentProviderFreeTrialBadgeEnabled,
      paymentProviderFreeTrialDays,
      userStickynessDays,
      subscriptionAuthPolling,
      paymentProviderFreeTrialText,
      androidVersion,
      iosVersion,
      updateType,
      ga4FirebaseAppId,
      ga4ApiSecret,
      thumbnailAnalyticsInterval,
      adjustEnvironment,
      continueWatchingRewindTime,
      subscriptionCronIntervalMinutes: validCronIntervalMinutes,
      activePaymentGateway,
      forYouAd,
      movieAd,
      adjustWebCampaignReference: adjustWebCampaignReference.reduce((acc, item) => {
        if (item.webTracker.trim() && item.appTracker.trim()) {
          acc[item.webTracker.trim()] = item.appTracker.trim();
        }
        return acc;
      }, {}),
    };

    props.updateSetting(mongoId, data);
  };

  const handleFlushCache = async () => {
    if (!window.confirm('Are you sure you want to clear all cache? This action cannot be undone.')) {
      return;
    }

    setIsFlushingCache(true);
    try {
      await apiInstanceFetch.delete('user/flush-redis');

      setToast('Cache cleared successfully!', 'insert');
    } catch (error) {
      console.error('Error flushing cache:', error);
      setToast('Failed to clear cache');
    } finally {
      setIsFlushingCache(false);
    }
  };

  const handleLoginScreenThumbnailSubmit = (e) => {
    e.preventDefault();
    if (!mongoId) {
      setToast("Setting not loaded. Refresh the page.", "error");
      return;
    }
    const hasImage = !!loginScreenThumbnailImageFile;
    const hasVideo = !!loginScreenThumbnailVideoFile;
    if (!hasImage && !hasVideo) {
      setToast("Upload at least one image or video file.", "error");
      return;
    }
    dispatch(
      updateLoginScreenThumbnail(mongoId, {
        imageFile: loginScreenThumbnailImageFile || undefined,
        videoFile: loginScreenThumbnailVideoFile || undefined,
      })
    );
    setLoginScreenThumbnailImageFile(null);
    setLoginScreenThumbnailVideoFile(null);
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_SETTING_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Setting</h3>
          </div>
          <div className="advertisment_wrapper">
            <div className="adver_col_flex flex_wrap">
              {/* <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Stripe
                  </h5>

                  <div className="ad_field_col">
                    <label for="publishableKey">Publishable Key</label>
                    <input
                      type="text"
                      class="form-control"
                      id="publishableKey"
                      value={stripePublishableKey}
                      onChange={(e) => setStripePublishableKey(e.target.value)}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="secretKey" class="form-label">
                      Secret Key
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="secretKey"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div> */}

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Razorpay
                  </h5>
                  <div className="ad_field_col">
                    <label for="razorPayId" class="form-label">
                      Key ID
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="razorPayId"
                      value={razorPayId}
                      onChange={(e) => setRazorPayId(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Privacy policy
                  </h5>
                  <div className="ad_field_col">
                    <label for="policyLink" class="form-label">
                      Link
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyLink"
                      value={privacyPolicyLink}
                      onChange={(e) => setPrivacyPolicyLink(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Terms And Condition
                  </h5>
                  <div className="ad_field_col">
                    <label for="policyLink" class="form-label">
                      Link
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyLink"
                      value={tncLink}
                      onChange={(e) => setTncLink(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    FAQ
                  </h5>
                  <div className="ad_field_col">
                    <label for="faqUrl" class="form-label">
                      FAQ URL
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="faqUrl"
                      value={faqUrl}
                      onChange={(e) => setFaqUrl(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              {/* <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Upload Content
                  </h5>
                  <div className="ad_field_col">
                    <label for="policyLink" class="form-label">
                      Link
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="policyLink"
                      value={uploadContentLink}
                      onChange={(e) => setUploadContentLink(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div> */}

              <div className="ad_col setting_card">
                <form>
                  <h5>Firebase Notification Setting</h5>

                  <div className="ad_field_col">
                    <label for="privateKey" class="form-label">
                      privateKey
                    </label>
                    <textarea
                      name=""
                      className="form-control mt-2"
                      id="privateKey"
                      rows={10}
                      value={privateKey}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        try {
                          const newData = JSON.parse(newValue);
                          setPrivateKey(newValue);
                          setError("");
                        } catch (error) {
                          // Handle invalid JSON input
                          console.error("Invalid JSON input:", error);
                          setPrivateKey(newValue);
                          return setError({
                            ...error,
                            privateKey: "Invalid JSON input",
                          });
                        }
                      }}
                    ></textarea>

                    {error.privateKey && (
                      <div className="ml-2 mt-1">
                        {error.privateKey && (
                          <div className="pl-1 text__left">
                            <span className="text-danger">
                              {error.privateKey}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    User Settings
                  </h5>
                  <div className="ad_field_col">
                    <label for="freeTrialToggle" class="form-label">
                      Enable Free Trial for Users
                    </label>
                    <div className="exclusiveContainer">
                      <div>
                        <Switch
                          checked={isFreeTrialEnabled}
                          onChange={(e) => {
                            setIsFreeTrialEnabled(e.target?.checked);
                          }}
                          color="primary"
                          name="freeTrialToggle"
                          inputProps={{
                            "aria-label": "free trial toggle",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ad_field_col">
                    <label for="episodeLimit" class="form-label">
                      Maximum Episode Watch Limit
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="episodeLimit"
                      min="1"
                      max="100"
                      value={anonymousEpisodeWatchLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setAnonymousEpisodeWatchLimit('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
                            setAnonymousEpisodeWatchLimit(numValue);
                          }
                        }
                      }}
                    />

                  </div>

                  <div className="ad_field_col">
                    <label for="userStickynessDays" class="form-label">
                      Plan Stickyness Days
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="userStickynessDays"
                      min="1"
                      max="365"
                      value={userStickynessDays}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setUserStickynessDays('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= 365) {
                            setUserStickynessDays(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    View Gamification Settings
                  </h5>
                  <p className="text-muted mb-3">
                    Configure view calculation for public APIs. App needs to restart once to apply changes. Formula: (Original View × Multiplier) + Constant
                  </p>
                  <div className="ad_field_col">
                    <label for="viewMultiplier" class="form-label">
                      View Multiplier
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="viewMultiplier"
                      min="1"
                      step="1"
                      value={viewMultiplier}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setViewMultiplier('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setViewMultiplier(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="viewConstant" class="form-label">
                      View Constant
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="viewConstant"
                      min="0"
                      value={viewConstant}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setViewConstant('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setViewConstant(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Favorite Gamification Settings
                  </h5>
                  <p className="text-muted mb-3">
                    Configure favorite calculation for public APIs. App needs to restart once to apply changes. Formula: (Original Favorite × Multiplier) + Constant
                  </p>
                  <div className="ad_field_col">
                    <label for="favoriteMultiplier" class="form-label">
                      Favorite Multiplier
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="favoriteMultiplier"
                      min="1"
                      step="1"
                      value={favoriteMultiplier}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setFavoriteMultiplier('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setFavoriteMultiplier(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="favoriteConstant" class="form-label">
                      Favorite Constant
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="favoriteConstant"
                      min="0"
                      value={favoriteConstant}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setFavoriteConstant('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setFavoriteConstant(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Like Gamification Settings
                  </h5>
                  <p className="text-muted mb-3">
                    Configure like calculation for public APIs. App needs to restart once to apply changes. Formula: (Original Like × Multiplier) + Constant
                  </p>
                  <div className="ad_field_col">
                    <label for="likeMultiplier" class="form-label">
                      Like Multiplier
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="likeMultiplier"
                      min="1"
                      step="1"
                      value={likeMultiplier}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setLikeMultiplier('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setLikeMultiplier(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="likeConstant" class="form-label">
                      Like Constant
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="likeConstant"
                      min="0"
                      value={likeConstant}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setLikeConstant('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setLikeConstant(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Payment Provider Free Trial
                  </h5>
                  <div className="ad_field_col">
                    <label for="paymentProviderFreeTrialToggle" class="form-label">
                      Enable Payment Provider Free Trial
                    </label>
                    <div className="exclusiveContainer">
                      <div>
                        <Switch
                          checked={isPaymentProviderFreeTrialEnabled}
                          onChange={(e) => {
                            setIsPaymentProviderFreeTrialEnabled(e.target?.checked);
                          }}
                          color="primary"
                          name="paymentProviderFreeTrialToggle"
                          inputProps={{
                            "aria-label": "payment provider free trial toggle",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ad_field_col">
                    <label for="paymentProviderFreeTrialDays" class="form-label">
                      Free Trial Days
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="paymentProviderFreeTrialDays"
                      min="1"
                      max="365"
                      value={paymentProviderFreeTrialDays}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setPaymentProviderFreeTrialDays('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= 365) {
                            setPaymentProviderFreeTrialDays(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="paymentProviderFreeTrialText" class="form-label">
                      Free Trial Text
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="paymentProviderFreeTrialText"
                      value={paymentProviderFreeTrialText}
                      onChange={(e) => setPaymentProviderFreeTrialText(e.target.value)}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="paymentProviderFreeTrialBadgeToggle" class="form-label">
                      Enable Free Trial Badge
                    </label>
                    <div className="exclusiveContainer">
                      <div>
                        <Switch
                          checked={isPaymentProviderFreeTrialBadgeEnabled}
                          onChange={(e) => {
                            setIsPaymentProviderFreeTrialBadgeEnabled(e.target?.checked);
                          }}
                          color="primary"
                          name="paymentProviderFreeTrialBadgeToggle"
                          inputProps={{
                            "aria-label": "payment provider free trial badge toggle",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ad_field_col">
                    <label for="subscriptionCronIntervalMinutes" class="form-label">
                      Cron interval (Minutes)
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        class="form-control"
                        id="subscriptionCronIntervalMinutes"
                        min="15"
                        value={subscriptionCronIntervalMinutes}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setSubscriptionCronIntervalMinutes('');
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              setSubscriptionCronIntervalMinutes(numValue);
                            }
                          }
                        }}
                      />
                      {subscriptionCronIntervalMinutes !== '' && subscriptionCronIntervalMinutes < 15 && (
                        <small className="text-danger">
                          Minimum value is 15 minutes
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    App Version Control
                  </h5>
                  <div className="ad_field_col">
                    <label for="androidVersion" class="form-label">
                      Android Version
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="androidVersion"
                      value={androidVersion}
                      onChange={(e) => setAndroidVersion(e.target.value)}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="iosVersion" class="form-label">
                      iOS Version
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="iosVersion"
                      value={iosVersion}
                      onChange={(e) => setIosVersion(e.target.value)}
                    />
                  </div>


                  <div className="ad_field_col">
                    <label class="form-label">Update Type</label>
                    <div className="mt-2">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="updateType"
                          id="force"
                          value="force"
                          checked={updateType === "force"}
                          onChange={(e) => setUpdateType(e.target.value)}
                        />
                        <label className="form-check-label" for="force">
                          Force
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="updateType"
                          id="optional"
                          value="optional"
                          checked={updateType === "optional"}
                          onChange={(e) => setUpdateType(e.target.value)}
                        />
                        <label className="form-check-label" for="optional">
                          Optional
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="updateType"
                          id="minor"
                          value="minor"
                          checked={updateType === "minor"}
                          onChange={(e) => setUpdateType(e.target.value)}
                        />
                        <label className="form-check-label" for="minor">
                          Minor
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Google Analytics GA4
                  </h5>
                  <div className="ad_field_col">
                    <label for="ga4FirebaseAppId" class="form-label">
                      Firebase App ID
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="ga4FirebaseAppId"
                      placeholder="1:000000000000:android:0000000000000000000000"
                      value={ga4FirebaseAppId}
                      onChange={(e) => setGa4FirebaseAppId(e.target.value)}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label for="ga4ApiSecret" class="form-label">
                      API Secret
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="ga4ApiSecret"
                      value={ga4ApiSecret}
                      onChange={(e) => setGa4ApiSecret(e.target.value)}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Analytics Settings
                  </h5>
                  <div className="ad_field_col">
                    <label for="thumbnailAnalyticsInterval" class="form-label">
                      Thumbnail Analytics Interval (seconds)
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="thumbnailAnalyticsInterval"
                      min="1"
                      value={thumbnailAnalyticsInterval}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setThumbnailAnalyticsInterval('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setThumbnailAnalyticsInterval(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Adjust Environment
                  </h5>
                  <div className="ad_field_col">
                    <label class="form-label">Environment</label>
                    <select
                      class="form-control"
                      value={adjustEnvironment}
                      onChange={(e) => setAdjustEnvironment(e.target.value)}
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="production">Production</option>
                    </select>
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Adjust Campaign Mapping
                    <button
                      type="button"
                      className="btn btn-sm btn-primary ml-2"
                      onClick={addAdjustReference}
                    >
                      <i className="ri-add-line"></i> Add
                    </button>
                  </h5>

                  <div className="adjust-references-container">
                    <div className="d-flex align-items-center mb-2">
                      <div className="mr-2" style={{ flex: 1 }}>
                        <label className="mb-0 text-muted small">Web tracker</label>
                      </div>
                      <div className="mr-2" style={{ flex: 1 }}>
                        <label className="mb-0 text-muted small">App deeplink tracker</label>
                      </div>
                      <div style={{ width: "32px" }}></div>
                    </div>
                    {adjustWebCampaignReference.map((item, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <div className="mr-2" style={{ flex: 1 }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Web tracker"
                            value={item.webTracker}
                            onChange={(e) => handleAdjustReferenceChange(index, "webTracker", e.target.value)}
                          />
                        </div>
                        <div className="mr-2" style={{ flex: 1 }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="App deeplink tracker"
                            value={item.appTracker}
                            onChange={(e) => handleAdjustReferenceChange(index, "appTracker", e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeAdjustReference(index)}
                        >
                          <i className="ri-delete-bin-6-line"></i>
                        </button>
                      </div>
                    ))}
                    {adjustWebCampaignReference.length === 0 && (
                      <div className="text-center text-muted p-2">
                        No references added yet.
                      </div>
                    )}
                  </div>

                  <div className="common_btn_wrapper mt-3">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Continue Watching Settings
                  </h5>
                  <div className="ad_field_col">
                    <label for="continueWatchingRewindTime" class="form-label">
                      Rewind Time (seconds)
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="continueWatchingRewindTime"
                      min="0"
                      value={continueWatchingRewindTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setContinueWatchingRewindTime('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 60) {
                            setContinueWatchingRewindTime(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Settings of the Admin Panel
                  </h5>
                  <div className="ad_field_col">
                    <label class="form-label">Active Payment Gateway</label>
                    <div className="mt-2">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="activePaymentGateway"
                          id="razorpay"
                          value="razorpay"
                          checked={activePaymentGateway === "razorpay"}
                          onChange={(e) => setActivePaymentGateway(e.target.value)}
                        />
                        <label className="form-check-label" for="razorpay">
                          RazorPay
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="activePaymentGateway"
                          id="cashfree"
                          value="cashfree"
                          checked={activePaymentGateway === "cashfree"}
                          onChange={(e) => setActivePaymentGateway(e.target.value)}
                        />
                        <label className="form-check-label" for="cashfree">
                          Cashfree
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="ad_field_col">
                    <label for="subscriptionAuthPolling" class="form-label">
                      Subscription Verification Polling Time (seconds)
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="subscriptionAuthPolling"
                      min="1"
                      value={subscriptionAuthPolling}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setSubscriptionAuthPolling('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setSubscriptionAuthPolling(numValue);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    Cache Management
                  </h5>
                  <p className="text-muted mb-3">
                    Clear all cached data from Redis. This will improve performance by removing outdated cache entries.
                  </p>

                  <div className="common_btn_wrapper">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleFlushCache}
                    >
                      Clear Cache
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form onSubmit={handleLoginScreenThumbnailSubmit}>
                  <h5 className="d-flex justify-content-between align-items-center">
                    Login Screen Thumbnail
                  </h5>
                  <p className="text-muted small mb-2">
                    Image (slow networks) and video (fast networks). App fetches via GET /setting/thumbnail. Upload a file for each.
                  </p>
                  <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        style={{ flex: "1", minWidth: "0", maxWidth: "400px" }}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setLoginScreenThumbnailImageFile(file || null);
                        }}
                      />
                    </div>
                    {(loginScreenThumbnailImage || loginScreenThumbnailImageFile) && (
                      <div className="mt-2" style={{ display: "block", width: "100%", flexBasis: "100%" }}>
                        {loginScreenThumbnailImageFile ? (
                          <img
                            src={URL.createObjectURL(loginScreenThumbnailImageFile)}
                            alt="Preview"
                            style={{ maxWidth: "200px", maxHeight: "120px", objectFit: "contain", borderRadius: "8px" }}
                          />
                        ) : (
                          <img
                            src={loginScreenThumbnailImage}
                            alt="Preview"
                            onError={(e) => { e.target.style.display = "none"; }}
                            style={{ maxWidth: "200px", maxHeight: "120px", objectFit: "contain", borderRadius: "8px" }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0">Video</label>
                      <input
                        type="file"
                        className="form-control"
                        style={{ flex: "1", minWidth: "0", maxWidth: "400px" }}
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setLoginScreenThumbnailVideoFile(file || null);
                        }}
                      />
                    </div>
                    {(loginScreenThumbnailVideo || loginScreenThumbnailVideoFile) && (
                      <div className="mt-2" style={{ display: "block", width: "100%", flexBasis: "100%" }}>
                        <video
                          src={loginScreenThumbnailVideoFile ? URL.createObjectURL(loginScreenThumbnailVideoFile) : loginScreenThumbnailVideo}
                          controls
                          style={{ maxWidth: "200px", maxHeight: "120px", borderRadius: "8px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="common_btn_wrapper">
                    <button type="submit" className="btn dark-icon btn-primary">
                      Update Login Screen Thumbnail
                    </button>
                  </div>
                </form>
              </div>

              <div className="ad_col setting_card">
                <form onSubmit={handleSubmit}>
                  <h5 className="d-flex justify-content-between align-items-center mb-2">
                    GAM Ad Config
                  </h5>
                  <div className="card-ad-conf">
                  <h6 className="text-muted text-center">
                    Movie/Series Ad Config
                  </h6>
                  <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0"> Ad Enabled</label>
                       <Switch
                          checked={movieAd?.adEnabled}
                          onChange={(e) => {
                            setMovieAd({...movieAd, adEnabled: e.target?.checked});
                          }}
                          color="primary"
                          name="movieAdEnabled"
                          inputProps={{
                            "aria-label": "Ad enable flag for movie/series",
                          }}
                        />
                    </div>
                  </div>

                  <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0">First Ad Episode After</label>
                      <input
                        type="number"
                        className="form-control"
                        value={movieAd?.firstAdAfterEpisodes || ""}
                        style={{ flex: "1", minWidth: "0", maxWidth: "400px" }}
                        min="1"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                              setMovieAd({...movieAd, firstAdAfterEpisodes: value});
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              setMovieAd({...movieAd, firstAdAfterEpisodes: numValue});
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                   <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0">Subsequent Episode Interval</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ flex: "1", minWidth: "0", maxWidth: "400px" }}
                        value={movieAd?.subsequentAdInterval || ""}
                        min="1"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                              setMovieAd({...movieAd, subsequentAdInterval: value});
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              setMovieAd({...movieAd, subsequentAdInterval: numValue});
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
</div>
                  <div className="card-ad-conf mt-2">

                <h6 className="text-muted text-center">
                    'For You' Ad Config
                  </h6>
                  <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0"> Ad Enabled</label>
                        <Switch
                          checked={forYouAd?.adEnabled}
                          onChange={(e) => {
                            setForYouAd({...forYouAd, adEnabled: e.target?.checked});
                          }}
                          color="primary"
                          name="forYouAdEnabled"
                          inputProps={{
                            "aria-label": "Ad enable flag for For You feature",
                          }}
                        />
                    </div>
                  </div>

                   <div className="ad_field_col" style={{ display: "block" }}>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "0.5rem" }}>
                      <label className="form-label mb-0">Subsequent Episode Interval</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ flex: "1", minWidth: "0", maxWidth: "400px" }}
                         value={forYouAd?.subsequentAdInterval || ""}
                        min="1"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                              setForYouAd({...forYouAd, subsequentAdInterval: value});
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              setForYouAd({...forYouAd, subsequentAdInterval: numValue});
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
</div>
                  <div className="common_btn_wrapper mt-4">
                    <button type="submit" className="btn dark-icon btn-primary">
                      Update Ad Config
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSetting, updateSetting })(Setting);
