import { BrowserWindow } from 'electron';
// @ts-ignore
import fs = require('fs');
// @ts-ignore
import torrentStream = require('torrent-stream');

class TorrentManager {
  allTorrents: any[] = [];
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  handlePauseTorrent(_event: any, torrent: any) {
    var currentTorrent = this.allTorrents.find(
      (x) => x.magnet_url === torrent.magnet_url
    );

    if (currentTorrent.isPaused) {
      this.allTorrents
        .find((x) => x.magnet_url === torrent.magnet_url)
        .streams.map((value: any) => {
          value.stream.pipe(value.writeStream);
          value.stream.resume();
        });
    } else {
      this.allTorrents
        .find((x) => x.magnet_url === torrent.magnet_url)
        .streams.map((value: any) => {
          value.stream.unpipe(value.writeStream);
          value.stream.pause();
        });
    }

    currentTorrent.isPaused = !currentTorrent.isPaused;
  }

  handleRemoveTorrent(_event: any, torrent: any) {
    this.allTorrents
      .find((x) => x.magnet_url === torrent.magnet_url)
      .streams.map((value: any) => {
        value.stream.destroy();
      });

    this.allTorrents.splice(
      this.allTorrents.findIndex((x) => x.magnet_url === torrent.magnet_url),
      1
    );
  }

  addTorrent(_event: any, value: any) {
    // 1. CREATE THE TORRENT ENGINE
    var engine = torrentStream(value.magnet_url, { path: value.path });

    // 2. ADD TO LIST OF TORRENT
    this.mainWindow.webContents.send('updateTorrents', [value]);
    this.allTorrents.push({
      magnet_url: value.magnet_url,
      isPaused: false,
      engine: engine,
      streams: [],
    });

    // 3. START TORRENT ON READY
    engine.on('ready', () => {
      let totalDownloaded = 0;
      let totalLength = 0;

      engine.files.forEach((file: any) => {
        totalLength += file.length;

        const stream = file.createReadStream();
        const writeStream = fs.createWriteStream(value.path + file.name);

        this.allTorrents
          .find((x) => x.engine === engine)
          .streams.push({ stream: stream, writeStream: writeStream });

        stream.pipe(writeStream);

        stream.on('data', (chunk: any) => {
          totalDownloaded += chunk.length;
          const percent = ((totalDownloaded / totalLength) * 100).toFixed(2);
          value.percent = percent;

          if (this.allTorrents.find((x) => x.engine === engine).isPaused) {
            stream.unpipe(writeStream);
            stream.pause();
          }

          this.mainWindow.webContents.send('updateTorrents', [value]);
        });

        stream.on('pause', () => {
          console.log('paused');
          console.log(stream.readableFlowing);
        });
      });
    });
    engine.on('idle', () => {
      console.log('Torrent download finished');
    });

    //      'magnet:?xt=urn:btih:d984f67af9917b214cd8b6048ab5624c7df6a07a&tr=https%3A%2F%2Facademictorrents.com%2Fannounce.php&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',

    // TODO : ON PAUSE : DESTROY STREAM NSM
  }
}

export default TorrentManager;
