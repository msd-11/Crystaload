import { Navigate, useNavigate } from 'react-router-dom';
import nocover from '../../../assets/nocover.png';

interface IProps {
  game: { title: string; cover_url: string };
}

const GameCard: React.FC<IProps> = ({ game }) => {
  const navigate = useNavigate();

  if (!game.cover_url) game.cover_url = nocover;

  const pageDetail = () => {
    navigate('/gameDetail', { state: game });
  };

  return (
    <div className="relative flex flex-col justify-around items-center w-44 h-72 ml-auto mr-auto p-2">
      <button
        className="absolute bottom-14 h-56 w-40 transition duration-200 rounded drop-shadow-[0_10px_10px_rgba(0,0,0,0.7)]  hover:shadow-[0_0px_0px_2px_rgba(45,117,223,1)] select-none"
        onClick={() => pageDetail()}
      >
        <img
          src={game.cover_url ? game.cover_url : game.cover_url}
          draggable={false}
          className="h-56 w-40 rounded hover:brightness-[0.65]"
        />
      </button>

      <div className="absolute top-[15rem] h-1">
        <p className="font-semibold select-none w-40 text-[0.82rem] truncate">
          {game.title}
        </p>
        <p className="text-[0.7rem] text-gray-500 select-none">2023</p>
      </div>
    </div>
  );
};

export default GameCard;
