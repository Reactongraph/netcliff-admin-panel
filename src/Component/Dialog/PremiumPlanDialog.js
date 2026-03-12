import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//Alert


//action
import {
  createNewPremiumPlan,
  editPremiumPlan,
} from "../../store/PremiumPlan/plan.action";
import { CLOSE_PREMIUM_PLAN_DIALOG } from "../../store/PremiumPlan/plan.type";

const PremiumPlanDialog = (props) => {
  const dispatch = useDispatch();

  
  const { dialog: open, dialogData } = useSelector(
    (state) => state.premiumPlan
  );

  const [name, setName] = useState("");
  const [premiumPlanId, setPremiumPlanId] = useState("");
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("");
  const [price, setPrice] = useState("");
  const [priceStrikeThrough, setPriceStrikeThrough] = useState("");
  const [freeTrialAmount, setFreeTrialAmount] = useState("");
  const [freeTrialDays, setFreeTrialDays] = useState("");
  const [tag, setTag] = useState("");
  const [productKey, setProductKey] = useState("");
  const [productKeys, setProductKeys] = useState({
    googlePlay: "",
    appleStore: "",
    razorpay: "",
    cashfree: ""
  });
  const [planBenefit, setPlanBenefit] = useState("");

  const [error, setError] = useState({
    name: "",
    validity: "",
    price: "",
    priceStrikeThrough: "",
    productKey: "",
    planBenefit: "",
  });

  useEffect(() => {
    if (dialogData) {
      setPremiumPlanId(dialogData._id);
      setValidity(dialogData.validity);
      setValidityType(dialogData.validityType);
      setPrice(dialogData.price);
      setPriceStrikeThrough(dialogData.priceStrikeThrough);
      setFreeTrialAmount(dialogData.freeTrialAmount);
      setFreeTrialDays(dialogData.freeTrialDays)
      setTag(dialogData.tag);
      setProductKey(dialogData.productKey);
      setProductKeys({
        googlePlay: dialogData.productKeys?.googlePlay || "",
        appleStore: dialogData.productKeys?.appleStore || "",
        razorpay: dialogData.productKeys?.razorpay || "",
        cashfree: dialogData.productKeys?.cashfree || ""
      });
      setName(dialogData.name);
      setPlanBenefit(dialogData.planBenefit);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        name: "",
        validity: "",
        price: "",
        priceStrikeThrough: "",
        productKey: "",
        planBenefit: "",
      });
      setPremiumPlanId("");
      setValidity("");
      setValidityType("");
      setTag("");
      setPrice("");
      setPriceStrikeThrough("");
      setFreeTrialAmount("");
      setFreeTrialDays("")
      setProductKey("");
      setProductKeys({
        googlePlay: "",
        appleStore: "",
        razorpay: "",
        cashfree: ""
      });
      setName("");
      setPlanBenefit("");
    },
    [open]
  );

  const handleClose = () => {
    dispatch({ type: CLOSE_PREMIUM_PLAN_DIALOG });
  };

  const handleSubmit = () => {
    
    if (!validity || !price || !productKey || !planBenefit || !name) {
      const error = {};
      if (!name) error.name = "Name is required!";
      if (!validity) error.validity = "Validity is required!";
      if (!price) error.price = "Price is required!";
      if (!productKey) error.productKey = "Product Key is required!";
      if (!planBenefit) error.planBenefit = "Plan Benefit is required!";

      return setError({ ...error });
    } else {
      const validityValid = isNumeric(validity);
      if (!validityValid) {
        return setError({ ...error, validity: "Invalid Validity!!" });
      }
      const priceValid = isNumeric(price);
      if (!priceValid) {
        return setError({ ...error, price: "Invalid Price!!" });
      }
      const data = {
        validity,
        validityType: validityType ? validityType : "month",
        price,
        priceStrikeThrough: priceStrikeThrough,
        freeTrialAmount: freeTrialAmount,
        freeTrialDays: freeTrialDays,
        tag,
        productKey,
        productKeys,
        name,
        planBenefit,
      };

      if (premiumPlanId) {
        props.editPremiumPlan(premiumPlanId, data);
      } else {
        props.createNewPremiumPlan(data);
      }
      handleClose();
    }
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Premium Plan</h5> : <h5>Add Premium Plan</h5>}
        </DialogTitle>

        {/* <IconButton
          style={{
            position: "absolute",
            right: 0,
            color: "#b7b5b9",
          }}
        > */}
        <Tooltip title="Close">
          <CancelIcon
            className="cancelButton"
            sx={{
              position: "absolute",
              top: "23px",
              right: "15px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>

        {/* </IconButton> */}
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle ">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control form-control-line"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              name: "name is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                      />
                      {error.name && (
                        <div className="ml-2 mt-1">
                          {error.name && (
                            <div className="pl-1 text__left">
                             {error.name && (
                        <span className="error">{error.name}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 ">
                        Validity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        min="0"
                        placeholder="1"
                        value={validity}
                        onChange={(e) => {
                          setValidity(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              validity: "Validity is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              validity: "",
                            });
                          }
                        }}
                      />
                      {error.validity && (
                        <div className="ml-2 mt-1">
                          {error.validity && (
                            <div className="pl-1 text__left"> 
                                   {error.validity && (
                        <span className="error">{error.validity}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 ">
                        Validity Type
                      </label>
                      <select
                        name="type"
                        className="form-control form-control-line"
                        id="type"
                        value={validityType}
                        onChange={(e) => {
                          setValidityType(e.target.value);
                        }}
                      >
                        <option value="month" selected>
                          Month
                        </option>
                        <option value="year">Year</option>
                        <option value="day">Day</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="mb-2 styleForTitle ">
                        Product Key (Legacy - GooglePlay)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="android.test.purchased"
                        value={productKey}
                        onChange={(e) => {
                          setProductKey(e.target.value);
                          setProductKeys({
                            ...productKeys,
                            googlePlay: e.target.value
                          });
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              productKey: "Product Key is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              productKey: "",
                            });
                          }
                        }}
                      />
                      {error.productKey && (
                        <div className="ml-2 mt-1">
                          {error.productKey && (
                            <div className="pl-1 text__left">
                                  {error.productKey && (
                        <span className="error">{error.productKey}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="mb-2 styleForTitle">
                        GooglePlay Product Key
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="com.app.premium_monthly"
                        value={productKeys.googlePlay}
                        onChange={(e) => {
                          setProductKeys({
                            ...productKeys,
                            googlePlay: e.target.value
                          });
                          setProductKey(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="mb-2 styleForTitle">
                        Apple Store Product Key
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="premium_monthly_ios"
                        value={productKeys.appleStore}
                        onChange={(e) => {
                          setProductKeys({
                            ...productKeys,
                            appleStore: e.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="mb-2 styleForTitle">
                        Razorpay Product Key
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="plan_premium_monthly"
                        value={productKeys.razorpay}
                        onChange={(e) => {
                          setProductKeys({
                            ...productKeys,
                            razorpay: e.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="mb-2 styleForTitle">
                        Cashfree Product Key
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="cashfree_plan_premium_monthly"
                        value={productKeys.cashfree}
                        onChange={(e) => {
                          setProductKeys({
                            ...productKeys,
                            cashfree: e.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 ">
                        Amount
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        min="0"
                        placeholder="10"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              price: "Price is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              price: "",
                            });
                          }
                        }}
                      />
                      {error.price && (
                        <div className="ml-2 mt-1">
                          {error.price && (
                            <div className="pl-1 text__left">
                                  {error.price && (
                        <span className="error">{error.price}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 ">
                        Strike-through Price
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        placeholder="15"
                        value={priceStrikeThrough}
                        onChange={(e) => {
                          setPriceStrikeThrough(e.target.value);
                          if (e.target.value && parseFloat(e.target.value) <= parseFloat(price || 0)) {
                            return setError({
                              ...error,
                              priceStrikeThrough: "Strike-through price should be higher than amount",
                            });
                          } else {
                            return setError({
                              ...error,
                              priceStrikeThrough: "",
                            });
                          }
                        }}
                      />
                      {error.priceStrikeThrough && (
                        <div className="ml-2 mt-1">
                          {error.priceStrikeThrough && (
                            <div className="pl-1 text__left">
                              <span className="error">{error.priceStrikeThrough}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="styleForTitle mb-2 ">
                        Free Trial Amount
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        placeholder="0"
                        value={freeTrialAmount}
                        onChange={(e) => {
                          setFreeTrialAmount(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="styleForTitle mb-2 ">
                        Free Trial Days
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        placeholder="5"
                        max="365"
                        value={freeTrialDays}
                        onChange={(e) => {
                          setFreeTrialDays(Number(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 ">
                        Tag
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="20%"
                        value={tag}
                        onChange={(e) => {
                          setTag(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle ">
                        Plan Benefit
                      </label>
                      <textarea
                        class="form-control"
                        placeholder="Plan Benefit"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        value={planBenefit}
                        onChange={(e) => {
                          setPlanBenefit(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              planBenefit: "Plan Benefit is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              planBenefit: "",
                            });
                          }
                        }}
                      ></textarea>

                      {error.planBenefit && (
                        <div className="pl-1 text-left">
                              {error.planBenefit && (
                        <span className="error">{error.planBenefit}</span>
                      )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className=" dia_border w-100"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogData ? (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { createNewPremiumPlan, editPremiumPlan })(
  PremiumPlanDialog
);
