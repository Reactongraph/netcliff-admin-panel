import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Drawer, IconButton } from "@mui/material";
import FbIcon from "../Component/assets/images/facebook.png";
import InstaIcon from "../Component/assets/images/instagram.png";
import YouTubeIcon from "../Component/assets/images/youtube.png";
import PlaceholderBanner from "../Component/assets/images/placeholderBanner.jpg";
import GPayIcon from "../Component/assets/images/gpay.svg";

const PaymentScreenPreview = ({ config, plan, open, onClose }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const displayBanners =
    config?.creative?.length &&
    [...config.creative].sort((a, b) => a.order - b.order);

  // Banner Rotation Logic
  useEffect(() => {
    if (displayBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % displayBanners.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [displayBanners.length]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 550,
          backgroundColor: "#f4f5f7",
        },
      }}
    >
      <div
        style={{
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h6>
          <b>Preview</b>
        </h6>
        <IconButton
          size="small"
          sx={{ background: "darkgrey" }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <hr style={{ marginTop: 0 }} />

      {/* Main Preview Section */}
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}
      >
        <div className="mobile-preview">
          <div>
            {/* 1.  mainHeading */}
            <div className="p-3">
              <div
                className="payment-main-heading"
                dangerouslySetInnerHTML={{
                  __html: config?.mainHeading || "",
                }}
              />
            </div>

            {/* 2. Hero Video / Banner Section */}
            <div
              style={{
                height: "200px",
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)),
      url(${PlaceholderBanner})`,
              }}
            >
              {displayBanners?.length > 0 ? (
                (() => {
                  const currentItem = displayBanners[currentBanner];
                  // Handle both new 'creative' structure (with 'url' and 'type') and legacy 'banner' structure (with 'image')
                  const imageUrl = currentItem.url || currentItem.image;
                  const type = currentItem.type; // 'image' or 'video' from creative, or 'subscription' from banner

                  if (type === "video" && currentItem.url) {
                    return (
                      <video
                        src={imageUrl}
                        poster={currentItem.thumbnailUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    );
                  }

                  return (
                    <img
                      src={imageUrl}
                      alt="Banner"
                      loading="eager"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  );
                })()
              ) : (
                <div>No Preview Available</div>
              )}
              {/* Banner Dots */}
              {/* {displayBanners?.length > 1 && (
                <div className="absolute bottom-2 right-4 flex gap-2 z-20">
                  {displayBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentBanner === index
                          ? "bg-highlight-gold w-4"
                          : "bg-white/40 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              )} */}
            </div>

            {/* 3. Main Content Area */}
            <div className="preview-main-content">
              {/* Badge */}
              <div style={{ margin: "25px 50px" }} className="text-center">
                {config?.secondaryHeading ? (
                  <div
                    style={{
                      background: "#FFFFFF1A",
                      border: "1px solid #FFFFFF1A",
                      borderRadius: "5px",
                      padding: "6px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: config.secondaryHeading,
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>

              {/* Timeline Box (Glassmorphism) */}
              <div
                style={{
                  background: "#FFFFFF1A",
                  border: "1px solid #FFFFFF1A",
                  borderRadius: "15px",
                  padding: "15px",
                  margin: "15px",
                }}
              >
                {(config?.steps?.length
                  ? [...config.steps].sort((a, b) => a.order - b.order)
                  : [1]
                ).map((step, index) => {
                  // Fallback if no steps (kept existing hardcoded structure logically if config missing)
                  if (!config?.steps?.length) {
                    return <></>;
                  }

                  const isLast = index === config.steps.length - 1;

                  return (
                    <div
                      key={index}
                      className={`timeline-item ${
                        !isLast ? "with-spacing" : ""
                      }`}
                    >
                      {/* Vertical line */}
                      {!isLast && <div className="timeline-line" />}

                      {/* Dot indicator */}
                      <div
                        className={`timeline-dot ${
                          index === 0
                            ? "timeline-dot-active"
                            : "timeline-dot-default"
                        }`}
                      />

                      <span
                        className="timeline-title"
                        dangerouslySetInnerHTML={{ __html: step.title }}
                      />

                      <span
                        className="timeline-body"
                        dangerouslySetInnerHTML={{ __html: step.body }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Social Proof */}
              <div style={{ margin: "40px 20px" }}>
                <div className="centered-meta-text">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: config?.footerText,
                    }}
                  />
                  <div className="inline-flex-center">
                    {/* Social Icons Mapping */}
                    {config?.socialLinks?.length ? (
                      config.socialLinks
                        .sort((a, b) => a.order - b.order)
                        .map((link, idx) => {
                          const platform = link.platform.toLowerCase();
                          // Paths for icons - User to ensure these exist or import them
                          const iconPath =
                            platform === "facebook"
                              ? FbIcon
                              : platform === "instagram"
                                ? InstaIcon
                                : platform === "youtube"
                                  ? YouTubeIcon
                                  : "";

                          return (
                            <a key={idx} title={link.url}>
                              {/* Prefer uploaded iconUrl, fallback to local path, else text */}
                              {link.iconUrl || iconPath ? (
                                <img
                                  src={link.iconUrl || iconPath}
                                  alt={link.platform}
                                  className="w-5 h-5 object-contain"
                                />
                              ) : (
                                <span>{link.platform}</span>
                              )}
                            </a>
                          );
                        })
                    ) : (
                      <> </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Footer Section */}
            <div style={{ marginBottom: "20px" }} className="px-5 pb-6">
              {config.showUpiTags && (
                <div className="upi-info">
                  Securely pay with UPI:
                  <span className="upi-tag">GPay</span>
                  <span className="upi-tag">PayTM</span>
                  <span className="upi-tag">PhonePe</span>
                  <span className="upi-tag">Others</span>
                </div>
              )}

              <div
                className="disclaimer-text"
                dangerouslySetInnerHTML={{
                  __html: config?.disclaimerText || "",
                }}
              />
            </div>
            {/* bottom-cta-div */}
            <div className="bottom-cta-div">
              <div className="upi-div">
                <div className="upi-icon-wrapper">
                  <img src={GPayIcon} alt="GPay" className="upi-icon" />
                </div>
                <div className="upi-text">
                  <span className="caption-text">Pay via</span>
                  <span className="upi-name">GPay</span>
                </div>
                <KeyboardArrowDownIcon className="down-arrow" />
              </div>

              <button className="cta-button">
                <div
                  className="cta-btn-text"
                  dangerouslySetInnerHTML={{
                    __html: config?.cta?.label || "",
                  }}
                />
                {/* Shine Effect */}
                <div className="cta-shine" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default PaymentScreenPreview;
