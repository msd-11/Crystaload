import { Navigate, useNavigate } from 'react-router-dom';
import nocover from '../../../assets/nocover.png';
import { IoDownloadOutline } from 'react-icons/io5';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { db } from '../../../database/db';
import Game from '../../../interfaces/Game';

interface IProps {
  setSearchedGames: Dispatch<SetStateAction<Game[]>>;
}

const AppBar: React.FC<IProps> = ({ setSearchedGames }) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    navigate('download');
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    console.log(e.target[0].value);
    const searchGames = await db.games
      .filter(function (game) {
        const reg = `${e.target[0].value}`;
        return new RegExp(reg, 'i').test(game.title);
      })
      .toArray();
    setSearchedGames(searchGames);
    console.log(searchGames);
  };

  return (
    <div className="flex fixed z-50 w-full items-center bg-[#17181B] p-2 m-0 shadow-[0_0px_60px_15px_rgba(0,0,0,0.5)]">
      <p>Search</p>

      <form
        onSubmit={(e) => {
          handleSearch(e);
        }}
      >
        <input className="rounded ml-2" />
      </form>
      <div className="absolute right-5">
        <button onClick={() => handleDownload()}>
          <IoDownloadOutline
            className="text-gray-500 hover:text-white"
            size={24}
          />
        </button>
      </div>
    </div>
  );
};

export default AppBar;
