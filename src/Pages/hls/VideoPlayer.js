import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Hls.isSupported() && videoSrc) {
      const hls = new Hls();
      const url = new URL(videoSrc);
      const queryParams = url.search;

      class CustomLoader extends Hls.DefaultConfig.loader {
        constructor(config) {
          super(config);
        }
        load(context, config, callbacks) {
          // ensure that the signature is appended to all requests.
          if (!context.url.includes("?Policy")) {
            const modifiedUrl = context.url + queryParams;
            context.url = modifiedUrl;
          }
          super.load(context, config, callbacks);
        }
      }

      hls.config.fLoader = CustomLoader;
      hls.config.pLoader = CustomLoader;

      hls.loadSource(videoSrc);
      hls.attachMedia(videoRef.current);

      return () => hls.destroy();
    }
  }, [videoSrc]);

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 w-full mb-2"
        placeholder="Enter CloudFront Signed URL"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4"
        onClick={() => setVideoSrc(inputValue)}
      >
        Load Video
      </button>
      <video ref={videoRef} controls style={{ width: "500px" }} />
    </div>
  );
};

export default VideoPlayer;

// NEW CODE #########################
// import React, { useRef, useState, useEffect } from "react";
// import Hls from "hls.js";

// const VideoPlayer = () => {
//   const videoRef = useRef(null);
//   const [videoSrc, setVideoSrc] = useState("");
//   const [inputValue, setInputValue] = useState("");
//   const [subtitleSrc, setSubtitleSrc] = useState("");
//   const [subtitleInput, setSubtitleInput] = useState("");

//   useEffect(() => {
//     if (Hls.isSupported() && videoSrc) {
//       const hls = new Hls();
//       const url = new URL(videoSrc);
//       const queryParams = url.search;

//       class CustomLoader extends Hls.DefaultConfig.loader {
//         constructor(config) {
//           super(config);
//         }
//         load(context, config, callbacks) {
//           if (!context.url.includes("?Policy")) {
//             const modifiedUrl = context.url + queryParams;
//             context.url = modifiedUrl;
//           }
//           super.load(context, config, callbacks);
//         }
//       }

//       hls.config.fLoader = CustomLoader;
//       hls.config.pLoader = CustomLoader;

//       hls.loadSource(videoSrc);
//       hls.attachMedia(videoRef.current);

//       return () => hls.destroy();
//     }
//   }, [videoSrc]);

//   // Function to fetch subtitle and create a Blob URL
//   const fetchSubtitleBlob = async (subtitleUrl) => {
//     try {
//       const response = await fetch(subtitleUrl);
//       const text = await response.text();
//       const blob = new Blob([text], { type: "text/vtt" });
//       const blobUrl = URL.createObjectURL(blob);
//       setSubtitleSrc(blobUrl);
//     } catch (error) {
//       console.error("Error fetching subtitle file:", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <input
//         type="text"
//         className="border p-2 w-full mb-2"
//         placeholder="Enter CloudFront Signed URL"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <button
//         className="bg-blue-500 text-white px-4 py-2 mb-4"
//         onClick={() => setVideoSrc(inputValue)}
//       >
//         Load Video
//       </button>
//       <input
//         type="text"
//         className="border p-2 w-full mb-2"
//         placeholder="Enter Subtitle S3 URL (.vtt format)"
//         value={subtitleInput}
//         onChange={(e) => setSubtitleInput(e.target.value)}
//       />
//       <button
//         className="bg-green-500 text-white px-4 py-2 mb-4"
//         onClick={() => fetchSubtitleBlob(subtitleInput)}
//       >
//         Load Subtitles
//       </button>
//       <video ref={videoRef} controls style={{ width: "500px" }}>
//         {subtitleSrc && (
//           <track
//             kind="subtitles"
//             label="Subtitles"
//             srclang="en"
//             src={subtitleSrc}
//             default
//           />
//         )}
//       </video>
//     </div>
//   );
// };

// export default VideoPlayer;
