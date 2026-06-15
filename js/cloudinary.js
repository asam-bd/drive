// cloudinary.js - unsigned upload of picked Google Photos items.
(function () {
  var cfg = window.CSM_CONFIG.cloudinary;
  function endpoint(rt) { return "https://api.cloudinary.com/v1_1/" + cfg.cloudName + "/" + rt + "/upload"; }
  function isVideoItem(item) {
    return item.type === "VIDEO" || (item.mediaFile && item.mediaFile.mimeType && item.mediaFile.mimeType.indexOf("video") === 0);
  }
  function downloadUrl(item) {
    var base = (item.mediaFile && item.mediaFile.baseUrl) || item.baseUrl;
    return base + (isVideoItem(item) ? "=dv" : "=d");
  }
  function uploadItem(item, googleToken) {
    var resourceType = isVideoItem(item) ? "video" : "image";
    return fetch(downloadUrl(item), { headers: { "Authorization": "Bearer " + googleToken } })
      .then(function (r) { if (!r.ok) throw new Error("Download from Google failed (" + r.status + ")"); return r.blob(); })
      .then(function (blob) {
        var form = new FormData();
        form.append("file", blob);
        form.append("upload_preset", cfg.uploadPreset);
        if (cfg.folder) form.append("folder", cfg.folder);
        return fetch(endpoint(resourceType), { method: "POST", body: form });
      })
      .then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error("Cloudinary " + r.status + ": " + t); }); return r.json(); })
      .then(function (res) {
        var meta = item.mediaFile && item.mediaFile.mediaFileMetadata;
        return { publicId: res.public_id, type: resourceType, url: res.secure_url, width: res.width, height: res.height, createdAt: (meta && meta.creationTime) || res.created_at || new Date().toISOString() };
      });
  }
  function thumb(rec, width) {
    var w = width || 600, t = "f_auto,q_auto,w_" + w + ",c_limit";
    if (rec.type === "video") return "https://res.cloudinary.com/" + cfg.cloudName + "/video/upload/" + t + "/" + rec.publicId + ".jpg";
    return "https://res.cloudinary.com/" + cfg.cloudName + "/image/upload/" + t + "/" + rec.publicId;
  }
  function full(rec) {
    if (rec.type === "video") return "https://res.cloudinary.com/" + cfg.cloudName + "/video/upload/q_auto/" + rec.publicId + ".mp4";
    return "https://res.cloudinary.com/" + cfg.cloudName + "/image/upload/f_auto,q_auto/" + rec.publicId;
  }
  window.CSMCloudinary = { uploadItem: uploadItem, thumb: thumb, full: full };
})();
