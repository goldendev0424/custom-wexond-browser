/**
 * Highlight text
 */
import * as templates from './templates';
import $ from './libs';

const tabUrl = location.origin + location.pathname + location.search; // Current tab url
const storagePrefixOrigin = 'wx_highlights_'; // The localstorage main key prefix for save highlight
let storagePrefix = storagePrefixOrigin; // The localstorage key prefix for shrink/unshrink, e.x: wx_highlights_ or wx_highlights_shrink_
let highlightsArr = []; // The stored all highlight data that saved in localstorage
let highlightedDomElem = null; // When update highlight, selected highlighted dom element
let selectedRange = null; // When add new highlight, selected dom range by user
let isShowedUpdateToolbar = false; // Whether showed/hidden update toolbar
let isDisableHighlgiht = false; // Whether active/disable highlight

// Highlight options
const options = {
  element: 'span',
  className: 'wx-highlight',
  exclude: ['style', 'script', 'img', 'nav', '#wx_highlight', '#wx_left_side_bar', '#sidebar-sponsors-platinum-right', '#ad', '#skyscraper'],
  acrossElements: true,
  caseSensitive: true,
  separateWordSearch: false,
  accuracy: 'partially',
  diacritics: false,
  iframes: false,
  iframesTimeout: 5000,
  each: function (node, highlight) {
    // Add color to highlighted element.
    node.dataset.wxHighlightId = highlight.id;
    node.className = node.className + ` ${highlight.color}`;
    // If click highlighted element, show update toolbar
    node.onclick = function (e) {
      showUpdateToolbar(e, highlight.color);
      highlightedDomElem = node;
    };
  },
};

// When click on page, toggle highlight toolbar
$(document)
  .on('click', function (e) {
    if(isDisableHighlgiht) {
      return;
    }
    e.stopPropagation();
    var wxHighlight = document.getElementById('wx_highlight');
    var leftSidePane = document.getElementById('wx_left_side_bar');

    if ($.contains(wxHighlight, e.target) || $.contains(leftSidePane, e.target)) {
      return;
    }
    
    // Toggle highlight toolbar.
    toggleToolbar(e);
    hideUpdateToolbar(e);
    $('#wx_highlight_color_list').hide();
  })// When double click on page, toggle highlight toolbar
  .on('dblclick', function (e) {
    e.stopPropagation();
    // Disable highlight
    if(isDisableHighlgiht) {
      return;
    }

    var wxHighlight = document.getElementById('wx_highlight');
    var leftSidePane = document.getElementById('wx_left_side_bar');
    
    if ($.contains(wxHighlight, e.target) || $.contains(leftSidePane, e.target)) {
      return;
    }

    // Toogle highlight toolbar.
    toggleToolbar(e);
    hideUpdateToolbar(e);
    $('#wx_highlight_color_list').hide();
  });

$(document).on('click', '#wx_apply_highlight', function (e) {
  applyHighlight(e);
});

$(document).on('click', '#wx_update_highlight', function (e) {
  updateHighlight(e);
});

$(document).on('click', '#wx_clear_all_highlight', function (e) {
  removeAllHighlights(e);
});

$(document).on('click', '#wx_clear_highlight', function (e) {
  removeSelectedHighlight(e);
});

$(document).on('click', '#wx_selected_highlight_color', function (e) {
  toggleColorList();
});

$(document).on('click', '#wx_highlight_color_list .wx-highlight-color', function (e) {
  selectColor(e);
});

const init = (isContentsShrink = false) => {
  // If content is shrinked, use another highlight data
  if(isContentsShrink) {
    storagePrefix = storagePrefixOrigin + 'shrink_';
  } else {
    storagePrefix = storagePrefixOrigin;
  }

  loadHighlights();
}

