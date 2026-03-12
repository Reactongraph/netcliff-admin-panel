import React, { useRef, useEffect, useState } from "react";
import "shaka-player/dist/controls.css";
import "./player.css";
const shaka = require("shaka-player/dist/shaka-player.ui.js");

const ShakaDrmPlayer = () => {
  const [drmType, setDrmType] = useState(null);
  const [manifestUrl, setManifestUrl] = useState(
    "https://stream.mux.com/V1f2LW6SJ02u01WyYzYLdAQ02AbDMv2qhdFaAvuvGMyWDA.m3u8?token=eyJhbGciOiJSUzI1NiJ9.eyJraWQiOiI3cWJZZXZWcVdnb0JJUGVOdEhLNzFoNUxiUFp1WnlCazAxMXM2YjZNTVZtMDAiLCJzdWIiOiJWMWYyTFc2U0owMnUwMVd5WXpZTGRBUTAyQWJETXYycWhkRmFBdnV2R015V0RBIiwiYXVkIjoidiIsImV4cCI6MTc1MzQzMzIwM30.fQNAOqLS15BmfuDTxrAGZkuFHK527ROlQf4RUzuKA72irmccp1iKrxDO-DvDpIGlvcQiYAFZsOUfNymGnQLb4frT__phKuBXfvIHnNJc95QZP7sVLEMYDH-1if_lwVWdym8gMJPUBbrdw4ZHbvYrFNap8ugm-VEbyoyHziz4BbQD2i3BsK_XncOvyxvKLTK71W6k1vRODyh_Xsn9JLh6_RdCjcGJSuyG1-GLOSlHwbjCF04EUf5tjsKw8DrDT7mJf4poqs8M9Y-pOIc3tomqUhVeMSe0ID9JqbmTgOGQ8Z2J5lGTE8OTke8mxNWRN-qzleunuYtuwKCgZTBhS8Th-A"
  );
  const [playbackId, setPlaybackId] = useState("V1f2LW6SJ02u01WyYzYLdAQ02AbDMv2qhdFaAvuvGMyWDA");
  const [licenseUrl, setLicenseUrl] = useState("");
  const [drmLicenseToken, setDrmLicenseToken] = useState(
    "eyJhbGciOiJSUzI1NiJ9.eyJraWQiOiI3cWJZZXZWcVdnb0JJUGVOdEhLNzFoNUxiUFp1WnlCazAxMXM2YjZNTVZtMDAiLCJzdWIiOiJWMWYyTFc2U0owMnUwMVd5WXpZTGRBUTAyQWJETXYycWhkRmFBdnV2R015V0RBIiwiYXVkIjoiZCIsImV4cCI6MTc1MzQzMzIwM30.RNIcbNTDYFSkgVkf5XMpsQw9Rdo194hVZpKN457GL-Af-_CeGjjx6rBd3BI1wkNhN2nqOG6GyMI5DigMpx7l4Rat4fjHVF98J_UK_nDOdVPMf5Bk5TpzhDauHqXlDOzz3ORn0Y6sz1G7W3qfTfIOboOjzBPpMeHoD9wqnGbaYpyIoZv68KKEgRkgPWirPejB98zUFwuBRgB8yLcizcfpY8_NdL_LzRqGzva0sWorjpxqPJgt78gCUbFNEcqODBUUTew5iYagSgGv8f6c9ywax6BFQo9Dod3g1q9cm4sXUQZf2QUb6NamK-qgAV59hmYoL3nAKX7bNrb-wSsHzxIPUg"
  );
  const [certificateUrl, setCertificateUrl] = useState("");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    detectDRM();
  }, []);

  const detectDRM = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Edge") || ua.includes("Trident")) {
      setDrmType("playready");
    } else if (ua.includes("Chrome") || ua.includes("Android")) {
      setDrmType("widevine");
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      setDrmType("fairplay");
    }
  };

  const loadVideo = () => {
    if (
      !manifestUrl ||
      !playbackId ||
      !drmLicenseToken
    ) {
      alert("Please provide all required values");
      return;
    }

    if (!shaka.Player.isBrowserSupported()) {
      alert("Shaka Player is not supported on this browser.");
      return;
    }
    setIsVideoLoaded(true);
  };

  return (
    <div>
      <h3>DRM Video Player ({drmType?.toUpperCase() || "Detecting..."})</h3>
      <input
        type="text"
        placeholder="Manifest URL"
        value={manifestUrl}
        onChange={(e) => setManifestUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Playback ID"
        value={playbackId}
        onChange={(e) => setPlaybackId(e.target.value)}
      />
      <input
        type="text"
        placeholder="DRM License Token"
        value={drmLicenseToken}
        onChange={(e) => setDrmLicenseToken(e.target.value)}
      />
      <button onClick={loadVideo}>Load Video</button>
      {isVideoLoaded && (
        <VideComponent
          manifestUrl={manifestUrl}
          drmType={drmType}
          playbackId={playbackId}
          drmToken={drmLicenseToken}
        />
      )}
    </div>
  );
};

export default ShakaDrmPlayer;

const getDrmTypeServerMap = (playbackId, drmToken) => {
  return {
    playready: {
      servers: {
        "com.microsoft.playready": `https://license.mux.com/license/playready/${playbackId}?token=${drmToken}`,
      },
      advanced: {
        "com.microsoft.playready": {
          videoRobustness: "SW_SECURE_CRYPTO",
          audioRobustness: "SW_SECURE_CRYPTO",
        },
      },
    },
    widevine: {
      servers: {
        "com.widevine.alpha": `https://license.mux.com/license/widevine/${playbackId}?token=${drmToken}`,
      },
      advanced: {
        "com.widevine.alpha": {
          videoRobustness: "SW_SECURE_CRYPTO",
          audioRobustness: "SW_SECURE_CRYPTO",
        },
      },
    },
    fairplay: {
      servers: {
        "com.apple.fps.1_0": `https://license.mux.com/license/fairplay/${playbackId}?token=${drmToken}`,
      },
      advanced: {
        "com.apple.fps.1_0": {
          serverCertificateUri: `https://license.mux.com/appcert/fairplay/${playbackId}?token=${drmToken}`,
          videoRobustness: "SW_SECURE_CRYPTO",
          audioRobustness: "SW_SECURE_CRYPTO",
        },
      },
    },
  };
};

const VideComponent = ({ manifestUrl, drmType, playbackId, drmToken }) => {
  const videoComponent = useRef(null);
  const videoContainer = useRef(null);

  // Error handler function
  const onError = (error) => {
    console.error("Error code", error.code, "object", error);
  };

  useEffect(() => {
    const video = videoComponent.current;
    const videoContainerEl = videoContainer.current;

    // Initialize Shaka Player
    const player = new shaka.Player(video);

    // Setting up DRM configuration
    player.configure({
      drm: {
        ...getDrmTypeServerMap(playbackId, drmToken)[drmType],
      },
    });

    // Setting up Shaka Player UI
    const ui = new shaka.ui.Overlay(player, videoContainerEl, video);
    ui.getControls();

    // Listen for error events
    player.addEventListener("error", (event) => onError(event.detail));

    // Try to load a manifest (asynchronous process)
    player
      .load(manifestUrl)
      .then(() => console.log("The video has now been loaded!"))
      .catch(onError);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="video-container" ref={videoContainer}>
      <video
        className="shaka-video"
        ref={videoComponent}
        poster="//shaka-player-demo.appspot.com/assets/poster.jpg"
      />
    </div>
  );
};
