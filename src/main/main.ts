import {
  app,
  BrowserWindow,
  ipcMain,
  contextBridge,
  ipcRenderer,
  Menu,
} from 'electron';
import path = require('path');
import torrentStream = require('torrent-stream');
import fs = require('fs');
import { dirname } from 'path';
import TorrentManager from './manager/TorrentManager';
import Torrent from '../interfaces/Torrent';

var mainWindow: any;
var torrentManager: TorrentManager;

function createWindow() {
  console.log(__dirname);
  mainWindow = new BrowserWindow({
    title: 'Crystaload',
    autoHideMenuBar: true,
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    webPreferences: {
      preload: '/home/msd11/Projects/TorrentGame/Client/preload.js',
      nodeIntegration: true,
    },
    icon: '/home/msd11/Projects/TorrentGame/Client/src/assets/logo.png',
  });

  torrentManager = new TorrentManager(mainWindow);
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  ipcMain.on('pauseTorrent', (_event, value) =>
    torrentManager.handlePauseTorrent(_event, value)
  );
  ipcMain.on('removeTorrent', (_event, value) =>
    torrentManager.handleRemoveTorrent(_event, value)
  );

  ipcMain.on('addTorrent', (_event, value: Torrent) =>
    torrentManager.addTorrent(_event, value)
  );
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
