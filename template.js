///////////////
// Utilities //
///////////////

var s = function(selector, parent) {
  if (parent === undefined) { parent = document }
  return parent.querySelectorAll(selector)[0];
};

var placeAfter = function(toPlace, place) {
  place.parentNode.appendChild(toPlace);
};

///////////////
// Page flow //
///////////////

var getFlow = function() {
  return document.webkitGetNamedFlows().namedItem('article');
};

var addAPage = function() {
  var page = s('.page').cloneNode(true);
  var content = s('.content', page);
  content.innerHTML = '';
  page.innerHTML = '';
  page.appendChild(content);
  console.log(page, s('.page').parentNode);
  placeAfter(page, s('.page'));
};

var addFlowPages = function() {
  var flow = getFlow();
  while (flow.overset) { addAPage(); }
};

var removeTrailingEmptyPages = function() {
  var flow = getFlow();
  while (flow.firstEmptyRegionIndex !== -1) {
    var lastPage = s('.page:last-child');
    lastPage.parentNode.removeChild(lastPage);
  }
};

///////////////
// Footnotes //
///////////////

var getFootnotesForRegion = function(region) {
  var footnotes = s('.footnotes', region.parentNode);
  if (!footnotes) {
    footnotes = s('.footnotes').cloneNode(true);
    footnotes.innerHTML = '';
    placeAfter(footnotes, region);
  }
  return footnotes;
};

var getFlowRegion = function(el) {
  return getFlow().getRegionsByContent(el)[0];
};

var placeFootnote = function(fnref) {
  var region = getFlowRegion(fnref);
  var footnotes = getFootnotesForRegion(region);
  var footnote = s('.footnotes > ' + fnref.getAttribute('href'));
  footnotes.appendChild(footnote);
  return footnotes;
};

var incrementBottomPadding = function(el, increment) {
  if (isNaN(parseInt(el.style.paddingBottom, 10))) {
    el.style.paddingBottom = increment + 'px';
  } else {
    el.style.paddingBottom = (increment + parseInt(el.style.paddingBottom, 10)) + 'px';
  }
};

var placeFootnotes = function() {
  while (fnref = s('[rel=footnote]:not(.placed)')) {
    var footnotes = placeFootnote(fnref),
        initialFootnotes = footnotes;
    addFlowPages();
    // adjusts initial page's footnotes spacing to account for a footnote
    // pushing that footnote's referrer to the following page
    while (getFlowRegion(fnref).parentNode !== footnotes.parentNode) {
      incrementBottomPadding(initialFootnotes, 5);
      footnotes = placeFootnote(fnref);
    }
    addFlowPages();
    fnref.className = 'placed';
  }
};

// hangQuotes();
addFlowPages();
placeFootnotes();
removeTrailingEmptyPages();
addAPage(); // for the bibliography
removeTrailingEmptyPages();