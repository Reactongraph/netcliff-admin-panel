export const acceptImageTypes = "image/png, image/jpeg, image/jpg, image/webp, image/gif";

export const videoTypeOptions = [
    // { value: "0", label: "Youtube Url" },
    // { value: "1", label: "m3u8 Url" },
    // { value: "2", label: "MP4 Url" },
    // { value: "3", label: "MKV Url" },
    // { value: "4", label: "WEBM Url" },
    // { value: "5", label: "Embed source" },
    // { value: "7", label: "MOV Url" },
    { value: "8", label: "File (MP4/MOV/MKV/WEBM for HLS)" },
];

export const bannerTypes = [
    { value: "auth", label: "Auth Banner" },
    { value: "subscription", label: "Subscription Banner" }
];

export const seriesFormTabs = [
    {
        index: 0,
        label: "Details",
        disabled: false,
        hasError: false,
    },
    {
        index: 1,
        label: "Images",
        disabled: false,
        hasError: false,
    },

    {
        index: 2,
        label: "SEO",
        disabled: false,
        hasError: false,
    },
    {
        index: 3,
        label: "Geo-blocking",
        disabled: false,
        hasError: false,
    },
    {
        index: 4,
        label: "Ad Config",
        disabled: false,
        hasError: false,
    },
]