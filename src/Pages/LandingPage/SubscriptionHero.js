import { useEffect, useState } from "react";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast_";
import Switch from "../../Component/molecules/Switch";
import CustomSunEditor from "../../Component/molecules/CustomSunEditor";
import Input from "../../Component/molecules/Input";
import Select from "../../Component/molecules/Select";
import ImageVideoFileUpload from "../../Component/molecules/ImageVideoFileUpload";
import { acceptImageTypes } from "../../util/contants";
import noImage from "../../Component/assets/images/noImage.png";

const SubscriptionHero = () => {
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
    });

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);

    // Configured based on user request: font size, font, bold, uppercase, text color, undo/redo
    const editorOptions = {
        buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize'],
            ['bold'],
            ['fontColor']
        ],
        height: 100,
    };

    useEffect(() => {
        fetchConfig();
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await apiInstanceFetch.get("premiumPlan");
            console.log("Fetched Plans:", res); // Debug log
            if (res.status === true || res.data?.status === true) {
                // Handle different response structures gracefully
                const plansList = res.premiumPlan || res.data?.premiumPlan || [];
                setPlans(plansList);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const fetchConfig = async () => {
        try {
            setLoading(true);
            setLoading(true);
            const res = await apiInstanceFetch.get("custom-page?type=subscription");
            if (res.status === true || res.data?.status === true) {
                const data = res.data;

                // Handle legacy data or empty arrays
                const creative = Array.isArray(data.creative) ? data.creative : [];
                const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];
                // Ensure steps have IDs for stable rendering
                const stepsRaw = Array.isArray(data.steps) ? data.steps : [];
                const steps = stepsRaw.map(s => ({ ...s, id: s.id || Math.random().toString(36).substr(2, 9) }));

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
                });
            }
        } catch (error) {
            console.error(error);
            Toast("error", "Failed to fetch config");
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

    const handleCreativeUploadSuccess = (index, { resDataUrl }) => {
        const newCreative = [...config.creative];
        newCreative[index] = {
            ...newCreative[index],
            url: resDataUrl
        };
        setConfig(prev => ({ ...prev, creative: newCreative }));
        Toast("success", "File uploaded successfully");
    };

    const handleCreativeThumbnailUploadSuccess = (index, { resDataUrl }) => {
        const newCreative = [...config.creative];
        newCreative[index] = {
            ...newCreative[index],
            thumbnailUrl: resDataUrl
        };
        setConfig(prev => ({ ...prev, creative: newCreative }));
        Toast("success", "Thumbnail uploaded successfully");
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
            Toast("error", "Max 3 steps allowed");
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
            const res = await apiInstanceFetch.patch("custom-page", config);
            if (res.status === true || res.data?.status === true) {
                Toast("success", "Configuration saved successfully");
            }
        } catch (error) {
            console.error(error);
            Toast("error", "Failed to save configuration");
        } finally {
            setLoading(false);
        }
    };



    if (loading && !config.mainHeading) { // Initial loading
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
        <div id="content-page" className="content-page">
            <div className="container-fluid">
                <div className="header_heading p_zero">
                    <h3>Subscription Hero Configuration</h3>
                </div>

                <div className="iq-card mb-5">
                    <div className="iq-card-body">
                        <form onSubmit={handleSubmit}>

                            {/* --- Text Configuration --- */}
                            <h5 className="mb-3 text-muted" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Text Configuration</h5>
                            <div className="row">
                                <CustomSunEditor
                                    label="Main Heading"
                                    value={config.mainHeading}
                                    onChange={(content) => handleTextChange("mainHeading", content)}
                                    setOptions={editorOptions}
                                    placeholder="Enter Main Heading..."
                                    className="col-md-6 mb-4"
                                />
                                <CustomSunEditor
                                    label="Secondary Heading"
                                    value={config.secondaryHeading}
                                    onChange={(content) => handleTextChange("secondaryHeading", content)}
                                    setOptions={editorOptions}
                                    placeholder="Enter Secondary Heading..."
                                    className="col-md-6 mb-4"
                                />
                                <CustomSunEditor
                                    label="Footer Text"
                                    value={config.footerText}
                                    onChange={(content) => handleTextChange("footerText", content)}
                                    setOptions={editorOptions}
                                    placeholder="Footer Text..."
                                    className="col-md-6 mb-4"
                                />
                                <CustomSunEditor
                                    label="Disclaimer Text"
                                    value={config.disclaimerText}
                                    onChange={(content) => handleTextChange("disclaimerText", content)}
                                    setOptions={{ ...editorOptions, buttonList: [...editorOptions.buttonList, ['link', 'underline']] }}
                                    placeholder="Disclaimer Text..."
                                    className="col-md-6 mb-4"
                                />
                            </div>

                            <hr style={{ margin: '2.5rem 0' }} />

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 text-muted" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Creatives</h5>
                                <button type="button" className="btn btn-primary btn-sm" onClick={addCreative}>
                                    + Add Creative
                                </button>
                            </div>

                            {config.creative.map((item, index) => (
                                <div key={index} className="card p-3 mb-3 border bg-light">
                                    <div className="d-flex justify-content-between mb-2">
                                        <h6 className="text-secondary">Creative #{index + 1}</h6>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeCreative(index)}>
                                            <i className="ri-delete-bin-line mr-0"></i>
                                        </button>
                                    </div>
                                    <div className="row">
                                        <Input
                                            label="Order"
                                            type="number"
                                            value={item.order}
                                            onChange={(e) => handleCreativeChange(index, "order", parseInt(e.target.value))}
                                            className="col-md-3"
                                        />
                                        <Select
                                            label="Type"
                                            value={item.type}
                                            options={[
                                                { value: "image", label: "Image" },
                                                { value: "video", label: "Video" }
                                            ]}
                                            onChange={(e) => handleCreativeChange(index, "type", e.target.value)}
                                            className="col-md-3"
                                        />
                                        <ImageVideoFileUpload
                                            label={item.type === 'video' ? 'Video' : 'Image'}
                                            imagePath={item.url}
                                            onUploadSuccess={(data) => handleCreativeUploadSuccess(index, data)}
                                            accept={item.type === 'video' ? "video/*" : acceptImageTypes}
                                            folderStructure="subscriptionPage"
                                            fallbackImage={noImage}
                                            className="col-md-3"
                                            variant="advanced"
                                            imgStyle={{ width: "120px", height: "80px" }}
                                        />
                                        {item.type === 'video' && (
                                            <ImageVideoFileUpload
                                                label="Thumbnail"
                                                imagePath={item.thumbnailUrl}
                                                onUploadSuccess={(data) => handleCreativeThumbnailUploadSuccess(index, data)}
                                                folderStructure="subscriptionPage"
                                                fallbackImage={noImage}
                                                className="col-md-3"
                                                variant="advanced"
                                                imgStyle={{ width: "120px", height: "80px" }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            <hr style={{ margin: '2.5rem 0' }} />

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 text-muted" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Steps (1-3)</h5>
                                <button type="button" className="btn btn-primary btn-sm" onClick={addStep} disabled={config.steps.length >= 3}>
                                    + Add Step
                                </button>
                            </div>

                            {config.steps.map((step, index) => (
                                <div key={step.id || index} className="card p-3 mb-3 border bg-light">
                                    <div className="d-flex justify-content-between mb-2">
                                        <h6 className="text-secondary">Step {index + 1}</h6>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeStep(index)}>
                                            <i className="ri-delete-bin-line mr-0"></i>
                                        </button>
                                    </div>
                                    <div className="row">
                                        <Input
                                            label="Order"
                                            type="number"
                                            value={step.order}
                                            onChange={(e) => handleStepChange(index, "order", parseInt(e.target.value))}
                                            className="col-md-2"
                                        />
                                        <CustomSunEditor
                                            label="Title"
                                            value={step.title}
                                            onChange={(content) => handleStepChange(index, "title", content)}
                                            setOptions={editorOptions}
                                            placeholder="Step Title..."
                                            height={100}
                                            className="col-md-5"
                                        />
                                        <CustomSunEditor
                                            label="Body"
                                            value={step.body}
                                            onChange={(content) => handleStepChange(index, "body", content)}
                                            setOptions={editorOptions}
                                            placeholder="Step Body..."
                                            height={150}
                                            className="col-md-5"
                                        />
                                        <div className="col-md-12">
                                            <Switch
                                                label="Enabled"
                                                checked={step.enabled}
                                                onChange={(e) => handleStepChange(index, "enabled", e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <hr style={{ margin: '2.5rem 0' }} />

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 text-muted" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Social Links</h5>
                                <button type="button" className="btn btn-primary btn-sm" onClick={addSocial}>
                                    + Add Social Link
                                </button>
                            </div>

                            {config.socialLinks.map((link, index) => (
                                <div key={index} className="card p-3 mb-3 border bg-light">
                                    <div className="d-flex justify-content-between mb-2">
                                        <h6 className="text-secondary">Social Link #{index + 1}</h6>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSocial(index)}>
                                            <i className="ri-delete-bin-line mr-0"></i>
                                        </button>
                                    </div>
                                    <div className="row">
                                        <Input
                                            label="Order"
                                            type="number"
                                            value={link.order}
                                            onChange={(e) => handleSocialChange(index, "order", parseInt(e.target.value))}
                                            className="col-md-2"
                                        />
                                        <Select
                                            label="Platform"
                                            value={link.platform}
                                            options={[
                                                { value: "facebook", label: "Facebook" },
                                                { value: "instagram", label: "Instagram" },
                                                { value: "youtube", label: "YouTube" }
                                            ]}
                                            onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                                            className="col-md-4"
                                        />
                                        <Input
                                            label="URL"
                                            value={link.url}
                                            onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                                            className="col-md-6"
                                        />
                                    </div>
                                </div>
                            ))}

                            <hr style={{ margin: '2.5rem 0' }} />

                            <h5 className="mb-3 text-muted" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Subscription Plan</h5>
                            <div className="row mb-4">
                                <Select
                                    label="Default Selected Plan"
                                    value={config.selectedPlanId}
                                    options={plans.map(plan => ({
                                        value: plan._id,
                                        label: `${plan.name} - ${plan.validity} ${plan.validityType} (${plan.price})`
                                    }))}
                                    onChange={(e) => setConfig({ ...config, selectedPlanId: e.target.value })}
                                    placeholder="-- Select a Plan --"
                                    className="col-md-6"
                                />
                                <div className="col-md-6 align-self-center mt-4">
                                    <small className="form-text text-muted">
                                        This plan will be pre-selected/highlighted on the subscription page.
                                    </small>
                                </div>
                            </div>

                            <hr style={{ margin: '2.5rem 0' }} />

                            <h5 className="mb-3 text-muted" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>CTA Button</h5>
                            <div className="row">
                                <Input
                                    label="Label"
                                    value={config.cta.label}
                                    onChange={(e) => handleDeepChange("cta", "label", e.target.value)}
                                    placeholder="e.g., Pay Now, Start Free Trial"
                                    className="col-md-12"
                                />
                            </div>

                            <div className="form-group mt-5 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '150px' }}>
                                    {loading ? "Saving..." : "Save Configuration"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHero;