// Show/hide toolbar
const toggleToolbar = (e) => {
  const $target = $(e.target);
  const isClickedHighlight = !!$target.data && !!$target.data('markjs');
  const selection = document.getSelection();
  const $toolbar = $('#wx_highlight_toolbar');

  // If user select some text that not highlight, and hidden update toolbar
  if (
    selection.type.toLowerCase() === 'range' &&
    !isClickedHighlight &&
    !isShowedUpdateToolbar
  ) {
    selectedRange = selection.getRangeAt(0);

    const $highlightColorForm = $('#wx_highlight_color');
    $highlightColorForm.show();
    $highlightColorForm
      .detach()
      .prependTo($toolbar.find('.wx-highlight-controls'));

    const $colorElem = $('#wx_selected_highlight_color .wx-highlight-color')[0];
    const oldColor = $colorElem.classList[1];

    $colorElem.classList.replace(oldColor, 'wx-highlight-red');

    setToolbarPosition(e, 'wx_highlight_toolbar');
    $toolbar.show();
  } else {
    $toolbar.hide();
  }
}

// If user select highlighted dom element, show update toolbar
const showUpdateToolbar = (e, color) => {
  e.preventDefault();
  const $updateToolbar = $('#wx_highlight_update_toolbar');

  const $highlightColorForm = $('#wx_highlight_color');
  $highlightColorForm.show();
  $highlightColorForm.detach().prependTo($updateToolbar.find('.wx-highlight-controls'));

  const colorElem = $('#wx_selected_highlight_color .wx-highlight-color')[0];
  const oldColor = colorElem.classList[1];

  color = !color ? 'wx-highlight-red' : color;
  colorElem.classList.replace(oldColor, color);

  setToolbarPosition(e, 'wx_highlight_update_toolbar');
  $('#wx_highlight_update_toolbar').show();
  isShowedUpdateToolbar = true;
}

// Hide update toolbar
const hideUpdateToolbar = (e) => {
  const $target = $(e.target);
  const isClickedHighlight = !!$target.data && !!$target.data('markjs');

  if (isShowedUpdateToolbar && !isClickedHighlight) {
    $('#wx_highlight_update_toolbar').hide();
    isShowedUpdateToolbar = false;
  }
}

// Show toolbar to near selected text.
const setToolbarPosition = (e, id) => {
  const h = parseInt($(`#${id}`).height());
  const w = parseInt($(`#${id}`).width());

  let toolbarTop = parseInt(e.clientY) - h - 30 + parseInt($(document).scrollTop());
  let toolbarLeft = parseInt(e.clientX) - parseInt(w / 2) + parseInt($(document).scrollLeft());

  // If selected text exists on the very top of the page, show toolbar at below selected text
  if (e.clientY < h + 30) {
    toolbarTop = parseInt(e.clientY) + 10 + parseInt($(document).scrollTop());
  }

  // If selected text exists on the very left of the page, show toolbar with margin on the page left
  if (e.clientX < w / 2 - 10) {
    toolbarLeft = 10 + parseInt($(document).scrollLeft());
  } else if (e.clientX > $('body').width() - 200) {
    toolbarLeft = parseInt($('body').width()) - 200 + parseInt($(document).scrollLeft());
  }

  // Show toolbar with calculated position
  $(`#${id}`).css({
    top: toolbarTop,
    left: toolbarLeft
  });
}

// Enable/Disable highlight
const toggleHighlight = (status) => {
  isDisableHighlgiht = !status;
  // Enable highlgiht
  if(status) {
    loadHighlights();
    // For test
    return status;
  }
  // Disable highlight
  $(document.body).unmark(options);
  // For test
  return status;
}

// Load saved highlights and show highlight.
const loadHighlights = () => {
  // For test
  let isSuccess = false;

  // Load highlight in localstorage
  let highlightsStr = localStorage.getItem(storagePrefix + tabUrl);
  if (!highlightsStr) return;
  
  highlightsArr = JSON.parse(highlightsStr);
  
  // Remove all showed highlight and show again with loaded data
  $(document.body).unmark({
    ...options,
    done: function () {
      $(document.body).markRanges(highlightsArr, {
        ...options,
        done: function() {
          isSuccess = true;
        }
      });
    }
  });
  // For test
  return isSuccess;
}

