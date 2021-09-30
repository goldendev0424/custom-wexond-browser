/**
 * Left side pane
 */
import * as templates from './templates';

let articleParser = null;

if(process.env.NODE_ENV !== 'test') {
  const { extract } = require('../article-parser');
  articleParser = extract;
}

const highlight = require('../highlight');

let cloneDom = null;
let isShowed = false;
let isContentsShrink = false;
let isEnableHighlight = true;
let sidePaneCb = null;

const init = (cb) => {
  // Add highlight
  addHtml(highlight.templates.html);
  addStyle(highlight.templates.style);
  highlight.init();

  // Callback function for get left side pane status on other tabs
  sidePaneCb = cb;
}

// When user switches tab, stay side pane status(showen/hidden)
window.addEventListener('focus', () => {
  // Get latest sidepane status in all opened tabs
  let showed = sidePaneCb('get');
  isShowed = showed;
  toggleSidePane();
});

document.addEventListener('click',function(e){
  const target = e.target;
  if(!target) {
    return;
  }

  // Toggle side pane
  if(target.id == 'wx_left_side_toggle' || target.closest('#wx_left_side_toggle')) {
    isShowed = !isShowed;
    sidePaneCb('set', isShowed);
    toggleSidePane();
    return;
  }

  // Toggle contents shrink
  if(target.closest('#wx_contents_shrink')
      || (target.contains(document.querySelector('#wx_contents_shrink')))
          && target.className.includes('wx-left-side-item')) {
        
    toggleContentsShrink();
  }

  // Enable/Disable highlight
  if(target.closest('#wx_toggle_highlight')
      || (target.contains(document.querySelector('#wx_toggle_highlight')))
          && target.className.includes('wx-left-side-item')) {
        
    toggleHighlight();
  }
});

// Toggle side pane
const toggleSidePane = (showed = false) => {
  const sidePaneElem = document.querySelector('.wx-left-side-pane');
  const btnToggle = document.querySelector('#wx_left_side_toggle');

  if(process.env.NODE_ENV === 'test') {
    // for test
    return {isShowed: showed, success: true};
  }

  sidePaneElem.style.left = isShowed ? '0px' : '-200px';
  btnToggle.style.transform = isShowed ? 'rotateY(180deg)' : '';
  
}

// Toggle contents shrink
const toggleContentsShrink = (testData) => {
  isContentsShrink = !isContentsShrink;
  // For test
  if(process.env.NODE_ENV === 'test') {
    isContentsShrink = testData;
  }
   
  if(isContentsShrink) {
    shrinkContents();
  } else {
    unShrinkContents();
  }
  return isContentsShrink;
}

// Enable/Disable highlight
const toggleHighlight = () => {
  isEnableHighlight = !isEnableHighlight;
  highlight.toggleHighlight(isEnableHighlight);

  var btnHighlight = document.querySelector('#wx_toggle_highlight');
  var highlightIcon = document.querySelector('#wx_toggle_highlight svg');

  // If highlight toggle button or highlight icon is not exist, don't run. e.x in test env
  if(!btnHighlight || !highlightIcon) {
    return;
  }
  
  // Change highlight button style and title
  if(isEnableHighlight) {
    btnHighlight.title = 'Disable highlight';
    highlightIcon.style.opacity = 1;
  } else {
    btnHighlight.title = 'Enable highlight';
    highlightIcon.style.opacity = 0.3;
  }
}


/**
 * Enable contents shrink
 * 
 * @param {bool} isInit - If false, show side pane, else decision showable side pane
 */
const shrinkContents = (isInit = false) => {
  // Save original dom structure
  cloneDom = document.body.cloneNode(true);

  // Extract article
  articleParser(document.body.innerHTML).then((article) => {
    let content = article.content;
    document.body.innerHTML = content;
  }).then(() => {
    // Add left side pane to clean dom
    addHtml([templates.html, highlight.templates.html]);
    addStyle([templates.style, highlight.templates.style]);
    document.querySelector('#wx_contents_shrink').title = 'Disable contents shrinking';
    document.querySelector('#wx_contents_shrink .wx-collapse-arrow').style.display = 'none';
    document.querySelector('#wx_contents_shrink .wx-expand-arrow').style.display = 'inline';
    if(isInit) {
      let showed = sidePaneCb('get');
      isShowed = showed;
    } else {
      isShowed = true;
    }
    toggleSidePane();

    // Decision of whether to do highlight
    isEnableHighlight = !isEnableHighlight;
    toggleHighlight();
    if(isEnableHighlight) {
      highlight.init(isContentsShrink);
    }
  }).catch((err) => {
    console.log(err);
  });
}

// Disable contentx shrink
const unShrinkContents = () => {
  // For test
  if(process.env.NODE_ENV !== 'test') {
    document.body = cloneDom;
    document.querySelector('#wx_contents_shrink').title = 'Enable contents shrinking';

  }
  
  // Decision of whether to do highlight
  isEnableHighlight = !isEnableHighlight;
  toggleHighlight();

  if(isEnableHighlight) {
    highlight.init(isContentsShrink);
  }
  isShowed = true;
  toggleSidePane();
}

/**
 * Add html string in current dom
 * @param {string} html 
 */
const addHtml = (html) => {
  if(!Array.isArray(html)) {
    html = [html];
  }

  html.forEach((str) => {
    let elem = document.createElement('div');
    elem.innerHTML = str;
    document.body.append(elem);
  });
}

/**
 * Add style string in current dom
 * @param {string} style 
 */
const addStyle = (style) => {
  if(!Array.isArray(style)) {
    style = [style];
  }

  style.forEach((item) => {
    let elem = document.createElement('style');
    elem.innerHTML = item;
    document.body.appendChild(elem);
  });
}

/**
 * Javascript prototype
 * Check whether the argument is an element of array.
 * 
 * @param {string|number} v 
 * @returns 
 */
 Array.prototype.contains = function(v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

/**
 * Javascript prototype
 * Get unique in array.
 * 
 * @returns 
 */
Array.prototype.unique = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}

export { templates, init, toggleSidePane, toggleContentsShrink };