import { useEffect, useState, useRef } from "react";
import { setToast } from "../util/Toast";
import Switch from "@mui/material/Switch";
// Editor
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

// Image Upload
import { uploadFile } from "../util/AwsFunction";
import noImage from "../Component/assets/images/noImage.png";
import { handleImageError } from "../util/helperFunctions";

import { acceptImageTypes } from "../util/contants";
import { apiInstanceFetch } from "../util/api";
import { useParams } from "react-router-dom";
import PaymentScreenPreview from "./PaymentScreenPreview";

const EDITOR_INSTANCE = {
  MAIN_HEADING: "mainHeading",
  SECONDARY_HEADING: "secondaryHeading",
  FOOTER_TEXT: "footerText",
  DISCLAIMER_TEXT: "disclaimerText",
  CTA_BUTTON: "ctaButton",
  STEP: {
    title: "stepTitle",
    body: "stepBody",
  },
};

const MAX_LIMITS = {
  [EDITOR_INSTANCE.MAIN_HEADING]: 40,
  [EDITOR_INSTANCE.SECONDARY_HEADING]: 35,
  [EDITOR_INSTANCE.FOOTER_TEXT]: 30,
  [EDITOR_INSTANCE.DISCLAIMER_TEXT]: 75,
  [EDITOR_INSTANCE.CTA_BUTTON]: 20,
  [EDITOR_INSTANCE.STEP.title]: 30,
  [EDITOR_INSTANCE.STEP.body]: 55,
};

const ValidationNote = ({ limit }) => {
  return limit ? (
    <div
      style={{
        textAlign: "right",
        marginTop: 2,
      }}
    >
      <small>
        Note: Max <b>{limit}</b> characters allowed
      </small>
    </div>
  ) : null;
};

