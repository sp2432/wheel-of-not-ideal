
import React from 'react';

interface ControlsProps {
  newItem: string;
  onNewItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddItem: () => void;
  removedItems: string[];
  onReset: () => void;
  onClearAll: () => void;
}

const Controls: React.FC<ControlsProps> = ({ newItem, onNewItemChange, onAddItem, removedItems, onReset, onClearAll }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddItem();
    }
  }
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Add Options</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={onNewItemChange}
            onKeyPress={handleKeyPress}
            placeholder="Add items (e.g. Beer, Vodka*3, Rum)"
            className="flex-grow bg-gray-700 text-white placeholder-gray-500 rounded-md p-3 border-2 border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
          />
          <button
            onClick={onAddItem}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500"
            disabled={!newItem.trim()}
          >
            Add
          </button>
        </div>
      </div>
      
      {removedItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-pink-300">Selected Items</h3>
          <div className="bg-gray-700 p-3 rounded-md max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {removedItems.map((item, index) => (
                <li key={index} className="text-gray-400 line-through">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
            onClick={onReset}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Reset Wheel
          </button>
        <button
            onClick={onClearAll}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Clear All
          </button>
      </div>
    </div>
  );
};

export default Controls;
