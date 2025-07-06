import React, { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Wheel from './components/Wheel';
import Controls from './components/Controls';
import ResultModal from './components/ResultModal';

const INITIAL_ITEMS = [
  "Driver", "Wood", "Hybrid", "4 Iron", "5 Iron", "6 Iron", 
  "7 Iron", "8 Iron", "9 Iron", "Wedge", "Sand Wedge", "Gap Wedge", "Putter"
];

interface Selection {
  item: string;
  wasRemoved: boolean;
}

const App: React.FC = () => {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const savedItems = localStorage.getItem('wheel-of-not-ideal-items');
      return savedItems ? JSON.parse(savedItems) : INITIAL_ITEMS;
    } catch (error) {
      console.error("Could not parse items from localStorage", error);
      return INITIAL_ITEMS;
    }
  });

  const [selectionHistory, setSelectionHistory] = useState<Selection[]>(() => {
    try {
      const savedHistory = localStorage.getItem('wheel-of-not-ideal-history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Could not parse history from localStorage", error);
      return [];
    }
  });

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [newItem, setNewItem] = useState<string>('');
  const [keepItemsOnWheel, setKeepItemsOnWheel] = useState<boolean>(false);
  
  useEffect(() => {
    localStorage.setItem('wheel-of-not-ideal-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('wheel-of-not-ideal-history', JSON.stringify(selectionHistory));
  }, [selectionHistory]);

  const handleAddItem = () => {
    const itemsToAdd = newItem
      .split(',')
      .map(item => item.trim())
      .filter(item => item); // filter out empty strings

    if (itemsToAdd.length > 0) {
      setItems(prevItems => [...prevItems, ...itemsToAdd]);
      setNewItem('');
    }
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setSelectionHistory([]);
  };

  const handleClearAll = () => {
    setItems([]);
    setSelectionHistory([]);
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
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 5000); // Corresponds to animation duration in Wheel.tsx
  }, [isSpinning, items, rotation]);

  const closeModalAndHandleResult = () => {
    if (!winner) return;

    const wasRemoved = !keepItemsOnWheel;
    setSelectionHistory(prev => [...prev, { item: winner, wasRemoved }]);

    if (wasRemoved) {
      setItems(prev => prev.filter(item => item !== winner));
    }
    
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
      
      <main className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-7xl">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Wheel 
            items={items}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpinClick={handleSpinClick}
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
           <Controls 
            newItem={newItem}
            onNewItemChange={(e) => setNewItem(e.target.value)}
            onAddItem={handleAddItem}
            selectionHistory={selectionHistory}
            onReset={handleReset}
            onClearAll={handleClearAll}
            keepItemsOnWheel={keepItemsOnWheel}
            onKeepItemsChange={(e) => setKeepItemsOnWheel(e.target.checked)}
          />
        </div>
      </main>

      <ResultModal winner={winner} onClose={closeModalAndHandleResult} />
    </div>
  );
};

export default App;