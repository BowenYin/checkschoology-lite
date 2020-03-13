var events = {};
chrome.runtime.onMessage.addListener(async function(url) {
  try {
    events = await (await fetch(url)).json();
    updateAll();
  } catch (err) {
    console.error(err);
  }
});
function updateAll() {
  if (Object.keys(events).length === 0) return;
  const cells = document.getElementsByClassName("fc-event");
  chrome.storage.sync.get("ids", function(result) {
    const ids = result.ids || {};
    for (let i = 0; i < cells.length; i++) {
      const event = events[i];
      const cell = cells[i];
      if (cell.childNodes[0].classList.contains("csl-checkbox")) continue;
      const el = document.createElement("div");
      el.classList.add("csl-checkbox", "material-icons");
      updateState(ids[event.id], el, cell);
      el.innerHTML = "done";
      el.addEventListener("click", function(e) {
        e.stopPropagation();
        chrome.storage.sync.get("ids", function(result) {
          if (!result.ids) result.ids = {};
          result.ids[event.id] = !result.ids[event.id];
          chrome.storage.sync.set({ids: result.ids});
          updateState(result.ids[event.id], el, cell);
        });
      });
      cell.insertBefore(el, cell.firstChild);
    };
  });
}
function updateState(checked, checkbox, event) {
  if (checked) {
    checkbox.classList.add("csl-checked");
    event.classList.add("csl-completed");
  } else {
    checkbox.classList.remove("csl-checked");
    event.classList.remove("csl-completed");
  }
}
window.onload = function() {
  document.getElementsByClassName("fc-header")[0].addEventListener("click", this.updateAll);
  const observer = new MutationObserver(function(mutations) {
    if (mutations.length > 1) updateAll();
  });
  observer.observe(document.getElementsByClassName("fc-view fc-view-month")[0].childNodes[1], {childList: true});
};