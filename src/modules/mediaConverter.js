function getObjectUrl(blobObject) {
  return URL.createObjectURL(blobObject);
}

function convertBase64ToBlob(base64, mime) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export { getObjectUrl, convertBase64ToBlob };
