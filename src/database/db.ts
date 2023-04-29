import Dexie, { Table } from 'dexie';
import Game from '../interfaces/Game';
import Torrent from '../interfaces/Torrent';
import initDbService from './db.service';

export class MySubClassedDexie extends Dexie {
  games!: Table<Game>;
  torrents!: Table<Torrent>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      games: '++_id, title', // Primary key and indexed props
      torrents: '++magnet_url, title, magnet_url',
    });

    initDbService();
  }
}

export const db = new MySubClassedDexie();
