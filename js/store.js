// store.js - localStorage manifest of media already uploaded to Cloudinary.
(function () {
  var KEY = "csm_drive_media_v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(items) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function add(item) {
    var items = load();
    if (items.some(function (i) { return i.publicId === item.publicId; })) return items;
    items.unshift(item); save(items); return items;
  }
  window.CSMStore = { load: load, save: save, add: add };
})();
