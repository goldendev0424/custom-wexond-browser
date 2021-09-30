if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install();
}

import { ipcMain, app, webContents } from 'electron';
import { platform } from 'os';
import { Application } from './application';

export const isNightly = app.name === 'wexond-nightly';

app.allowRendererProcessReuse = true;
app.name = isNightly ? 'Wexond Nightly' : 'Wexond';

(process.env as any)['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--enable-parallel-downloading');

if (process.env.NODE_ENV === 'development') {
  app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

ipcMain.setMaxListeners(0);

// app.setAsDefaultProtocolClient('http');
// app.setAsDefaultProtocolClient('https');

const application = Application.instance;
application.start();

process.on('uncaughtException', (error) => {
  console.error(error);
});

app.on('window-all-closed', () => {
  if (platform() !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('get-webcontents-id', (e) => {
  e.returnValue = e.sender.id;
});

// Created by @monkey
// Get side pane status(show/hide) latest
ipcMain.on('get-side-pane-status', async (e) => {
  const cookies = await application.sessions.view.cookies.get({name: 'wx_showed_side_pane'});
  let isShowedSidePane = false;
  let latest = 0;
  let index = -1;

  cookies.forEach((item, i) => {
    let value = JSON.parse(item.value);
    if(Number(value.time) > latest) {
      latest = value.time;
      index = i;
    }
  });

  if(index > -1) {
    isShowedSidePane = JSON.parse(cookies[index].value).isShowed;
  }
  
  e.returnValue = isShowedSidePane;
});

// Created by @monkey
// Set side pane status
ipcMain.on('set-side-pane-status', async (e, isShowed) => {
  let url = e.sender.getURL();
  let value = {isShowed, time: new Date().getTime()};
  
  await application.sessions.view.cookies.set({url, name: 'wx_showed_side_pane', value: JSON.stringify(value)});
  e.returnValue = isShowed;
});

ipcMain.on('get-window-id', (e) => {
  e.returnValue = (e.sender as any).windowId;
});

ipcMain.handle(
  `web-contents-call`,
  async (e, { webContentsId, method, args = [] }) => {
    const wc = webContents.fromId(webContentsId);
    const result = (wc as any)[method](...args);

    if (result) {
      if (result instanceof Promise) {
        return await result;
      }

      return result;
    }
  },
);
