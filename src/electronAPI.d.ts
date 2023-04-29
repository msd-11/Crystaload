interface Window {
  electronAPI: {
    openFile: () => Promise<string>;
    addTorrent: (torrent: Torrent) => void;
    pauseTorrent: (torrent: Torrent) => void;
    removeTorrent: (torrent: Torrent) => void;
    onUpdateCounter: (
      callback: (event: Electron.IpcRendererEvent, arg: number) => void
    ) => void;
    onUpdateTorrents: (
      callback: (event: Electron.IpcRendererEvent, arg: Torrent[]) => void
    ) => void;
    // add more methods here as needed
  };
}
