import Torrent from '../interfaces/Torrent';
import { db } from './db';

const initDbService = () => {
  window.electronAPI.onUpdateCounter((_event, value) => {
    console.log('oui');
  });

  window.electronAPI.onUpdateTorrents(async (_event, value: Torrent[]) => {
    try {
      await db.torrents.bulkPut(value);
    } catch (e: any) {
      console.log(e);
    }
  });
};

export default initDbService;
