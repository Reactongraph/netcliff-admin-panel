import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { apiInstanceFetch } from "../../util/api";
import Input from "../molecules/Input";
import ImageVideoFileUpload from "../molecules/ImageVideoFileUpload";
import { projectName } from "../../util/config";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BrandIntegrationDialog = ({ open, onClose, onSuccess, brandIntegrationData }) => {
  const isEditMode = !!brandIntegrationData;

  // Brand Integration basic info
  const [brandId, setBrandId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignURL, setCampaignURL] = useState(""); // New field
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [priority, setPriority] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isActive, setIsActive] = useState(true);
  
  // User Category (Subscription Filter) - NEW FIELD
  const [userCategory, setUserCategory] = useState(["FREE", "FREE-TRAIL", "PREMIUM"]); // Default: all selected

  // Placements array (max 3 items) - now with multiple targets per placement
  const [placements, setPlacements] = useState([
    {
      type: "ASTON",
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
      displayDurationSec: 5,
      target: [], // Array of { level: "SERIES", refId: id, episodes?: "all"|[ids], allLiveSeries?: boolean }
    },
  ]);

  // Series list for dropdown
  const [movieList, setMovieList] = useState([]);
  
  // Episodes list for each series (keyed by seriesId)
  const [episodesMap, setEpisodesMap] = useState({});
  const [episodesLoading, setEpisodesLoading] = useState({});
  
  // Brand list for creatable select
  const [brandList, setBrandList] = useState([]);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  
  // Rich text editor refs for each placement description
  const descriptionEditorRefs = useRef({});

  // Fetch series list, brand list, and load data for edit mode
  useEffect(() => {
    const initializeDialog = async () => {
      if (open) {
        console.log("Dialog opened, fetching series and brand lists");
        
        // Fetch lists first
        await Promise.all([
          fetchMovieList(),
          fetchBrandList()
        ]);
        
        // Then load brand integration data for edit mode (after lists are ready)
        if (isEditMode && brandIntegrationData) {
          console.log("Lists loaded, now loading brand integration data");
          await loadBrandIntegrationData();
        }
      }
    };
    
    initializeDialog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEditMode]);

  const resetForm = () => {
    setBrandId("");
    setCampaignName("");
    setCampaignURL("");
    setBrandLogoUrl("");
    setPriority(0);
    setStartDate(null);
    setEndDate(null);
    setIsActive(true);
    setUserCategory(["FREE", "FREE-TRAIL", "PREMIUM"]); // Reset to all selected
    setShowBrandInput(false);
    setNewBrandName("");
    setEpisodesMap({});
    setEpisodesLoading({});
    setPlacements([
      {
        type: "ASTON",
        title: "",
        subtitle: "",
        description: "",
        ctaText: "",
        displayDurationSec: 5,
        target: [],
      },
    ]);
    setErrors({});
    setSubmitting(false);
    descriptionEditorRefs.current = {};
  };


  const loadBrandIntegrationData = async () => {
    try {
      console.log("=== LOADING BRAND INTEGRATION DATA ===");
      console.log("Raw brandIntegrationData:", JSON.stringify(brandIntegrationData, null, 2));
      
      // Reset form first to clear any stale state
      console.log("Resetting form before loading edit data");

      // Pre-fill form with brand integration data
      // Handle brandId - it could be a string ID or an object with _id
      const extractedBrandId = typeof brandIntegrationData.brandId === 'object' && brandIntegrationData.brandId?._id
        ? brandIntegrationData.brandId._id
        : brandIntegrationData.brandId || "";
      console.log("Extracted brandId:", extractedBrandId);
      setBrandId(extractedBrandId);
      
      setCampaignName(brandIntegrationData.campaignName || "");
      setCampaignURL(brandIntegrationData.campaignURL || "");
      setBrandLogoUrl(brandIntegrationData.brandLogoUrl || "");
      setPriority(brandIntegrationData.priority !== undefined ? brandIntegrationData.priority : 0);
      setIsActive(brandIntegrationData.isActive !== undefined ? brandIntegrationData.isActive : true);
      
      // Set userCategory - default to all if not present (backward compatibility)
      setUserCategory(
        brandIntegrationData.userCategory && Array.isArray(brandIntegrationData.userCategory) && brandIntegrationData.userCategory.length > 0
          ? brandIntegrationData.userCategory
          : ["FREE", "FREE-TRAIL", "PREMIUM"]
      );

      // Format dates for DatePicker (Date objects)
      if (brandIntegrationData.startDate) {
        setStartDate(new Date(brandIntegrationData.startDate));
      }
      if (brandIntegrationData.endDate) {
        setEndDate(new Date(brandIntegrationData.endDate));
      }

      // Set placements (now with target array at placement level)
      if (brandIntegrationData.placements && brandIntegrationData.placements.length > 0) {
        console.log("=== PROCESSING PLACEMENTS ===");
        console.log("Number of placements:", brandIntegrationData.placements.length);
        console.log("Raw placements data:", JSON.stringify(brandIntegrationData.placements, null, 2));
        
        const placementsWithTargets = brandIntegrationData.placements.map(p => ({
          type: p.type || "",
          title: p.title || "",
          subtitle: p.subtitle || "",
          description: p.description || "",
          ctaText: p.ctaText || "",
          displayDurationSec: p.displayDurationSec || 5,
          target: Array.isArray(p.target) ? p.target : [], // Ensure target array exists
          _id: p._id, // Preserve ID if it exists
        }));
        
        console.log("Processed placements with targets:", JSON.stringify(placementsWithTargets, null, 2));
        
        // Fetch episodes for all series in target FIRST (skip if allLiveSeries is true)
        const allSeriesIds = new Set();
        placementsWithTargets.forEach(placement => {
          placement.target.forEach(targetItem => {
            if (targetItem.level === "SERIES" && targetItem.refId && !targetItem.allLiveSeries) {
              allSeriesIds.add(targetItem.refId);
            }
          });
        });
        
        console.log("Series IDs to fetch episodes for:", Array.from(allSeriesIds));
        
        // Fetch episodes for each series BEFORE setting placements
        for (const seriesId of allSeriesIds) {
          console.log(`Fetching episodes for series ${seriesId}...`);
          await fetchEpisodesForSeries(seriesId);
        }
        
        console.log("=== ALL EPISODES FETCHED, NOW SETTING PLACEMENTS ===");
        console.log("Final placements to set:", JSON.stringify(placementsWithTargets, null, 2));
        
        // NOW set placements after episodes are fetched
        setPlacements(placementsWithTargets);
        setEditorKey(prev => prev + 1);
        
        console.log("✅ Placements state updated");
      } else {
        console.warn("⚠️ No placements found in brandIntegrationData");
      }
    } catch (error) {
      console.error("Error loading brand integration data:", error);
      toast.error("Failed to load brand integration data");
    }
  };

  const fetchMovieList = async () => {
    try {
      const limit = 100; // Fetch top 100 series
      
      // Use the same API pattern as WidgetSeriesManager for consistency
      const response = await apiInstanceFetch.get(
        `movie/all?type=WEBSERIES&start=1&limit=${limit}&search=&featured=false&newReleased=false&status=PUBLISHED`
      );

      console.log("Series API Response:", response);

      if (response.status && response.movie) {
        const movieOptions = response.movie.map((movie) => ({
          value: movie._id,
          label: movie.title,
        }));
        console.log("Series dropdown options:", movieOptions);
        setMovieList(movieOptions);
      } else {
        console.warn("No series found in response", response);
        setMovieList([]);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
      toast.error("Failed to fetch series list");
      setMovieList([]);
    }
  };

  const fetchEpisodesForSeries = async (seriesId) => {
    if (!seriesId) return;
    
    // Set loading state
    setEpisodesLoading(prev => ({ ...prev, [seriesId]: true }));
    
    try {
      // Use the admin API endpoint (not Android) - it uses admin authentication
      // "AllSeasonGet" fetches all episodes from all seasons
      const response = await apiInstanceFetch.get(
        `episode/seasonWiseEpisode?movieId=${seriesId}&seasonId=AllSeasonGet`
      );
      
      console.log(`Episodes API response for series ${seriesId}:`, response);
      
      if (response.status && response.episode) {
        const episodeOptions = response.episode.map((episode) => ({
          value: episode._id,
          label: `${episode.episodeName || episode.name || `Episode ${episode.episodeNumber || ''}`}`,
          episodeNumber: episode.episodeNumber,
          seasonNumber: episode.seasonNumber,
        }));
        
        console.log(`✅ Mapped ${episodeOptions.length} episodes for series ${seriesId}`, episodeOptions);
        
        // Store in episodesMap keyed by seriesId
        setEpisodesMap(prev => ({
          ...prev,
          [seriesId]: episodeOptions
        }));
      } else {
        console.warn(`⚠️ No episodes found for series ${seriesId}`, response);
        setEpisodesMap(prev => ({
          ...prev,
          [seriesId]: []
        }));
      }
    } catch (error) {
      console.error(`❌ Error fetching episodes for series ${seriesId}:`, error);
      toast.error(`Failed to fetch episodes for selected series`);
      setEpisodesMap(prev => ({
        ...prev,
        [seriesId]: []
      }));
    } finally {
      // Clear loading state
      setEpisodesLoading(prev => ({ ...prev, [seriesId]: false }));
    }
  };

  const fetchBrandList = async (searchTerm = "") => {
    try {
      const response = await apiInstanceFetch.get(
        `brand?page=1&limit=50&search=${searchTerm}`
      );

      console.log("Brand API Response:", response);

      if (response.status && response.brands) {
        const brandOptions = response.brands.map((brand) => ({
          value: brand._id, // MongoDB ObjectId
          label: brand.brandName,
          logoUrl: brand.brandLogoUrl,
        }));
        console.log("Brand dropdown options:", brandOptions);
        setBrandList(brandOptions);
      } else {
        console.warn("No brands found in response", response);
        setBrandList([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands list");
      setBrandList([]);
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error("Brand name cannot be empty");
      return;
    }

    try {
      setCreatingBrand(true);
      
      const payload = {
        brandName: newBrandName.trim(),
        brandLogoUrl: null, // Optional
      };

      console.log("Creating new brand:", payload);

      const response = await apiInstanceFetch.post("brand", payload);

      if (response.status && response.brand) {
        toast.success("Brand created successfully");
        await fetchBrandList(); // Refresh brand list
        setBrandId(response.brand._id); // Set the new brand's MongoDB ObjectId
        setShowBrandInput(false); // Hide input
        setNewBrandName(""); // Clear input
      } else {
        toast.error(response.message || "Failed to create brand");
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to create brand";
      toast.error(errorMessage);
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleCancelBrandCreation = () => {
    setShowBrandInput(false);
    setNewBrandName("");
    setBrandId(""); // Reset to empty
  };

  const handleAddPlacement = () => {
    if (placements.length >= 3) {
      toast.warning("Maximum 3 placements allowed");
      return;
    }

    // Suggest a different type from existing placements
    const usedTypes = new Set(placements.map(p => p.type).filter(Boolean));
    const availableTypes = ["PRODUCT_POPUP", "QUIZ", "ASTON", "BANNER"];
    const suggestedType = availableTypes.find(type => !usedTypes.has(type)) || "";

    setPlacements([
      ...placements,
      {
        type: suggestedType,
        title: "",
        subtitle: "",
        description: "",
        ctaText: "",
        displayDurationSec: 5,
        target: [], // Array of targets
      },
    ]);
  };

  const handleRemovePlacement = (index) => {
    if (placements.length === 1) {
      toast.warning("At least one placement is required");
      return;
    }

    const newPlacements = placements.filter((_, i) => i !== index);
    setPlacements(newPlacements);
  };

  // Target management functions
  const handleAddTargetToPlacement = (placementIndex) => {
    const newPlacements = [...placements];
    newPlacements[placementIndex].target.push({
      level: "SERIES",
      refId: "",
      episodes: "all", // Default to "all" episodes
      allLiveSeries: false, // Default to false - specific series
    });
    setPlacements(newPlacements);
  };

  const handleRemoveTargetFromPlacement = (placementIndex, targetIndex) => {
    const newPlacements = [...placements];
    newPlacements[placementIndex].target = newPlacements[placementIndex].target.filter((_, i) => i !== targetIndex);
    setPlacements(newPlacements);
  };

  const handleTargetSeriesChange = async (placementIndex, targetIndex, seriesId) => {
    console.log(`Series changed: placementIndex=${placementIndex}, targetIndex=${targetIndex}, seriesId=${seriesId}`);
    
    const newPlacements = [...placements];
    newPlacements[placementIndex].target[targetIndex].refId = seriesId;
    newPlacements[placementIndex].target[targetIndex].episodes = "all"; // Reset to "all" when series changes
    setPlacements(newPlacements);
    
    // Fetch episodes for this series if not already fetched (and if not allLiveSeries)
    const targetItem = newPlacements[placementIndex].target[targetIndex];
    if (seriesId && !targetItem.allLiveSeries && !episodesMap[seriesId]) {
      console.log(`Fetching episodes for series ${seriesId}...`);
      await fetchEpisodesForSeries(seriesId);
    } else if (seriesId && episodesMap[seriesId]) {
      console.log(`Episodes already cached for series ${seriesId}:`, episodesMap[seriesId].length);
    }
  };

  const handleAllLiveSeriesToggle = (placementIndex, targetIndex, checked) => {
    const newPlacements = [...placements];
    newPlacements[placementIndex].target[targetIndex].allLiveSeries = checked;
    
    if (checked) {
      // When "All Live Series" is checked, clear refId and episodes
      newPlacements[placementIndex].target[targetIndex].refId = "";
      newPlacements[placementIndex].target[targetIndex].episodes = "all";
    }
    
    setPlacements(newPlacements);
  };

  const handleTargetEpisodesChange = (placementIndex, targetIndex, episodesValue) => {
    const newPlacements = [...placements];
    newPlacements[placementIndex].target[targetIndex].episodes = episodesValue;
    setPlacements(newPlacements);
  };

  const handleEpisodeCheckboxToggle = (placementIndex, targetIndex, episodeId, isChecked) => {
    const newPlacements = [...placements];
    const currentEpisodes = newPlacements[placementIndex].target[targetIndex].episodes;
    
    if (!Array.isArray(currentEpisodes)) {
      // If not array (e.g., "all"), convert to array first
      newPlacements[placementIndex].target[targetIndex].episodes = isChecked ? [episodeId] : [];
    } else {
      newPlacements[placementIndex].target[targetIndex].episodes = isChecked
        ? [...currentEpisodes, episodeId]
        : currentEpisodes.filter(id => id !== episodeId);
    }
    
    setPlacements(newPlacements);
  };

  const handleUserCategoryToggle = (category) => {
    setUserCategory(prev => {
      if (prev.includes(category)) {
        // Remove category (but don't allow removing all)
        const newCategories = prev.filter(c => c !== category);
        return newCategories.length > 0 ? newCategories : prev;
      } else {
        // Add category
        return [...prev, category];
      }
    });
    // Clear error if exists
    setErrors({ ...errors, userCategory: "" });
  };

  const handlePlacementChange = (index, field, value) => {
    setPlacements((prevPlacements) => {
      const newPlacements = [...prevPlacements];
      newPlacements[index] = { ...newPlacements[index], [field]: value };
      return newPlacements;
    });
    
    // Clear errors for this field
    const errorKey = `placements[${index}].${field}`;
    setErrors((prevErrors) => {
      if (prevErrors[errorKey]) {
        return { ...prevErrors, [errorKey]: "" };
      }
      return prevErrors;
    });

    // Real-time validation for unique type
    if (field === "type" && value) {
      // Create a temporary copy for validation using the current closure's placements
      // This is safe for "type" changes as they come from controlled Select inputs
      const newPlacements = [...placements];
      newPlacements[index] = { ...newPlacements[index], [field]: value };
      validateUniqueTypes(newPlacements);
    }
  };

  const validateUniqueTypes = (placementsToValidate) => {
    const types = placementsToValidate.map(p => p.type).filter(Boolean);
    const uniqueTypes = new Set(types);
    
    if (types.length !== uniqueTypes.size) {
      // Find duplicate types
      const typeCount = {};
      types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      const newErrors = { ...errors };
      placementsToValidate.forEach((placement, index) => {
        if (placement.type && typeCount[placement.type] > 1) {
          newErrors[`placements[${index}].type`] = "Type must be unique";
        } else {
          delete newErrors[`placements[${index}].type`];
        }
      });
      
      setErrors(newErrors);
      return false;
    } else {
      // Clear all type errors
      const newErrors = { ...errors };
      placementsToValidate.forEach((_, index) => {
        delete newErrors[`placements[${index}].type`];
      });
      setErrors(newErrors);
      return true;
    }
  };


  const validateForm = () => {
    const newErrors = {};

    // Basic fields validation
    if (!brandId || !brandId.trim()) {
      newErrors.brandId = "Brand selection is required";
    }
    if (!campaignName || !campaignName.trim()) {
      newErrors.campaignName = "Campaign Name is required";
    }
    if (!campaignURL || !campaignURL.trim()) {
      newErrors.campaignURL = "Campaign URL is required";
    } else if (campaignURL.trim() && !isValidURL(campaignURL.trim())) {
      newErrors.campaignURL = "Please enter a valid URL";
    }
    if (!brandLogoUrl || !brandLogoUrl.trim()) {
      newErrors.brandLogoUrl = "Brand logo is required";
    } else if (brandLogoUrl.trim() && !isValidURL(brandLogoUrl.trim())) {
      newErrors.brandLogoUrl = "Please enter a valid URL for brand logo";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
    }
    if (startDate && endDate && endDate <= startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    if (priority < 0) {
      newErrors.priority = "Priority must be 0 or greater";
    }
    
    // User Category validation - at least one must be selected
    if (!userCategory || !Array.isArray(userCategory) || userCategory.length === 0) {
      newErrors.userCategory = "At least one user category must be selected";
    }

    // Placements must exist
    if (!placements || placements.length === 0) {
      newErrors.placements = "At least one placement is required";
    }

    // Unique type validation - each placement type must be unique
    if (!validateUniqueTypes(placements)) {
      toast.error("Each placement must have a unique type");
    }

    // Placements validation
    placements.forEach((placement, index) => {
      // Type validation
      if (!placement.type || !placement.type.trim()) {
        newErrors[`placements[${index}].type`] = "Type is required";
      }

      // Target validation for each placement (now multiple targets)
      if (!placement.target || placement.target.length === 0) {
        newErrors[`placements[${index}].target`] = "At least one target is required";
      } else {
        // Validate each target
        placement.target.forEach((targetItem, targetIndex) => {
          if (!targetItem.level) {
            newErrors[`placements[${index}].target[${targetIndex}].level`] = "Target level is required";
          }
          
          // If allLiveSeries is true, refId is not required
          // If allLiveSeries is false or undefined, refId is required
          if (!targetItem.allLiveSeries && (!targetItem.refId || !targetItem.refId.trim())) {
            newErrors[`placements[${index}].target[${targetIndex}].refId`] = "Target selection is required (or enable 'All Live Series')";
          }
        });
      }

      // Title validation (max 20 characters)
      if (!placement.title || !placement.title.trim()) {
        newErrors[`placements[${index}].title`] = "Title is required";
      } else if (placement.title.length > 20) {
        newErrors[`placements[${index}].title`] = "Title must be max 20 characters";
      }

      // Subtitle validation (max 25 characters)
      if (!placement.subtitle || !placement.subtitle.trim()) {
        newErrors[`placements[${index}].subtitle`] = "Subtitle is required";
      } else if (placement.subtitle.length > 25) {
        newErrors[`placements[${index}].subtitle`] = "Subtitle must be max 25 characters";
      }

      // Description validation (required, no max length)
      if (!placement.description || !placement.description.trim()) {
        newErrors[`placements[${index}].description`] = "Description is required";
      }

      if (!placement.ctaText || !placement.ctaText.trim()) {
        newErrors[`placements[${index}].ctaText`] = "CTA text is required";
      }
      if (!placement.displayDurationSec || placement.displayDurationSec < 1) {
        newErrors[`placements[${index}].displayDurationSec`] = "Display duration must be at least 1 second";
      } else if (placement.displayDurationSec > 5) {
        newErrors[`placements[${index}].displayDurationSec`] = "Display duration must not exceed 5 seconds";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    console.log("=== SUBMIT BUTTON CLICKED ===");
    console.log("Raw Form State Before Validation:");
    console.log("brandId:", `"${brandId}"`, "type:", typeof brandId);
    console.log("campaignName:", `"${campaignName}"`, "type:", typeof campaignName);
    console.log("campaignURL:", `"${campaignURL}"`, "type:", typeof campaignURL);
    console.log("brandLogoUrl:", `"${brandLogoUrl}"`, "type:", typeof brandLogoUrl);
    console.log("priority:", priority, "type:", typeof priority);
    console.log("userCategory:", userCategory, "type:", typeof userCategory); // NEW
    console.log("startDate:", `"${startDate}"`);
    console.log("endDate:", `"${endDate}"`);
    console.log("isActive:", isActive);
    console.log("placements count:", placements.length);
    console.log("placements:", JSON.stringify(placements, null, 2));

    if (!validateForm()) {
      console.error("❌ Validation failed!");
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("✅ Validation passed!");

    try {
      setSubmitting(true);

      // Ensure all values are properly set (not undefined)
      const payload = {
        brandId: String(brandId || "").trim(),
        campaignName: (campaignName || "").trim(),
        campaignURL: (campaignURL || "").trim(),
        brandLogoUrl: brandLogoUrl && brandLogoUrl.trim() ? brandLogoUrl.trim() : null,
        priority: parseInt(priority) >= 0 ? parseInt(priority) : 0,
        isActive: Boolean(isActive),
        userCategory: Array.isArray(userCategory) && userCategory.length > 0 ? userCategory : ["FREE", "FREE-TRAIL", "PREMIUM"], // NEW FIELD
        startDate: startDate ? startDate.toISOString() : new Date().toISOString(),
        endDate: endDate ? endDate.toISOString() : new Date().toISOString(),
        placements: (placements || []).map((placement) => {
          const placementPayload = {
            type: (placement.type || "PRODUCT_POPUP").trim(),
            title: (placement.title || "").trim(),
            subtitle: (placement.subtitle || "").trim(),
            description: (placement.description || "").trim(),
            ctaText: (placement.ctaText || "").trim(),
            displayDurationSec: parseInt(placement.displayDurationSec) >= 1 ? parseInt(placement.displayDurationSec) : 5,
            target: (placement.target || []).map((targetItem) => {
              const targetPayload = {
                level: targetItem.level || "SERIES",
              };
              
              // If allLiveSeries is true, don't send refId (it will be handled by backend)
              if (targetItem.allLiveSeries) {
                targetPayload.allLiveSeries = true;
                // Don't include refId when allLiveSeries is true
              } else {
                // Include refId for specific series/episode
                targetPayload.refId = (targetItem.refId || "").trim();
                
                // Add episodes field only for SERIES level
                if (targetItem.level === "SERIES") {
                  // episodes can be "all" or array of episode IDs
                  if (targetItem.episodes === "all" || targetItem.episodes === "ALL") {
                    targetPayload.episodes = "all";
                  } else if (Array.isArray(targetItem.episodes) && targetItem.episodes.length > 0) {
                    targetPayload.episodes = targetItem.episodes;
                  } else {
                    // Default to "all" if not specified for SERIES
                    targetPayload.episodes = "all";
                  }
                }
                // For EPISODE level, no episodes field
              }
              
              return targetPayload;
            }),
          };
          
          return placementPayload;
        }),
      };

      const url = isEditMode
        ? `brand-integration/${brandIntegrationData._id}`
        : "brand-integration";

      const method = isEditMode ? "put" : "post";

      const response = await apiInstanceFetch[method](url, payload);

      if (response.status) {
        toast.success(
          isEditMode
            ? "Brand integration updated successfully ✔"
            : "Brand integration created successfully ✔"
        );
        onSuccess();
      } else {
        toast.error(response.message || `Failed to ${isEditMode ? "update" : "create"} brand integration`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} brand integration:`, error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${isEditMode ? "update" : "create"} brand integration`;

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm(); // Reset form state before closing
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="responsive-dialog-title">
        <h5>{isEditMode ? "Edit Brand Integration" : "Create Brand Integration"}</h5>
      </DialogTitle>

      <Tooltip title="Close">
        <CancelIcon
          className="cancelButton"
          sx={{
            position: "absolute",
            top: "23px",
            right: "15px",
            color: "#fff",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
          onClick={handleClose}
        />
      </Tooltip>

      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <div className="d-flex flex-column">
            <form>
              {/* Section 1: Basic Brand Info */}
              <div className="form-group">
                <h6 className="text-white mb-3">Campaign Information</h6>
                <div className="row">
                  {/* Brand - Creatable Select */}
                  <div className="col-md-6 my-2 styleForTitle">
                    <label>Brand * <span className="text-muted" style={{ fontSize: "12px" }}>(Select or create new)</span></label>
                    
                    {!showBrandInput ? (
                      <div>
                        <select
                          name="brandId"
                          className="form-control form-control-line"
                          value={brandId}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "__CREATE_NEW__") {
                              setShowBrandInput(true);
                              setBrandId("");
                            } else {
                              setBrandId(value);
                              setErrors({ ...errors, brandId: "" });
                            }
                          }}
                          required
                          disabled={creatingBrand}
                        >
                          <option value="">
                            {creatingBrand
                              ? "Creating brand..."
                              : brandList.length === 0
                              ? "Loading brands..."
                              : "Select or Create Brand"}
                          </option>
                          {brandList.map((brand) => (
                            <option key={brand.value} value={brand.value}>
                              {brand.label}
                            </option>
                          ))}
                          <option value="__CREATE_NEW__" style={{ fontWeight: "bold", color: "#28a745" }}>
                            ➕ Create New Brand
                          </option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <input
                            type="text"
                            className="form-control form-control-line"
                            placeholder="Enter new brand name..."
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateBrand();
                              }
                            }}
                            disabled={creatingBrand}
                            autoFocus
                          />
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={handleCreateBrand}
                            disabled={creatingBrand || !newBrandName.trim()}
                          >
                            {creatingBrand ? (
                              <>
                                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                Creating...
                              </>
                            ) : (
                              <>
                                <i className="ri-check-line"></i> Create
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary ml-2"
                            onClick={handleCancelBrandCreation}
                            disabled={creatingBrand}
                          >
                            <i className="ri-close-line"></i> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {errors.brandId && (
                      <div className="pl-1 text-left">
                        <span className="error">{errors.brandId}</span>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Campaign Name"
                    type="text"
                    name="campaignName"
                    placeholder="Enter Campaign Name (e.g., Winter Sale 2026)"
                    value={campaignName}
                    onChange={(e) => {
                      setCampaignName(e.target.value);
                      setErrors({ ...errors, campaignName: "" });
                    }}
                    required
                    error={errors.campaignName}
                  />

                  <Input
                    label="Campaign URL"
                    type="url"
                    name="campaignURL"
                    placeholder="Enter Campaign URL (e.g., https://example.com/campaign)"
                    value={campaignURL}
                    onChange={(e) => {
                      setCampaignURL(e.target.value);
                      setErrors({ ...errors, campaignURL: "" });
                    }}
                    required
                    error={errors.campaignURL}
                  />

                  <ImageVideoFileUpload
                    label="Brand Logo"
                    imagePath={brandLogoUrl}
                    error={errors.brandLogoUrl}
                    folderStructure={projectName + "brandLogo"}
                    required
                    onUploadSuccess={(data) => {
                      console.log("=== Brand Logo Upload Success ===");
                      console.log("Full upload response data:", data);
                      
                      const uploadedUrl = data.resDataUrl || data.imageURL;
                      console.log("Final uploadedUrl to be set:", uploadedUrl);
                      
                      setBrandLogoUrl(uploadedUrl);
                      setErrors({ ...errors, brandLogoUrl: "" });
                    }}
                    onUploadError={(err) => {
                      console.error("=== Brand Logo Upload Error ===", err);
                      toast.error("Failed to upload brand logo");
                    }}
                    className="col-md-6 my-2"
                    imgStyle={{ height: "100px", width: "100px", objectFit: "contain" }}
                  />

                  {/* User Category (Subscription Filter) - NEW FIELD */}
                  <div className="col-md-12 my-3">
                    <div className="border rounded p-3" style={{ backgroundColor: "#f8f9fa" }}>
                      <label className="mb-2">
                        <strong>User Category *</strong> 
                        <span className="text-muted ml-2" style={{ fontSize: "13px" }}>
                          (Who can see this campaign?)
                        </span>
                      </label>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="custom-control custom-checkbox mr-4">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="userCategory-FREE"
                            checked={userCategory.includes("FREE")}
                            onChange={() => handleUserCategoryToggle("FREE")}
                          />
                          <label className="custom-control-label" htmlFor="userCategory-FREE" style={{ cursor: "pointer", fontSize: "14px" }}>
                            <span className="badge badge-secondary px-2 py-1"></span>
                            <span className="ml-2">All Users</span>
                          </label>
                        </div>
                        
                        <div className="custom-control custom-checkbox mr-4">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="userCategory-FREE-TRAIL"
                            checked={userCategory.includes("FREE-TRAIL")}
                            onChange={() => handleUserCategoryToggle("FREE-TRAIL")}
                          />
                          <label className="custom-control-label" htmlFor="userCategory-FREE-TRAIL" style={{ cursor: "pointer", fontSize: "14px" }}>
                            <span className="badge badge-info px-2 py-1"></span>
                            <span className="ml-2">Free Trial Users</span>
                          </label>
                        </div>
                        
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="userCategory-PREMIUM"
                            checked={userCategory.includes("PREMIUM")}
                            onChange={() => handleUserCategoryToggle("PREMIUM")}
                          />
                          <label className="custom-control-label" htmlFor="userCategory-PREMIUM" style={{ cursor: "pointer", fontSize: "14px" }}>
                            <span className="badge badge-warning px-2 py-1" style={{ color: "#000" }}></span>
                            <span className="ml-2">Premium Users</span>
                          </label>
                        </div>
                      </div>
                      {errors.userCategory && (
                        <div className="pl-1 text-left mt-2">
                          <span className="error">{errors.userCategory}</span>
                        </div>
                      )}
                      <small className="text-muted d-block mt-2">
                        <i className="ri-information-line"></i> At least one category must be selected
                      </small>
                    </div>
                  </div>

                  <Input
                    label="Priority"
                    type="number"
                    name="priority"
                    placeholder="Priority (1 = highest)"
                    value={priority}
                    onChange={(e) => {
                      setPriority(e.target.value);
                      setErrors({ ...errors, priority: "" });
                    }}
                    required
                    error={errors.priority}
                    min="1"
                  />

                  <div className="col-md-6 my-2">
                    <label>Start Date *</label>
                    <div className="w-100">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          setErrors({ ...errors, startDate: "" });
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-control-line w-100"
                        placeholderText="Select start date"
                        showPopperArrow={false}
                        minDate={new Date()}
                        required
                      />
                    </div>
                    {errors.startDate && (
                      <div className="pl-1 text-left">
                        <span className="error">{errors.startDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 my-2">
                    <label>End Date *</label>
                    <div className="w-100">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          setEndDate(date);
                          setErrors({ ...errors, endDate: "" });
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="form-control form-control-line w-100"
                        placeholderText="Select end date"
                        showPopperArrow={false}
                        minDate={startDate || new Date()}
                        required
                      />
                    </div>
                    {errors.endDate && (
                      <div className="pl-1 text-left">
                        <span className="error">{errors.endDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 my-2 styleForTitle d-flex align-items-center">
                    <label className="mb-0 mr-3">Is Active</label>
                    <label className="switch mb-0">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Placements (Dynamic Array - Max 3) */}
              <div className="form-group mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-white mb-0">
                    Product Placements ({placements.length}/3)
                  </h6>
                  {placements.length < 3 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={handleAddPlacement}
                    >
                      <i className="ri-add-line"></i> Add Placement
                    </button>
                  )}
                </div>

                {placements.map((placement, index) => (
                  <div key={`placement-${index}-${placement._id || index}`} className="card mb-3 p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0" style={{ color: "#333" }}>Placement {index + 1}</h6>
                      {placements.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemovePlacement(index)}
                        >
                          <i className="ri-delete-bin-line"></i> Remove
                        </button>
                      )}
                    </div>

                    <div className="row">
                      {/* Type Dropdown - Must be unique per brand integration */}
                      <div className="col-md-6 my-2 styleForTitle">
                        <label>Type * <span className="text-muted" style={{ fontSize: "12px" }}>(Must be unique)</span></label>
                        <select
                          name="type"
                          className={`form-control form-control-line ${errors[`placements[${index}].type`] ? 'is-invalid' : ''}`}
                          value={placement.type}
                          onChange={(e) => {
                            handlePlacementChange(index, "type", e.target.value);
                          }}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="PRODUCT_POPUP">Product Popup</option>
                          <option value="QUIZ">Quiz</option>
                          <option value="ASTON">Aston</option>
                          <option value="BANNER">Banner</option>
                        </select>
                        {errors[`placements[${index}].type`] && (
                          <div className="pl-1 text-left">
                            <span className="error">
                              {errors[`placements[${index}].type`]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Multiple Targets Section */}
                      <div className="col-md-12 my-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="mb-0">Target Series & Episodes *</label>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAddTargetToPlacement(index)}
                          >
                            <i className="ri-add-line"></i> Add Target
                          </button>
                        </div>

                        {errors[`placements[${index}].target`] && (
                          <div className="pl-1 text-left mb-2">
                            <span className="error">
                              {errors[`placements[${index}].target`]}
                            </span>
                          </div>
                        )}

                        {(placement.target || []).map((targetItem, targetIndex) => (
                          <div key={targetIndex} className="border rounded p-3 mb-3" style={{ backgroundColor: "#f8f9fa" }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">Target {targetIndex + 1}</h6>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveTargetFromPlacement(index, targetIndex)}
                                title="Remove Target"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>

                            {/* Series Selection */}
                            <div className="form-group">
                              <label>Series Selection *</label>
                              
                              {/* All Live Series Checkbox */}
                              <div className="custom-control custom-checkbox mb-3 ml-3 p-2">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`allLiveSeries-${index}-${targetIndex}`}
                                  checked={targetItem.allLiveSeries || false}
                                  onChange={(e) => handleAllLiveSeriesToggle(index, targetIndex, e.target.checked)}
                                />
                                <label 
                                  className="custom-control-label font-weight-bold" 
                                  htmlFor={`allLiveSeries-${index}-${targetIndex}`}
                                  style={{ cursor: "pointer", fontSize: "14px" }}
                                >
                                  <i className="ri-global-line mr-1"></i>
                                  Apply to All Live Series
                                  <small className="d-block text-muted font-weight-normal mt-1">
                                    This will apply to all published series in the platform
                                  </small>
                                </label>
                              </div>
                              
                              {/* Series Dropdown (disabled if allLiveSeries is checked) */}
                              <select
                                className={`form-control form-control-line ${errors[`placements[${index}].target[${targetIndex}].refId`] ? 'is-invalid' : ''}`}
                                value={targetItem.refId || ""}
                                onChange={(e) => handleTargetSeriesChange(index, targetIndex, e.target.value)}
                                required={!targetItem.allLiveSeries}
                                disabled={targetItem.allLiveSeries}
                                style={{
                                  backgroundColor: targetItem.allLiveSeries ? "#e9ecef" : "white",
                                  cursor: targetItem.allLiveSeries ? "not-allowed" : "pointer"
                                }}
                              >
                                <option value="">
                                  {targetItem.allLiveSeries 
                                    ? "All Live Series Selected" 
                                    : movieList.length === 0 
                                      ? "Loading series..." 
                                      : "Select Specific Series"}
                                </option>
                                {!targetItem.allLiveSeries && movieList.map((movie) => (
                                  <option key={movie.value} value={movie.value}>
                                    {movie.label}
                                  </option>
                                ))}
                              </select>
                              {errors[`placements[${index}].target[${targetIndex}].refId`] && (
                                <div className="invalid-feedback d-block">
                                  {errors[`placements[${index}].target[${targetIndex}].refId`]}
                                </div>
                              )}
                            </div>

                            {/* Episode Selection (only show if specific series is selected) */}
                            {targetItem.refId && !targetItem.allLiveSeries && (
                              <div className="form-group">
                                <label>Select Episodes *</label>
                                
                                {/* All Episodes Radio */}
                                <div className="form-check mb-2">
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id={`allEpisodes-${index}-${targetIndex}`}
                                    name={`episodes-${index}-${targetIndex}`}
                                    checked={targetItem.episodes === "all"}
                                    onChange={() => handleTargetEpisodesChange(index, targetIndex, "all")}
                                  />
                                  <label className="form-check-label" htmlFor={`allEpisodes-${index}-${targetIndex}`} style={{ fontSize: "14px" }}>
                                    <strong>All Episodes</strong> - Campaign will show on all episodes
                                  </label>
                                </div>

                                {/* Specific Episodes Radio + Checkboxes */}
                                <div className="form-check mb-2">
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id={`specificEpisodes-${index}-${targetIndex}`}
                                    name={`episodes-${index}-${targetIndex}`}
                                    checked={Array.isArray(targetItem.episodes)}
                                    onChange={() => handleTargetEpisodesChange(index, targetIndex, [])}
                                  />
                                  <label className="form-check-label" htmlFor={`specificEpisodes-${index}-${targetIndex}`} style={{ fontSize: "14px" }}>
                                    <strong>Specific Episodes</strong> - Select episodes below
                                  </label>
                                </div>

                                {/* Episodes Checkbox List (shown only if specific episodes selected) */}
                                {Array.isArray(targetItem.episodes) && (
                                  <div className="mt-3 border rounded p-3" style={{ maxHeight: "300px", overflowY: "auto", backgroundColor: "#fff" }}>
                                    {episodesLoading[targetItem.refId] ? (
                                      <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                          <span className="sr-only">Loading...</span>
                                        </div>
                                        <p className="text-muted mt-2 mb-0">Loading episodes...</p>
                                      </div>
                                    ) : episodesMap[targetItem.refId] && episodesMap[targetItem.refId].length > 0 ? (
                                      <>
                                        <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                          <small className="text-muted font-weight-bold">
                                            {targetItem.episodes.length} of {episodesMap[targetItem.refId].length} episodes selected
                                          </small>
                                          <div>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-primary mr-1"
                                              onClick={() => {
                                                const allEpisodeIds = episodesMap[targetItem.refId].map(ep => ep.value);
                                                handleTargetEpisodesChange(index, targetIndex, allEpisodeIds);
                                              }}
                                            >
                                              Select All
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() => handleTargetEpisodesChange(index, targetIndex, [])}
                                            >
                                              Clear All
                                            </button>
                                          </div>
                                        </div>
                                        {episodesMap[targetItem.refId].map((episode) => (
                                          <div key={episode.value} className="custom-control custom-checkbox mb-2">
                                            <input
                                              type="checkbox"
                                              className="custom-control-input"
                                              id={`episode-${index}-${targetIndex}-${episode.value}`}
                                              checked={targetItem.episodes.includes(episode.value)}
                                              onChange={(e) => handleEpisodeCheckboxToggle(index, targetIndex, episode.value, e.target.checked)}
                                            />
                                            <label 
                                              className="custom-control-label" 
                                              htmlFor={`episode-${index}-${targetIndex}-${episode.value}`}
                                              style={{ cursor: "pointer", userSelect: "none" }}
                                            >
                                              {episode.label}
                                              {episode.seasonNumber && (
                                                <small className="text-muted ml-2">
                                                  (Season {episode.seasonNumber})
                                                </small>
                                              )}
                                            </label>
                                          </div>
                                        ))}
                                      </>
                                    ) : (
                                      <div className="text-center py-3 text-muted">
                                        <i className="ri-film-line" style={{ fontSize: "2rem" }}></i>
                                        <p className="mb-0 mt-2">No episodes found for this series</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {(placement.target || []).length === 0 && (
                          <div className="alert alert-info">
                            <i className="ri-information-line"></i> No targets added yet. Click "Add Target" to target a series or specific episodes.
                          </div>
                        )}
                      </div>

                      {/* Title (max 20 chars) */}
                      <div className="col-md-6 my-2 styleForTitle">
                        <label>
                          Title * 
                          <span className="ml-2" style={{ fontSize: "12px", color: (placement.title || "").length > 20 ? "red" : "#999" }}>
                            ({(placement.title || "").length}/20)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          className="form-control form-control-line"
                          placeholder="Enter Title"
                          value={placement.title || ""}
                          onChange={(e) =>
                            handlePlacementChange(index, "title", e.target.value)
                          }
                          maxLength="20"
                          required
                        />
                        {errors[`placements[${index}].title`] && (
                          <div className="pl-1 text-left">
                            <span className="error">
                              {errors[`placements[${index}].title`]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Subtitle (max 25 chars) */}
                      <div className="col-md-6 my-2 styleForTitle">
                        <label>
                          Subtitle * 
                          <span className="ml-2" style={{ fontSize: "12px", color: (placement.subtitle || "").length > 25 ? "red" : "#999" }}>
                            ({(placement.subtitle || "").length}/25)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="subtitle"
                          className="form-control form-control-line"
                          placeholder="Enter Subtitle"
                          value={placement.subtitle || ""}
                          onChange={(e) =>
                            handlePlacementChange(index, "subtitle", e.target.value)
                          }
                          maxLength="25"
                          required
                        />
                        {errors[`placements[${index}].subtitle`] && (
                          <div className="pl-1 text-left">
                            <span className="error">
                              {errors[`placements[${index}].subtitle`]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description (Rich Text Editor) */}
                      <div className="col-md-12 my-2 styleForTitle">
                        <label>Description *</label>
                        <SunEditor
                          key={`placement-desc-${index}-${open}-${editorKey}`}
                          getSunEditorInstance={(se) => {
                            descriptionEditorRefs.current[`placement-${index}`] = se;
                            // Set content after editor is ready
                            if (se && placement.description) {
                              se.setContents(placement.description);
                            }
                          }}
                          defaultValue={placement.description || ""}
                          onChange={(content) =>
                            handlePlacementChange(index, "description", content)
                          }
                          setOptions={{
                            buttonList: [
                              ["align"],
                              ["undo", "redo"],
                              ["font", "fontSize"],
                              ["bold", "underline", "italic"],
                              ["fontColor"],
                              ["list"],
                            ],
                            height: 150,
                          }}
                          placeholder="Enter Description..."
                        />
                        {errors[`placements[${index}].description`] && (
                          <div className="pl-1 text-left">
                            <span className="error">
                              {errors[`placements[${index}].description`]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA Text */}
                      <div className="col-md-6 my-2 styleForTitle">
                        <label>CTA Text *</label>
                        <input
                          type="text"
                          name="ctaText"
                          className="form-control form-control-line"
                          placeholder="e.g., Shop Now"
                          value={placement.ctaText || ""}
                          onChange={(e) =>
                            handlePlacementChange(index, "ctaText", e.target.value)
                          }
                          required
                        />
                        {errors[`placements[${index}].ctaText`] && (
                          <div className="pl-1 text-left">
                            <span className="error">
                              {errors[`placements[${index}].ctaText`]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Display Duration */}
                      <div className="col-md-6 my-2 styleForTitle">
                        <label>
                          Display Duration (seconds) * 
                          <span className="text-muted ml-2" style={{ fontSize: "12px" }}>
                            (Max 5 seconds)
                          </span>
                        </label>
                        <input
                          type="number"
                          name="displayDurationSec"
                          className="form-control form-control-line"
                          placeholder="Duration in seconds (1-5)"
                          value={placement.displayDurationSec || 5}
                          onChange={(e) =>
                            handlePlacementChange(index, "displayDurationSec", e.target.value)
                          }
                          min="1"
                          max="5"
                          required
                        />
                        {errors[`placements[${index}].displayDurationSec`] && (
                          <div className="pl-1 text-left">
                            <span className="error">
                              {errors[`placements[${index}].displayDurationSec`]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      </DialogContent>

      <div>
        <hr className="dia_border w-100 mt-0"></hr>
      </div>

      <DialogActions>
        <button
          type="button"
          className="btn btn-danger btn-sm px-3 py-1 mb-3"
          onClick={handleClose}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEditMode ? "Update Brand Integration" : "Create Brand Integration"}</>
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandIntegrationDialog;

// Add these styles to your global CSS or style tag
const styles = `
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 24px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  if (!document.head.querySelector('style[data-brand-integration]')) {
    styleSheet.setAttribute('data-brand-integration', 'true');
    document.head.appendChild(styleSheet);
  }
}
