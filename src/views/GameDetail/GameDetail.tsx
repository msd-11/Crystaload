import { useLocation, useNavigate } from 'react-router-dom';
import Game from '../../interfaces/Game';
import { IoClose } from 'react-icons/io5';
import { channels } from '../../shared/constants';
import { useState } from 'react';
import Torrent from '../../interfaces/Torrent';
import { db } from '../../database/db';
import fs from 'fs';

interface IProps {
  game: Game;
}

const GameDetail: React.FC = () => {
  const navigate = useNavigate();
  let game = useLocation().state as Game;

  const [progress, setProgress] = useState(0.0);

  console.log(game);

  window.electronAPI.onUpdateCounter((_event, value) => {
    setProgress(value);
  });

  const onDownload = async () => {
    try {
      const torrentGame: Torrent = {
        title: game.title,
        magnet_url: game.magnet_urls[0].url,
        path: '/home/msd11/Downloads/',
        percent: 0.0,
        isPaused: false,
      };

      window.electronAPI.addTorrent(torrentGame);
      navigate('/download');
    } catch (e: any) {
      console.log(e);
    }
  };

  const styleRoot = `h-full w-full absolute -z-50 bg-[url('${game.cover_url}')] bg-cover blur-xl brightness-[0.28] bg-center`;
  const styleTest = { backgroundImage: `url('${game.cover_url}')` };
  return (
    <div className={'flex h-full w-full'}>
      <div className={styleRoot} style={styleTest}></div>

      <img
        src={game.cover_url}
        draggable={false}
        className="h-[70vh] mt-14 ml-12 rounded"
      />
      <div className="flex flex-col ml-4 mt-14 mr-4">
        <p className="text-4xl font-bold select-none">{game.title}</p>
        <div className="flex flex-wrap mt-3">
          <p className="text-sm font-bold mr-1 select-none">Genre(s) : </p>
          {game.genres.map((value, index) => {
            if (index !== game.genres.length - 1)
              return (
                <p className="text-sm font-medium mr-1 truncate select-none">
                  {value.name} /
                </p>
              );
            else
              return (
                <p className="text-sm font-medium mr-1 truncate select-none">
                  {value.name}
                </p>
              );
          })}

          <p className="text-sm font-bold select-none mr-1">Rating : </p>
          <p className="text-sm font-medium mr-1 select-none">
            {game.rating === -1 ? 'Unknown' : `${game.rating}/100`}
          </p>
        </div>
        <div className="flex">
          <p className="text-sm font-bold mr-1 select-none">Companies : </p>
          {game.companies.map((value, index) => {
            if (index !== game.companies.length - 1)
              return (
                <p className="text-sm font-medium mr-1 truncate select-none">
                  {value.company.name} /
                </p>
              );
            else
              return (
                <p className="text-sm font-medium mr-1 truncate select-none">
                  {value.company.name}
                </p>
              );
          })}
        </div>
        <p className="text-sm mt-4 select-none">{game.description}</p>
        <p className="absolute top-[65vh]">Download progress : {progress}%</p>
        <div className="absolute top-[70vh] flex mt-5">
          <button
            onClick={() => onDownload()}
            className="bg-[#1F375F] px-4 py-2 text-sm rounded"
          >
            Download
          </button>
        </div>
      </div>

      <button className="absolute top-2 right-5" onClick={() => navigate(-1)}>
        <IoClose size={25} />
      </button>
    </div>
  );
};

export default GameDetail;
