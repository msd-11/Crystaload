"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var TorrentManager_1 = require("./manager/TorrentManager");
var mainWindow;
var torrentManager;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 1000,
        minHeight: 800,
        webPreferences: {
            preload: '/home/msd11/Projects/TorrentGame/Client/preload.js',
            nodeIntegration: true
        }
    });
    torrentManager = new TorrentManager_1["default"](mainWindow);
    mainWindow.loadURL('http://localhost:5173');
}
electron_1.app.whenReady().then(function () {
    electron_1.ipcMain.on('pauseTorrent', function (_event, value) {
        return torrentManager.handlePauseTorrent(_event, value);
    });
    electron_1.ipcMain.on('removeTorrent', function (_event, value) {
        return torrentManager.handleRemoveTorrent(_event, value);
    });
    electron_1.ipcMain.on('addTorrent', function (_event, value) {
        return torrentManager.addTorrent(_event, value);
    });
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
