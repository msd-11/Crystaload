import { useEffect, useState } from 'react';

interface IProps {
  progress: number;
}

const ProgressBar: React.FC<IProps> = ({ progress }) => {
  const styleRoot = `flex bg-gradient-to-r from-cyan-500 to-indigo-500 h-3 z-2 justify-center rounded-full items-center`;

  const styleTest = { width: `${progress}%` };
  return (
    <div className="flex relative w-full h-3 bg-[#2A2B30] z-50 rounded-full ">
      <div className={styleRoot} style={styleTest}></div>
    </div>
  );
};

export default ProgressBar;
