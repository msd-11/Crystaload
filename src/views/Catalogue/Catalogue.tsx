import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { db } from '../../database/db';
import Game from '../../interfaces/Game';
import GameService from '../../services/Game.service';
import GameDetail from '../GameDetail/GameDetail';
import AppBar from './components/AppBar';
import GameCard from './components/GameCard';

interface IProps {}

const Catalogue: React.FC = () => {
  const { isLoading, error, data } = useQuery('games', async () => {
    const res = await GameService.getAllGames();

    try {
      const updateDatabase = await db.games.bulkPut(res.data);
    } catch (e: any) {
      console.log(e);
    }
    console.log(res.data);
    return res.data;
  });

  const [visibleItems, setVisibleItems] = useState(40);
  const [searchedGames, setSearchedGames] = useState<Game[]>([]);

  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollTop + windowHeight >= documentHeight - 100) {
      setVisibleItems(visibleItems + 30);
    }
  }, [visibleItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isLoading ? (
    <div>
      <p>loading</p>
    </div>
  ) : (
    <div>
      <AppBar setSearchedGames={setSearchedGames} />
      <div className="bg-[#17181B] p-2 pt-12">
        <div className="flex flex-wrap justify-start">
          {searchedGames.length === 0
            ? data
                .slice(0, visibleItems)
                .map((game: Game) => <GameCard game={game} key={game._id} />)
            : searchedGames
                .slice(0, visibleItems)
                .map((game: Game) => <GameCard game={game} key={game._id} />)}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
