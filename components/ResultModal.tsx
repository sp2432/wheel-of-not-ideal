
import React from 'react';

interface ResultModalProps {
  winner: string | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full text-center transform transition-all duration-300 scale-95 animate-modal-pop-in">
        <h2 className="text-2xl font-bold text-gray-300 mb-2">The Wheel has Spoken!</h2>
        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6 break-words">
          {winner}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Okay
        </button>
      </div>
      <style>{`
        @keyframes modal-pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-modal-pop-in {
          animation: modal-pop-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultModal;
