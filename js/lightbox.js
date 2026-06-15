// lightbox.js - full-screen viewer with prev/next.
(function () {
  var box = function () { return document.getElementById("lightbox"); };
  var list = [], idx = 0;
  function open(records, startIndex) { list = records; idx = startIndex; render(); box().classList.remove("hidden"); }
  function close() { box().classList.add("hidden"); document.getElementById("lb-content").innerHTML = ""; }
  function next() { idx = (idx + 1) % list.length; render(); }
  function prev() { idx = (idx - 1 + list.length) % list.length; render(); }
  function render() {
    var rec = list[idx], c = document.getElementById("lb-content"); c.innerHTML = "";
    var el;
    if (rec.type === "video") { el = document.createElement("video"); el.src = CSMCloudinary.full(rec); el.controls = true; el.autoplay = true; el.playsInline = true; }
    else { el = document.createElement("img"); el.src = CSMCloudinary.full(rec); el.alt = "photo"; }
    c.appendChild(el);
    var d = rec.createdAt ? new Date(rec.createdAt) : null;
    document.getElementById("lb-meta").textContent = (idx + 1) + " / " + list.length + (d ? "  \u2022  " + d.toLocaleString() : "");
  }
  function bind() {
    document.getElementById("lb-close").addEventListener("click", close);
    document.getElementById("lb-next").addEventListener("click", next);
    document.getElementById("lb-prev").addEventListener("click", prev);
    document.addEventListener("keydown", function (e) {
      if (box().classList.contains("hidden")) return;
      if (e.key === "Escape") close(); else if (e.key === "ArrowRight") next(); else if (e.key === "ArrowLeft") prev();
    });
    box().addEventListener("click", function (e) { if (e.target === box()) close(); });
  }
  window.CSMLightbox = { open: open, close: close, bind: bind };
})();
