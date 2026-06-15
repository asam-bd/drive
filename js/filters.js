// filters.js - filter media by type and date string.
(function () {
  function apply(records, type, dateStr) {
    return records.filter(function (r) {
      if (type && type !== "all" && r.type !== type) return false;
      if (dateStr) {
        var iso = r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "";
        if (iso.indexOf(dateStr.trim()) === -1) return false;
      }
      return true;
    });
  }
  window.CSMFilters = { apply: apply };
})();