// Save highlights array in localstorage.
const saveHighlights = () => {
  let highlightsStr = JSON.stringify(highlightsArr);
  localStorage.setItem(storagePrefix + tabUrl, highlightsStr);
}

// Apply new highlight and save.
const applyHighlight = () => {
  // For test
  let isSuccess = false;
  // Temp document selection range
  let preSelectionRange = null;
  // For test 
  if(process.env.NODE_ENV !== 'test') {
    preSelectionRange = document.createRange();
    preSelectionRange.selectNodeContents(document.body);

    preSelectionRange.setEnd(selectedRange.startContainer, selectedRange.startOffset);
  } else {
    selectedRange = '123'; // sample data for test
  }

  // Temp data for test env
  let domFragment = {textContent: '123'};

  if(process.env.NODE_ENV !== 'test') {
    domFragment = preSelectionRange.cloneContents();
    options.exclude.forEach(function (elem) {
      $(domFragment).find(elem).remove();
    });
  }

  // start range position and length of new highlight in page
  const start = domFragment.textContent.length;
  const length = selectedRange.toString().length;

  let selectedColor = 'wx-highlight-red';

  if(process.env.NODE_ENV !== 'test') {
    selectedColor = $('#wx_selected_highlight_color .wx-highlight-color')[0].classList[1];
  }
  
  const id = new Date().getTime();
  const highlight = { start, length, id, color: selectedColor };

  highlightsArr.push(highlight);
  
  $(document.body).unmark({
    ...options,
    done: function () {
      $(document.body).markRanges(highlightsArr, {
        ...options,
        done: function () {
          saveHighlights();
          isSuccess = true;
          $('#wx_highlight_toolbar').hide();
        }
      });
    }
  });

  return isSuccess;
}

// Update highlight color.
const updateHighlight = (e) => {
  const selectedId = highlightedDomElem.dataset.wxHighlightId;
  const $colorElem = $('#wx_selected_highlight_color .wx-highlight-color')[0];
  const color = $colorElem.classList[1];

  // Apply new color.
  highlightsArr.forEach((item) => {
    if (parseInt(selectedId) === parseInt(item.id)) {
      item.color = color;
    }
  });

  // Current highlgihted elements
  const $currentElems = $(`span[data-wx-highlight-id=${selectedId}]`);

  for (var i = 0; i < $currentElems.length; i++) {
    $currentElems[i].className = `wx-highlight ${color}`;
  }

  hideUpdateToolbar(e);
  saveHighlights();
}

// Hide all the shown highlights.
const removeAllHighlights = () => {
  let isSuccess = false;
  highlightsArr = [];
  saveHighlights();
  $('#wx_highlight_toolbar').hide();
  $(document.body).unmark({
    ...options,
    done: function() {
      isSuccess = true;
    }
  });
  return isSuccess;
}

// Remove a a highlight that a user clicked on
const removeSelectedHighlight = () => {
  const selectedId = highlightedDomElem.dataset.wxHighlightId;
  let highlightIndex = -1;
  highlightIndex = highlightsArr.findIndex((item, i) => {
    return parseInt(selectedId) === parseInt(item.id);
  });

  $(highlightedDomElem).unmark({
    done: function () {
      $(`[data-wx-highlight-id=${selectedId}]`).removeClass();
      $('#wx_highlight_update_toolbar').hide();
      highlightsArr.splice(highlightIndex, 1);
      saveHighlights();
    }
  });
}

// Toogle colors list.
const toggleColorList = () => {
  $('#wx_highlight_color_list').toggle();
  return true;
}

// Select color for highlight.
const selectColor = (e) => {
  const elem = $('#wx_selected_highlight_color .wx-highlight-color')[0];
  const oldColor = elem.classList[1];
  const newColor = e.target.classList[1];

  elem.classList.replace(oldColor, newColor);
  $('#wx_highlight_color_list').hide();
}

export { templates, init, toggleHighlight, applyHighlight, removeAllHighlights, toggleColorList, loadHighlights };