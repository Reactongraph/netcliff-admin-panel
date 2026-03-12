import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Toast } from "../../util/Toast_";
import { apiInstanceFetch } from "../../util/api";
import { projectName } from "../../util/config";
import { acceptImageTypes, bannerTypes } from "../../util/contants";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import Input from "../molecules/Input";
import Select from "../molecules/Select";

const BannerForm = () => {
  const history = useHistory();
  const { bannerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    type: "auth",
    order: 0
  });
  const [imagePath, setImagePath] = useState("");
  const [resURL, setResURL] = useState("");
  const [error, setError] = useState({});

  useEffect(() => {
    if (bannerId) {
      fetchBanner();
    }
  }, [bannerId]);

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // This will show a confirmation dialog if user tries to leave with unsaved changes
      if (formData.image || formData.type !== "auth" || formData.order !== 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  const handleImageSuccess = ({ resDataUrl, imageURL }) => {
    setResURL(resDataUrl);
    setImagePath(imageURL);
    setFormData(prev => ({
      ...prev,
      image: resDataUrl
    }));
    setError(prev => ({
      ...prev,
      image: null,
    }));
  };

  const handleImageError = (err) => {
    setError(prev => ({
      ...prev,
      image: "Failed to upload image. Please try again.",
    }));
  };

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await apiInstanceFetch.get(`banner/${bannerId}`);

      if (response.status) {
        setFormData({
          image: response.banner.image || "",
          type: response.banner.type || "auth",
          order: response.banner.order || 0
        });
        setImagePath(response.banner.image || "");
        setResURL(response.banner.image || "");
      } else {
        Toast("error", response.message || "Failed to fetch banner");
        history.push("/admin/banners");
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      Toast("error", "Failed to fetch banner");
      history.push("/admin/banners");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "order") {
      finalValue = value === "" ? 0 : parseInt(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    if (!finalValue && name !== "order") {
      setError(prev => ({ ...prev, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is Required!` }));
    } else {
      setError(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image.trim()) {
      setError(prev => ({
        ...prev,
        image: "Image is required"
      }));
      return;
    }

    try {
      setLoading(true);

      const url = bannerId
        ? `banner/${bannerId}`
        : `banner`;

      const method = bannerId ? "put" : "post";

      const response = await apiInstanceFetch[method](url, formData);

      if (response.status) {
        Toast("success", bannerId ? "Banner updated successfully ✔" : "Banner created successfully ✔");
        history.push("/admin/banners");
      } else {
        Toast("error", response.message || "Failed to save banner");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      Toast("error", "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push("/admin/banners");
  };

  if (loading && bannerId) {
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
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="header_heading p_zero">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link p-0 mr-3"
                  onClick={handleCancel}
                  style={{ color: "#666", textDecoration: "none" }}
                >
                  <i className="ri-arrow-left-line" style={{ fontSize: "20px" }}></i>
                </button>
                <h3 className="mb-0">{bannerId ? "Edit Banner" : "Create New Banner"}</h3>
              </div>
            </div>
          </div>

          <div className="iq-card mb-5">
            <div className="iq-card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <Select
                    label="Banner Type"
                    name="type"
                    value={formData.type}
                    options={bannerTypes}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Order"
                    type="number"
                    name="order"
                    value={formData.order}
                    placeholder="Enter display order"
                    onChange={handleInputChange}
                    min="0"
                    required
                    error={error.order}
                  />
                </div>

                <ImageVideoFileUpload
                  label="Banner Image"
                  required
                  imagePath={imagePath}
                  error={error.image}
                  folderStructure={projectName + "/bannerImage"}
                  onUploadSuccess={handleImageSuccess}
                  onUploadError={handleImageError}
                  accept={acceptImageTypes}
                  variant="advanced"
                />

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        {bannerId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {bannerId ? "Update Banner" : "Create Banner"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerForm; 