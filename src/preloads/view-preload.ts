import { ipcRenderer, webFrame } from 'electron';

import AutoComplete from './models/auto-complete';
import { getTheme } from '~/utils/themes';
import { ERROR_PROTOCOL, WEBUI_BASE_URL } from '~/constants/files';
import { injectChromeWebstoreInstallButton } from './chrome-webstore';

const tabId = ipcRenderer.sendSync('get-webcontents-id');

export const windowId: number = ipcRenderer.sendSync('get-window-id');

const goBack = () => {
  ipcRenderer.invoke(`web-contents-call`, {
    webContentsId: tabId,
    method: 'goBack',
  });
};

const goForward = () => {
  ipcRenderer.invoke(`web-contents-call`, {
    webContentsId: tabId,
    method: 'goForward',
  });
};

window.addEventListener('mouseup', (e) => {
  if (e.button === 3) {
    e.preventDefault();
    goBack();
  } else if (e.button === 4) {
    e.preventDefault();
    goForward();
  }
});

// Created by @monkey
// Get/set side pane status for across tab.
// Local Storage is domain based. Can’t read or write from localstorage that’s on different domain even on it's subdomain.
// Wexond browser can access to all opened tabs(domain) localstorage
// So save sidepane status and changed *TIME* in localstorage of loaded tab(domain)
// and get latest sidepane status in local storage of all opened tabs(domain).
const sidePane = (type: string, isShowed: boolean) => {
  switch (type) {
    case 'get':
      return ipcRenderer.sendSync('get-side-pane-status');
    case 'set':
      return ipcRenderer.sendSync('set-side-pane-status', isShowed);
    default:
      return false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});

// Add left side pane to loaded page content.
const init = () => {
  const leftSidePane = require('./extensions/left-side-pane');
  
  // Add html
  addHtml(leftSidePane.templates.html);
  
  // Add style
  addStyle(leftSidePane.templates.style);
  
  leftSidePane.init(sidePane);
}

/**
 * Add html in page
 * @param html string|array
 */
const addHtml = (html: any) => {
  if(!Array.isArray(html)) {
    html = [html];
  }

  html.forEach((str: string = '') => {
    let elem = document.createElement('div');
    elem.innerHTML = str;
    document.body.appendChild(elem);
  });
}
/**
 * Add css in page
 * @param style string|array of string
 */
const addStyle = (style: any) => {
  if(!Array.isArray(style)) {
    style = [style];
  }

  style.forEach((item: string = '') => {
    let elem = document.createElement('style');
    elem.innerHTML = item;
    document.body.appendChild(elem);
  });
}





let beginningScrollLeft: number = null;
let beginningScrollRight: number = null;
let horizontalMouseMove = 0;
let verticalMouseMove = 0;

const resetCounters = () => {
  beginningScrollLeft = null;
  beginningScrollRight = null;
  horizontalMouseMove = 0;
  verticalMouseMove = 0;
};

function getScrollStartPoint(x: number, y: number) {
  let left = 0;
  let right = 0;

  let n = document.elementFromPoint(x, y);

  while (n) {
    if (n.scrollLeft !== undefined) {
      left = Math.max(left, n.scrollLeft);
      right = Math.max(right, n.scrollWidth - n.clientWidth - n.scrollLeft);
    }
    n = n.parentElement;
  }
  return { left, right };
}

document.addEventListener('wheel', (e) => {
  verticalMouseMove += e.deltaY;
  horizontalMouseMove += e.deltaX;

  if (beginningScrollLeft === null || beginningScrollRight === null) {
    const result = getScrollStartPoint(e.deltaX, e.deltaY);
    beginningScrollLeft = result.left;
    beginningScrollRight = result.right;
  }
});

ipcRenderer.on('scroll-touch-end', () => {
  if (
    horizontalMouseMove - beginningScrollRight > 150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollRight < 10) {
      goForward();
    }
  }

  if (
    horizontalMouseMove + beginningScrollLeft < -150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollLeft < 10) {
      goBack();
    }
  }

  resetCounters();
});

if (process.env.ENABLE_AUTOFILL) {
  window.addEventListener('load', AutoComplete.loadForms);
  window.addEventListener('mousedown', AutoComplete.onWindowMouseDown);
}

const postMsg = (data: any, res: any) => {
  window.postMessage(
    {
      id: data.id,
      result: res,
      type: 'result',
    },
    '*',
  );
};

const hostname = window.location.href.substr(WEBUI_BASE_URL.length);

if (
  process.env.ENABLE_EXTENSIONS &&
  window.location.host === 'chrome.google.com'
) {
  injectChromeWebstoreInstallButton();
}

const settings = ipcRenderer.sendSync('get-settings-sync');
if (
  window.location.href.startsWith(WEBUI_BASE_URL) ||
  window.location.protocol === `${ERROR_PROTOCOL}:`
) {
  (async function () {
    const w = await webFrame.executeJavaScript('window');
    w.settings = settings;
    w.require = (id: string) => {
      if (id === 'electron') {
        return { ipcRenderer };
      }
      return undefined;
    };

    if (window.location.pathname.startsWith('//network-error')) {
      w.theme = getTheme(w.settings.theme);
      w.errorURL = await ipcRenderer.invoke(`get-error-url-${tabId}`);
    } else if (hostname.startsWith('history')) {
      w.getHistory = async () => {
        return await ipcRenderer.invoke(`history-get`);
      };
      w.removeHistory = (ids: string[]) => {
        ipcRenderer.send(`history-remove`, ids);
      };
    } else if (hostname.startsWith('newtab')) {
      w.getTopSites = async (count: number) => {
        return await ipcRenderer.invoke(`topsites-get`, count);
      };
    }
  })();
} else {
  (async function () {
    if (settings.doNotTrack) {
      const w = await webFrame.executeJavaScript('window');
      Object.defineProperty(w.navigator, 'doNotTrack', { value: 1 });
    }
  })();
}

if (window.location.href.startsWith(WEBUI_BASE_URL)) {
  window.addEventListener('DOMContentLoaded', () => {
    if (hostname.startsWith('settings')) document.title = 'Settings';
    else if (hostname.startsWith('history')) document.title = 'History';
    else if (hostname.startsWith('bookmarks')) document.title = 'Bookmarks';
    else if (hostname.startsWith('extensions')) document.title = 'Extensions';
    else if (hostname.startsWith('newtab')) {
      document.title = 'New tab';
    }
  });

  window.addEventListener('message', async ({ data }) => {
    if (data.type === 'storage') {
      const res = await ipcRenderer.invoke(`storage-${data.operation}`, {
        scope: data.scope,
        ...data.data,
      });

      postMsg(data, res);
    } else if (data.type === 'credentials-get-password') {
      const res = await ipcRenderer.invoke(
        'credentials-get-password',
        data.data,
      );
      postMsg(data, res);
    } else if (data.type === 'save-settings') {
      ipcRenderer.send('save-settings', { settings: data.data });
    }
  });

  ipcRenderer.on('update-settings', async (e, data) => {
    const w = await webFrame.executeJavaScript('window');
    if (w.updateSettings) {
      w.updateSettings(data);
    }
  });

  ipcRenderer.on('credentials-insert', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-insert',
        data,
      },
      '*',
    );
  });

  ipcRenderer.on('credentials-update', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-update',
        data,
      },
      '*',
    );
  });

  ipcRenderer.on('credentials-remove', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-remove',
        data,
      },
      '*',
    );
  });
}
