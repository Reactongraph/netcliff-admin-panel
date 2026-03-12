import React, { useState, useEffect } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  getAdvertise,
  updateAdvertise,
  advertisementSwitch,
} from "../store/Advertisement/advertisement.action";

//mui
import Switch from "@mui/material/Switch";

//Toast
import { setToast } from "../util/Toast";

//Alert

//type
import { CLOSE_ADS_TOAST } from "../store/Advertisement/advertisement.type";

const Advertisement = (props) => {
  const dispatch = useDispatch();
  const { advertisement, toast, toastData, actionFor } = useSelector(
    (state) => state.advertisement
  );

  const [data, setData] = useState("");
  const [industrialId, setIndustrialId] = useState("");
  const [bannerId, setBannerId] = useState("");
  const [nativeId, setNativeId] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [reward, setReward] = useState("");
  const [industrialIdIos, setIndustrialIdIos] = useState("");
  const [bannerIdIos, setBannerIdIos] = useState("");
  const [nativeIdIos, setNativeIdIos] = useState("");
  const [rewardIos, setRewardIos] = useState("");

  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(getAdvertise());
  }, [dispatch]);

  useEffect(() => {
    setData(advertisement);
  }, [advertisement]);

  useEffect(() => {
    setIndustrialId(advertisement?.interstitial);
    setMongoId(advertisement?._id);
    setBannerId(advertisement?.banner);
    setNativeId(advertisement?.native);
    setReward(advertisement?.reward);
    setIndustrialIdIos(advertisement?.interstitialIos);
    setMongoId(advertisement?._id);
    setBannerIdIos(advertisement?.bannerIos);
    setNativeIdIos(advertisement?.nativeIos);
    setRewardIos(advertisement?.rewardIos);
    setShow(advertisement?.isGoogleAdd);
  }, [advertisement]);

  const handleSubmit = () => {
    let data = {
      interstitial: industrialId,
      native: nativeId,
      banner: bannerId,
      interstitialIos: industrialIdIos,
      nativeIos: nativeIdIos,
      bannerIos: bannerIdIos,
      reward,
      rewardIos,
    };

    props.updateAdvertise(data, mongoId);
  };
  const handleChangeShow = () => {
    props.advertisementSwitch(mongoId);
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_ADS_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <h3>Advertisement</h3>
            <div className="header_heading_right_col">
              <div className="switch_app d-flex justify-content-between align-items-center">
                <h5>Google Ads</h5>
                <label class="switch">
                  <Switch
                    onChange={handleChangeShow}
                    checked={show}
                    color="primary"
                    name="checkedB"
                    inputProps={{
                      "aria-label": "primary checkbox",
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="advertisment_wrapper">
            <form>
              <div className="adver_col_flex">
                <div className="ad_col">
                  <h5>Android</h5>
                  <div className="ad_field_col">
                    <label>Interstitial Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={industrialId}
                      onChange={(e) => {
                        setIndustrialId(e.target.value);
                      }}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label>Native Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nativeId}
                      onChange={(e) => {
                        setNativeId(e.target.value);
                      }}
                    />
                  </div>
                  <div className="ad_field_col">
                    <label>Banner Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bannerId}
                      onChange={(e) => {
                        setBannerId(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="ad_col">
                  <h5>Ios</h5>
                  <div className="ad_field_col">
                    <label>Interstitial Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={industrialIdIos}
                      onChange={(e) => {
                        setIndustrialIdIos(e.target.value);
                      }}
                    />
                  </div>

                  <div className="ad_field_col">
                    <label>Native Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nativeIdIos}
                      onChange={(e) => {
                        setNativeIdIos(e.target.value);
                      }}
                    />
                  </div>
                  <div className="ad_field_col">
                    <label>Banner Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bannerIdIos}
                      onChange={(e) => {
                        setBannerIdIos(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="common_btn_wrapper">
                <button
                  className="btn mx-auto mx-md-0 text-white px-4 dark-icon btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getAdvertise,
  updateAdvertise,
  advertisementSwitch,
})(Advertisement);
