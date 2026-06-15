// gallery.js - masonry grid with lazy-loaded thumbnails.
(function () {
  var grid = function () { return document.getElementById("masonry"); };
  var io = null;
  function ensureObserver() {
    if (io) return io;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute("data-src"); }
        io.unobserve(el);
      });
    }, { rootMargin: "300px" });
    return io;
  }
  function card(rec, index) {
    var div = document.createElement("div");
    div.className = "card"; div.dataset.index = index;
    var img = document.createElement("img");
    img.alt = rec.type; img.loading = "lazy";
    img.dataset.src = CSMCloudinary.thumb(rec, 600);
    img.addEventListener("load", function () { img.classList.add("loaded"); });
    ensureObserver().observe(img);
    div.appendChild(img);
    var tag = document.createElement("span");
    tag.className = "tag"; tag.textContent = rec.type === "video" ? "VIDEO" : "IMG";
    div.appendChild(tag);
    if (rec.type === "video") { var play = document.createElement("div"); play.className = "play"; play.textContent = "\u25B6"; div.appendChild(play); }
    return div;
  }
  function render(records, onOpen) {
    var g = grid(); g.innerHTML = "";
    var empty = document.getElementById("empty");
    if (!records.length) { empty.classList.remove("hidden"); return; }
    empty.classList.add("hidden");
    records.forEach(function (rec, i) {
      var c = card(rec, i);
      c.addEventListener("click", function () { onOpen(i); });
      g.appendChild(c);
    });
  }
  window.CSMGallery = { render: render };
})();
