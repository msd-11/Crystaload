export default interface Torrent {
  title: string;
  magnet_url: string;
  path: string;
  percent: number;
  isPaused: boolean;
}