const CustomPaymentScreen = () => {
  const { id: planId } = useParams();
  const [planDetails, setPlanDetails] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);
  const editorRefs = useRef({});
  const [config, setConfig] = useState({
    mainHeading: "",
    secondaryHeading: "",
    footerText: "",
    disclaimerText: "",
    creative: [],
    steps: [],
    socialLinks: [],
    cta: {
      label: "",
      url: "",
      backgroundColor: "#E50914",
      textColor: "#ffffff",
    },
    selectedPlanId: "",
    planId: "",
    showUpiTags: false,
    type: "paymentPlan",
  });

  const [loading, setLoading] = useState(false);

  // Configured based on user request: font size, font, bold, uppercase, text color, undo/redo
  const editorOptions = {
    buttonList: [
      ["align"],
      ["undo", "redo"],
      ["font", "fontSize"],
      ["bold"],
      ["fontColor"],
    ],
    height: 100,
  };

  useEffect(() => {
    fetchConfig();
    fetchPlanDetails();
  }, []);

  const handleShowUpiTags = (showTags) => {
    handleTextChange("showUpiTags", showTags);
  };

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const res = await apiInstanceFetch.get(
        `premiumPlan/details?planId=${planId}`,
      );
      if (res.status === true || res.data?.status === true) {
        const data = res.data;
        setPlanDetails(data);
      }
    } catch (error) {
      console.error(error);
      setToast("Failed to fetch config", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await apiInstanceFetch.get(
        `custom-page/paymentPlanConfig?type=paymentPlan&planId=${planId}`,
      );
      if (res.status === true || res.data?.status === true) {
        const data = res.data;

        // Handle legacy data or empty arrays
        const creative = Array.isArray(data.creative) ? data.creative : [];
        const socialLinks = Array.isArray(data.socialLinks)
          ? data.socialLinks
          : [];
        // Ensure steps have IDs for stable rendering
        const stepsRaw = Array.isArray(data.steps) ? data.steps : [];
        const steps = stepsRaw.map((s) => ({
          ...s,
          id: s.id || Math.random().toString(36).substr(2, 9),
        }));

        setConfig({
          mainHeading: data.mainHeading || "",
          secondaryHeading: data.secondaryHeading || "",
          footerText: data.footerText || "",
          disclaimerText: data.disclaimerText || "",
          creative: creative,
          steps: steps,
          socialLinks: socialLinks,
          cta: {
            label: data.cta?.label || "",
          },
          selectedPlanId: data.selectedPlanId || "",
          planId: data.planId || "",
          showUpiTags: data.showUpiTags || false,
          type: "paymentPlan",
        });
      }
    } catch (error) {
      console.error(error);
      setToast("Failed to fetch config", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeepChange = (section, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleTextChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- Steps Logic ---
  const handleStepChange = (index, field, value) => {
    setConfig((prev) => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  const addStep = () => {
    if (config.steps.length >= 3) {
      setToast("Max 3 steps allowed", "update");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Date.now(), // Unique ID for key
          title: "",
          body: "",
          order: prev.steps.length + 1,
          enabled: true,
        },
      ],
    }));
  };

  const removeStep = (index) => {
    setConfig((prev) => {
      const newSteps = prev.steps.filter((_, i) => i !== index);
      return { ...prev, steps: newSteps };
    });
  };

  // --- Creative Logic ---
  const handleCreativeChange = (index, field, value) => {
    setConfig((prev) => {
      const newCreative = [...prev.creative];
      newCreative[index] = { ...newCreative[index], [field]: value };
      return { ...prev, creative: newCreative };
    });
  };

  const addCreative = () => {
    setConfig((prev) => ({
      ...prev,
      creative: [
        ...prev.creative,
        {
          url: "",
          type: "image",
          thumbnailUrl: "",
          order: prev.creative.length + 1,
        },
      ],
    }));
  };

  const removeCreative = (index) => {
    setConfig((prev) => {
      const newCreative = prev.creative.filter((_, i) => i !== index);
      return { ...prev, creative: newCreative };
    });
  };

  // --- Image Upload Logic ---
  const creativeFileRefs = useRef({}); // Changed to object for string keys
  const [uploadingCreative, setUploadingCreative] = useState({});
  const folderStructureCreative = "subscriptionPage";

  const handleCreativeImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingCreative((prev) => ({ ...prev, [index]: true }));

      const data = await uploadFile(file, folderStructureCreative);

      if (!data || (!data.resDataUrl && !data.imageURL)) {
        throw new Error("Upload failed: No URL returned");
      }

      const resDataUrl = data.resDataUrl || data.imageURL;

      // Update the creative URL with the uploaded image
      const newCreative = [...config.creative];
      newCreative[index] = {
        ...newCreative[index],
        url: resDataUrl, // Store the Azure URL
      };
      setConfig((prev) => ({ ...prev, creative: newCreative })); // Use functional update

      setToast("Image uploaded successfully", "insert");
    } catch (error) {
      console.error("Upload error:", error);
      setToast("Failed to upload image", "error");
    } finally {
      setUploadingCreative((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleCreativeThumbnailUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingCreative((prev) => ({ ...prev, [`${index}_thumb`]: true }));

      const data = await uploadFile(file, folderStructureCreative);

      if (!data || (!data.resDataUrl && !data.imageURL)) {
        throw new Error("Upload failed: No URL returned");
      }

      const resDataUrl = data.resDataUrl || data.imageURL;

      // Update the creative thumbnail URL
      const newCreative = [...config.creative];
      newCreative[index] = {
        ...newCreative[index],
        thumbnailUrl: resDataUrl,
      };
      setConfig((prev) => ({ ...prev, creative: newCreative })); // Use functional update

      setToast("Thumbnail uploaded successfully", "insert");
    } catch (error) {
      console.error("Upload error:", error);
      setToast("Failed to upload thumbnail", "error");
    } finally {
      setUploadingCreative((prev) => ({ ...prev, [`${index}_thumb`]: false }));
    }
  };

  const triggerCreativeFileInput = (key) => {
    if (creativeFileRefs.current[key]) {
      creativeFileRefs.current[key].click();
    }
  };

  // --- Social Logic ---
  const handleSocialChange = (index, field, value) => {
    setConfig((prev) => {
      const newSocial = [...prev.socialLinks];
      newSocial[index] = { ...newSocial[index], [field]: value };
      return { ...prev, socialLinks: newSocial };
    });
  };

  const addSocial = () => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          platform: "facebook",
          url: "",
          iconUrl: "",
          order: prev.socialLinks.length + 1,
        },
      ],
    }));
  };

  const removeSocial = (index) => {
    setConfig((prev) => {
      const newSocial = prev.socialLinks.filter((_, i) => i !== index);
      return { ...prev, socialLinks: newSocial };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("config", config);

      const res = await apiInstanceFetch.patch("custom-page", config);
      if (res.status === true || res.data?.status === true) {
        setToast("Configuration saved successfully", "insert");
      }
    } catch (error) {
      console.error(error);
      setToast("Failed to save configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (id, e) => {
    let idLimit = id;
    if (id.includes(EDITOR_INSTANCE.STEP.title)) {
      idLimit = EDITOR_INSTANCE.STEP.title;
    } else if (id.includes(EDITOR_INSTANCE.STEP.body)) {
      idLimit = EDITOR_INSTANCE.STEP.body;
    }
    const limit = MAX_LIMITS[idLimit] + 2;
    const length = editorRefs.current[id]?.getText().length || 0;

    console.log({ limit, length });

    if (length >= limit && !["Backspace", "Delete"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleBlur = (id) => {
    let idLimit = id;
    if (id.includes(EDITOR_INSTANCE.STEP.title)) {
      idLimit = EDITOR_INSTANCE.STEP.title;
    } else if (id.includes(EDITOR_INSTANCE.STEP.body)) {
      idLimit = EDITOR_INSTANCE.STEP.body;
    }

    const limit = MAX_LIMITS[idLimit];
    const editor = editorRefs.current[id];
    if (!editor) return;

    const text = editor.getText();

    if (text.length > limit) {
      const trimmedText = text.slice(0, limit);
      editor.setContents(trimmedText);
      setToast("Pasted content exceeds the character limit.", "error");
    }
  };

  if (loading && !config.mainHeading) {
    // Initial loading
    return (
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="iq-card">
            <div className="iq-card-body text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="content-page" className="content-page payment-screen-pg">
      <div className="container-fluid">
        <div
          className="header_heading p_zero preview-btn-container"
          style={{ marginBottom: "1.5rem", letterSpacing: "1px" }}
        >
          <h5 className="ml-0">
            <b>Payment Screen Configuration</b>
          </h5>
          <h6>
            <b>Plan: </b>
            {planDetails?.name || ""}{" "}
            {planDetails?.price
              ? `(Rs ${planDetails?.price}) - ${planDetails?.status?.toUpperCase() || ""}`
              : ""}
          </h6>
          <button
            className="btn btn-primary"
            onClick={() => setPreviewOpen(true)}
          >
            Preview
          </button>
        </div>

        <div style={{ marginTop: "60px" }} className="iq-card mb-5">
          <div className="iq-card-body">
            <form onSubmit={handleSubmit}>
              {/* --- Text Configuration --- */}
              <h5
                className="mb-3 text-muted ml-0"
                style={{
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Text Configuration
              </h5>
              <div className="row">
                <div className="col-md-6 mb-6">
                  <div className="form-group">
                    <label className="form-label">Main Heading</label>
                    <SunEditor
                      onKeyDown={(e) =>
                        handleKeyDown(EDITOR_INSTANCE.MAIN_HEADING, e)
                      }
                      onBlur={() => handleBlur(EDITOR_INSTANCE.MAIN_HEADING)}
                      value={config.mainHeading}
                      setContents={config.mainHeading}
                      getSunEditorInstance={(se) => {
                        editorRefs.current[EDITOR_INSTANCE.MAIN_HEADING] = se;
                      }}
                      onChange={(content) =>
                        handleTextChange("mainHeading", content)
                      }
                      setOptions={{
                        ...editorOptions,
                        fontSize: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24],
                      }}
                      placeholder="Enter Main Heading..."
                    />
                    <ValidationNote
                      limit={MAX_LIMITS[EDITOR_INSTANCE.MAIN_HEADING]}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-6">
                  <div className="form-group">
                    <label className="form-label">Secondary Heading</label>
                    <SunEditor
                      onKeyDown={(e) =>
                        handleKeyDown(EDITOR_INSTANCE.SECONDARY_HEADING, e)
                      }
                      onBlur={() =>
                        handleBlur(EDITOR_INSTANCE.SECONDARY_HEADING)
                      }
                      getSunEditorInstance={(se) => {
                        editorRefs.current[EDITOR_INSTANCE.SECONDARY_HEADING] =
                          se;
                      }}
                      value={config.secondaryHeading}
                      setContents={config.secondaryHeading}
                      onChange={(content) =>
                        handleTextChange("secondaryHeading", content)
                      }
                      setOptions={editorOptions}
                      placeholder="Enter Secondary Heading..."
                    />
                    <ValidationNote
                      limit={MAX_LIMITS[EDITOR_INSTANCE.SECONDARY_HEADING]}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label className="form-label">Footer Text</label>
                    <SunEditor
                      onKeyDown={(e) =>
                        handleKeyDown(EDITOR_INSTANCE.FOOTER_TEXT, e)
                      }
                      onBlur={() => handleBlur(EDITOR_INSTANCE.FOOTER_TEXT)}
                      getSunEditorInstance={(se) => {
                        editorRefs.current[EDITOR_INSTANCE.FOOTER_TEXT] = se;
                      }}
                      value={config.footerText}
                      setContents={config.footerText}
                      onChange={(content) =>
                        handleTextChange("footerText", content)
                      }
                      setOptions={editorOptions}
                      placeholder="Footer Text..."
                    />
                    <ValidationNote
                      limit={MAX_LIMITS[EDITOR_INSTANCE.FOOTER_TEXT]}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label className="form-label">Disclaimer Text</label>
                    <SunEditor
                      onKeyDown={(e) =>
                        handleKeyDown(EDITOR_INSTANCE.DISCLAIMER_TEXT, e)
                      }
                      onBlur={() => handleBlur(EDITOR_INSTANCE.DISCLAIMER_TEXT)}
                      getSunEditorInstance={(se) => {
                        editorRefs.current[EDITOR_INSTANCE.DISCLAIMER_TEXT] =
                          se;
                      }}
                      value={config.disclaimerText}
                      setContents={config.disclaimerText}
                      onChange={(content) =>
                        handleTextChange("disclaimerText", content)
                      }
                      setOptions={editorOptions}
                      placeholder="Disclaimer Text..."
                    />
                    <ValidationNote
                      limit={MAX_LIMITS[EDITOR_INSTANCE.DISCLAIMER_TEXT]}
                    />
                  </div>
                </div>
              </div>
              <hr style={{ margin: "2.5rem 0" }} />

              {/* --- Creative Configuration --- */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5
                  className="mb-0 text-muted ml-0"
                  style={{
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Creatives
                </h5>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addCreative}
                >
                  + Add Creative
                </button>
              </div>

              {config.creative.map((item, index) => (
                <div key={index} className="card p-3 mb-3 border bg-light">
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="text-secondary">Creative #{index + 1}</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeCreative(index)}
                    >
                      <i className="ri-delete-bin-line mr-0"></i>
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="form-label">Order</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.order}
                          onChange={(e) =>
                            handleCreativeChange(
                              index,
                              "order",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                          className="form-control"
                          value={item.type}
                          onChange={(e) =>
                            handleCreativeChange(index, "type", e.target.value)
                          }
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          {item.type === "video" ? "Video/Image" : "Image"}
                        </label>

                        {/* Hidden file input */}
                        <input
                          ref={(el) =>
                            (creativeFileRefs.current[`${index}_main`] = el)
                          }
                          type="file"
                          accept={
                            item.type === "video" ? "video/*" : acceptImageTypes
                          }
                          onChange={(e) => handleCreativeImageUpload(index, e)}
                          style={{ display: "none" }}
                        />

                        {/* Image Preview or Upload Button */}
                        <div className="d-flex align-items-center gap-2">
                          {item.url ? (
                            item.type === "video" ? (
                              <video
                                src={item.url}
                                controls
                                style={{
                                  width: "120px",
                                  height: "80px",
                                  objectFit: "cover",
                                  backgroundColor: "#000",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt="Creative"
                                onClick={() =>
                                  triggerCreativeFileInput(`${index}_main`)
                                }
                                style={{
                                  width: "120px",
                                  height: "80px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  borderRadius: "4px",
                                }}
                                onError={(e) => handleImageError(e, noImage)}
                              />
                            )
                          ) : (
                            <div
                              onClick={() =>
                                triggerCreativeFileInput(`${index}_main`)
                              }
                              style={{
                                width: "120px",
                                height: "80px",
                                border: "2px dashed #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: "4px",
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              <i
                                className={`fas ${
                                  item.type === "video"
                                    ? "fa-video"
                                    : "fa-image"
                                }`}
                                style={{ fontSize: "24px", color: "#6c757d" }}
                              ></i>
                            </div>
                          )}

                          <div className="flex-grow-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                triggerCreativeFileInput(`${index}_main`)
                              }
                              disabled={uploadingCreative[index]}
                            >
                              {uploadingCreative[index]
                                ? "Uploading..."
                                : item.url
                                  ? "Change"
                                  : "Upload"}
                            </button>
                            {item.url && (
                              <small className="d-block text-muted mt-1">
                                Click{" "}
                                {item.type === "video" ? "video" : "image"} or
                                button to change
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {item.type === "video" && (
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">Thumbnail Image</label>
                          {/* Hidden File Input for Thumbnail */}
                          <input
                            ref={(el) =>
                              (creativeFileRefs.current[`${index}_thumb`] = el)
                            }
                            type="file"
                            accept={acceptImageTypes}
                            onChange={(e) =>
                              handleCreativeThumbnailUpload(index, e)
                            }
                            style={{ display: "none" }}
                          />
                          <div className="d-flex align-items-center gap-2">
                            {item.thumbnailUrl ? (
                              <img
                                src={item.thumbnailUrl}
                                alt="Thumbnail"
                                onClick={() =>
                                  triggerCreativeFileInput(`${index}_thumb`)
                                }
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  borderRadius: "4px",
                                }}
                                onError={(e) => handleImageError(e, noImage)}
                              />
                            ) : (
                              <div
                                onClick={() =>
                                  triggerCreativeFileInput(`${index}_thumb`)
                                }
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  border: "1px dashed #ccc",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                <i
                                  className="fas fa-image"
                                  style={{ fontSize: "16px", color: "#6c757d" }}
                                ></i>
                              </div>
                            )}
                            <div className="flex-grow-1 ml-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  triggerCreativeFileInput(`${index}_thumb`)
                                }
                                disabled={uploadingCreative[`${index}_thumb`]}
                              >
                                {uploadingCreative[`${index}_thumb`] ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  "Upload"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <hr style={{ margin: "2.5rem 0" }} />

              {/* --- Steps Configuration --- */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5
                  className="mb-0 text-muted ml-0"
                  style={{
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Steps (1-3)
                </h5>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addStep}
                  disabled={config.steps.length >= 3}
                >
                  + Add Step
                </button>
              </div>

              {config.steps.map((step, index) => (
                <div
                  key={step.id || index}
                  className="card p-3 mb-3 border bg-light"
                >
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="text-secondary">Step {index + 1}</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeStep(index)}
                    >
                      <i className="ri-delete-bin-line mr-0"></i>
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="form-label">Order</label>
                        <input
                          type="number"
                          className="form-control"
                          value={step.order}
                          onChange={(e) =>
                            handleStepChange(
                              index,
                              "order",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <SunEditor
                          onKeyDown={(e) =>
                            handleKeyDown(
                              `${EDITOR_INSTANCE.STEP.title}_${index}`,
                              e,
                            )
                          }
                          onBlur={() =>
                            handleBlur(`${EDITOR_INSTANCE.STEP.title}_${index}`)
                          }
                          getSunEditorInstance={(se) => {
                            editorRefs.current[
                              `${EDITOR_INSTANCE.STEP.title}_${index}`
                            ] = se;
                          }}
                          value={step.title}
                          setContents={step.title}
                          onChange={(content) =>
                            handleStepChange(index, "title", content)
                          }
                          setOptions={editorOptions}
                          placeholder="Step Title..."
                          height="100px"
                        />
                        <ValidationNote
                          limit={MAX_LIMITS[EDITOR_INSTANCE.STEP.title]}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">Body</label>
                        <SunEditor
                          onKeyDown={(e) =>
                            handleKeyDown(
                              `${EDITOR_INSTANCE.STEP.body}_${index}`,
                              e,
                            )
                          }
                          onBlur={() =>
                            handleBlur(`${EDITOR_INSTANCE.STEP.body}_${index}`)
                          }
                          getSunEditorInstance={(se) => {
                            editorRefs.current[
                              `${EDITOR_INSTANCE.STEP.body}_${index}`
                            ] = se;
                          }}
                          value={step.body}
                          setContents={step.body}
                          onChange={(content) =>
                            handleStepChange(index, "body", content)
                          }
                          setOptions={editorOptions}
                          placeholder="Step Body..."
                          height="150px"
                        />
                        <ValidationNote
                          limit={MAX_LIMITS[EDITOR_INSTANCE.STEP.body]}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group d-flex align-items-center">
                        <Switch
                          checked={step.enabled}
                          onChange={(e) =>
                            handleStepChange(index, "enabled", e.target.checked)
                          }
                          color="primary"
                        />
                        <span className="ml-2">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <hr style={{ margin: "2.5rem 0" }} />

              {/* --- Social Links Configuration --- */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5
                  className="mb-0 text-muted ml-0"
                  style={{
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Social Links
                </h5>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addSocial}
                >
                  + Add Social Link
                </button>
              </div>

              {config.socialLinks.map((link, index) => (
                <div key={index} className="card p-3 mb-3 border bg-light">
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="text-secondary">Social Link #{index + 1}</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeSocial(index)}
                    >
                      <i className="ri-delete-bin-line mr-0"></i>
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="form-label">Order</label>
                        <input
                          type="number"
                          className="form-control"
                          value={link.order}
                          onChange={(e) =>
                            handleSocialChange(
                              index,
                              "order",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label">Platform</label>
                        <select
                          className="form-control"
                          value={link.platform}
                          onChange={(e) =>
                            handleSocialChange(
                              index,
                              "platform",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select Platform</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="youtube">YouTube</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">URL</label>
                        <input
                          type="text"
                          className="form-control"
                          value={link.url}
                          onChange={(e) =>
                            handleSocialChange(index, "url", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <hr style={{ margin: "2.5rem 0" }} />

              <div className="col-md-12">
                <div className="form-group d-flex align-items-center">
                  <Switch
                    checked={config.showUpiTags}
                    onChange={(e) => handleShowUpiTags(e.target.checked)}
                    color="primary"
                  />
                  <span className="ml-2">Show UPI Tags</span>
                </div>
              </div>

              <hr style={{ margin: "2.5rem 0" }} />

              {/* --- CTA Configuration --- */}
              <h5
                className="mb-3 text-muted ml-0"
                style={{
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                CTA Button
              </h5>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Label</label>
                    <SunEditor
                      onKeyDown={(e) =>
                        handleKeyDown(EDITOR_INSTANCE.CTA_BUTTON, e)
                      }
                      onBlur={() => handleBlur(EDITOR_INSTANCE.CTA_BUTTON)}
                      getSunEditorInstance={(se) => {
                        editorRefs.current[EDITOR_INSTANCE.CTA_BUTTON] = se;
                      }}
                      value={config.cta.label}
                      setContents={config.cta.label}
                      onChange={(content) =>
                        handleDeepChange("cta", "label", content)
                      }
                      setOptions={editorOptions}
                      placeholder="e.g., Pay Now, Start Free Trial"
                    />
                    <ValidationNote
                      limit={MAX_LIMITS[EDITOR_INSTANCE.CTA_BUTTON]}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mt-5 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ minWidth: "150px" }}
                >
                  {loading ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <PaymentScreenPreview
          config={config}
          plan={planDetails}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </div>
    </div>
  );
};

export default CustomPaymentScreen;
