import axios from 'axios';
import { API_URL } from '../utils/constant';

class GameService {
  getAllGames() {
    return axios.get(API_URL + 'games');
  }
}

export default new GameService();
