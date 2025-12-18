
import React from 'react';
import { ImageHistoryItem } from '../types';

interface HistoryProps {
  history: ImageHistoryItem[];
  onSelect: (item: ImageHistoryItem) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
        <span role="img" aria-label="clock">🕰️</span> Magic History
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all shadow-sm hover:shadow-xl bg-white"
          >
            <img
              src={item.url}
              alt={item.prompt}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <p className="text-[10px] text-white truncate font-medium">
                {item.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;
