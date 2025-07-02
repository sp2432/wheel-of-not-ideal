
import React, { useState, useCallback } from 'react';
import Wheel from './components/Wheel';
import Controls from './components/Controls';
import ResultModal from './components/ResultModal';

const INITIAL_ITEMS = [
  "Driver", "Wood", "Hybrid", "4 Iron", "5 Iron", "6 Iron", 
  "7 Iron", "8 Iron", "9 Iron", "Wedge", "Sand Wedge", "Gap Wedge", "Putter"
];

const App: React.FC = () => {
  const [items, setItems] = useState<string[]>(INITIAL_ITEMS);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [newItem, setNewItem] = useState<string>('');
  
  const handleAddItem = () => {
    const itemsToAdd = newItem
      .split(',')
      .map(item => item.trim())
      .filter(item => item)
      .flatMap(entry => {
        const multiplierRegex = /^(.*?)\s*\*\s*(\d+)$/;
        const match = entry.match(multiplierRegex);
        
        if (match) {
          const name = match[1].trim();
          const count = parseInt(match[2], 10);
          
          if (name && !isNaN(count) && count > 0) {
            return Array(count).fill(name);
          }
        }
        
        return [entry];
      });

    if (itemsToAdd.length > 0) {
      setItems(prevItems => [...prevItems, ...itemsToAdd]);
      setNewItem('');
    }
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setRemovedItems([]);
  };

  const handleClearAll = () => {
    setItems([]);
    setRemovedItems([]);
  };
  
  const handleSpinClick = useCallback(() => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    const winnerIndex = Math.floor(Math.random() * items.length);
    const winnerItem = items[winnerIndex];

    const degreesPerItem = 360 / items.length;
    const winnerAngle = winnerIndex * degreesPerItem + degreesPerItem / 2;

    const randomOffset = Math.random() * degreesPerItem * 0.8 - (degreesPerItem * 0.4);
    const targetRotation = 360 - winnerAngle + randomOffset;
    
    const extraRotations = 5 * 360;
    const newRotation = rotation + extraRotations + targetRotation - (rotation % 360);

    setRotation(newRotation);

    setTimeout(() => {
      setWinner(winnerItem);
    }, 5000); // Corresponds to animation duration in Wheel.tsx
  }, [isSpinning, items, rotation]);

  const closeModalAndRemoveItem = () => {
    if (!winner) return;
    
    setItems(prevItems => {
      const indexToRemove = prevItems.indexOf(winner);
      if (indexToRemove > -1) {
        // Create a new array by slicing around the index to remove just one item
        return [...prevItems.slice(0, indexToRemove), ...prevItems.slice(indexToRemove + 1)];
      }
      return prevItems; // Should not happen if winner is valid, but good for safety
    });

    setRemovedItems(prev => [...prev, winner]);
    setWinner(null);
    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Wheel of Not Ideal
        </h1>
        <p className="text-gray-400 mt-2">Spin the wheel, embrace the chaos.</p>
      </header>
      
      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-7xl">
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Wheel 
            items={items}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpinClick={handleSpinClick}
          />
        </div>
        <div className="w-full lg:w-1/3">
           <Controls 
            newItem={newItem}
            onNewItemChange={(e) => setNewItem(e.target.value)}
            onAddItem={handleAddItem}
            removedItems={removedItems}
            onReset={handleReset}
            onClearAll={handleClearAll}
          />
        </div>
      </main>

      <ResultModal winner={winner} onClose={closeModalAndRemoveItem} />
    </div>
  );
};

export default App;
