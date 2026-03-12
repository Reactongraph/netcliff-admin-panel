export const uploadFileToSignedUrl = async (signedUrl, file) => {
  return await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type, // Only Content-Type
    },
  });
};
