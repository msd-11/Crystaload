import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../database/db';
import Torrent from '../../interfaces/Torrent';
import ProgressBar from '../../components/ProgressBar';
import {
  IoPlaySharp,
  IoPauseSharp,
  IoTrashSharp,
  IoPause,
  IoClose,
} from 'react-icons/io5';

interface IProps {}

const Download: React.FC = () => {
  const navigate = useNavigate();
  const [torrents, setTorrents] = useState<Torrent[]>([]);

  const removeTorrent = async (value: Torrent) => {
    db.torrents.delete(value.magnet_url);
    window.electronAPI.removeTorrent(value);
    const torrentsUpdate = await db.torrents.toArray();
    setTorrents(torrentsUpdate);
  };

  const pauseTorrent = async (value: Torrent) => {
    window.electronAPI.pauseTorrent(value);
    db.torrents.update(value, { isPaused: !value.isPaused });
    const torrentsUpdate = await db.torrents.toArray();
    setTorrents(torrentsUpdate);
  };

  useEffect(() => {
    db.torrents
      .toArray()
      .then((value) => {
        setTorrents(value);
      })
      .catch((e: any) => {
        console.log(e);
      });

    const fetchTorrents = async () => {
      const torrentsUpdate = await db.torrents.toArray();
      setTorrents(torrentsUpdate);
    };

    db.torrents.hook('updating', fetchTorrents);
    return () => {
      db.torrents.hook('updating').unsubscribe(fetchTorrents);
    };
  }, []);

  return (
    <div className="pt-8 bg-[#17181B] h-screen">
      <button className="absolute top-2 right-5" onClick={() => navigate(-1)}>
        <IoClose size={25} />
      </button>

      {torrents.map((value: any) => {
        return (
          <div className="m-2 p-2 rounded bg-[#1F2025] pb-4 mb-4">
            <div className="relative flex flex-col pt-2">
              <p className="absolute top-1 left-10 w-[80vw] truncate text-[#8D9296]">
                {value.title}
              </p>
              <div className="relative w-full pt-6">
                <div className="flex justify-center items-center">
                  <button className="mx-2" onClick={() => pauseTorrent(value)}>
                    {value.isPaused ? (
                      <IoPlaySharp size={22} className="text-[#8D9296]" />
                    ) : (
                      <IoPauseSharp size={22} className="text-[#8D9296]" />
                    )}
                  </button>

                  <ProgressBar progress={value.percent} />
                  <button className="mx-2" onClick={() => removeTorrent(value)}>
                    <IoTrashSharp size={22} className="text-[#8D9296]" />
                  </button>
                </div>
                <p className="absolute top-0 right-10 text-[#8D9296]">
                  {value.percent.toString()}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Download;
