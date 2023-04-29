"use strict";
exports.__esModule = true;
// @ts-ignore
var fs = require("fs");
// @ts-ignore
var torrentStream = require("torrent-stream");
var TorrentManager = /** @class */ (function () {
    function TorrentManager(mainWindow) {
        this.allTorrents = [];
        this.mainWindow = mainWindow;
    }
    TorrentManager.prototype.handlePauseTorrent = function (_event, torrent) {
        var currentTorrent = this.allTorrents.find(function (x) { return x.magnet_url === torrent.magnet_url; });
        if (currentTorrent.isPaused) {
            this.allTorrents
                .find(function (x) { return x.magnet_url === torrent.magnet_url; })
                .streams.map(function (value) {
                value.stream.pipe(value.writeStream);
                value.stream.resume();
            });
        }
        else {
            this.allTorrents
                .find(function (x) { return x.magnet_url === torrent.magnet_url; })
                .streams.map(function (value) {
                value.stream.unpipe(value.writeStream);
                value.stream.pause();
            });
        }
        currentTorrent.isPaused = !currentTorrent.isPaused;
    };
    TorrentManager.prototype.handleRemoveTorrent = function (_event, torrent) {
        this.allTorrents
            .find(function (x) { return x.magnet_url === torrent.magnet_url; })
            .streams.map(function (value) {
            value.stream.destroy();
        });
        this.allTorrents.splice(this.allTorrents.findIndex(function (x) { return x.magnet_url === torrent.magnet_url; }), 1);
    };
    TorrentManager.prototype.addTorrent = function (_event, value) {
        var _this = this;
        // 1. CREATE THE TORRENT ENGINE
        var engine = torrentStream(value.magnet_url, { path: value.path });
        // 2. ADD TO LIST OF TORRENT
        this.mainWindow.webContents.send('updateTorrents', [value]);
        this.allTorrents.push({
            magnet_url: value.magnet_url,
            isPaused: false,
            engine: engine,
            streams: []
        });
        // 3. START TORRENT ON READY
        engine.on('ready', function () {
            var totalDownloaded = 0;
            var totalLength = 0;
            engine.files.forEach(function (file) {
                totalLength += file.length;
                var stream = file.createReadStream();
                var writeStream = fs.createWriteStream(value.path + file.name);
                _this.allTorrents
                    .find(function (x) { return x.engine === engine; })
                    .streams.push({ stream: stream, writeStream: writeStream });
                stream.pipe(writeStream);
                stream.on('data', function (chunk) {
                    totalDownloaded += chunk.length;
                    var percent = ((totalDownloaded / totalLength) * 100).toFixed(2);
                    value.percent = percent;
                    if (_this.allTorrents.find(function (x) { return x.engine === engine; }).isPaused) {
                        stream.unpipe(writeStream);
                        stream.pause();
                    }
                    _this.mainWindow.webContents.send('updateTorrents', [value]);
                });
                stream.on('pause', function () {
                    console.log('paused');
                    console.log(stream.readableFlowing);
                });
            });
        });
        engine.on('idle', function () {
            console.log('Torrent download finished');
        });
        //      'magnet:?xt=urn:btih:d984f67af9917b214cd8b6048ab5624c7df6a07a&tr=https%3A%2F%2Facademictorrents.com%2Fannounce.php&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
        // TODO : ON PAUSE : DESTROY STREAM NSM
    };
    return TorrentManager;
}());
exports["default"] = TorrentManager;
