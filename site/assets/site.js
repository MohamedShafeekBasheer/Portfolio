// Small, optional enhancements. The site works without this file.
(function () {
  "use strict";

  // Live local time in Abha.
  var clocks = document.querySelectorAll("[data-clock]");
  function tick() {
    clocks.forEach(function (el) {
      try {
        el.textContent = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit", minute: "2-digit", weekday: "short", timeZone: el.getAttribute("data-tz")
        }).format(new Date());
      } catch (err) { /* leave placeholder */ }
    });
  }
  if (clocks.length) { tick(); setInterval(tick, 30000); }

  // Pre-select the contact topic from ?topic=… links on the services page.
  var topic = document.getElementById("topic");
  if (topic) {
    var wanted = new URLSearchParams(location.search).get("topic");
    if (wanted) {
      Array.prototype.forEach.call(topic.options, function (o) { if (o.text === wanted) topic.value = o.text; });
    }
  }
})();
