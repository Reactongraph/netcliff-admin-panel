import axios from "axios";

export const uploadFile = async (FileName, folderStructure, name) => {
  try {
    // Generate a unique filename with timestamp to prevent overwriting
    let uniqueFileName = name || FileName.name;
    const fileNameParts = uniqueFileName.split('.');
    const extension = fileNameParts.length > 1 ? fileNameParts.pop() : '';
    const baseName = fileNameParts.join('.');
    const timestamp = Date.now();
    uniqueFileName = `${baseName}-${timestamp}${extension ? '.' + extension : ''}`;

    const formData = new FormData();
    formData.append("folderStructure", folderStructure);
    formData.append("keyName", uniqueFileName);
    formData.append("content", FileName);

    let response;

    if (FileName.name.indexOf(".srt") !== -1) {
      response = await axios.post(`file/upload-vtt-subtitle`, formData);
    } else {
      response = await axios.post(`file/upload-file`, formData);
    }

    const resDataUrl = response.data.url;

    return { resDataUrl, imageURL: resDataUrl };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const covertURl = async (FileName) => {
  try {
    // For Azure CDN, we'll return the CDN URL since it's publicly accessible
    const imageURL = `${process.env.REACT_APP_AZURE_CDN_ENDPOINT}/${process.env.REACT_APP_AZURE_STORAGE_CONTAINER_NAME}/${FileName}`;

    return { FileName, imageURL };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
