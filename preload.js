const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  addTorrent: (torrent) => ipcRenderer.send('addTorrent', torrent),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
  onUpdateTorrents: (callback) => ipcRenderer.on('updateTorrents', callback),
  pauseTorrent: (torrent) => ipcRenderer.send('pauseTorrent', torrent),
  removeTorrent: (torrent) => ipcRenderer.send('removeTorrent', torrent),
});
