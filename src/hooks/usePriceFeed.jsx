import React, { useState, useEffect, createContext, useContext } from 'react';
import { MOCKED_PRICES } from '../lib/symbols';

const PriceFeedContext = createContext();

export const PriceFeedProvider = ({ children }) => {
  const [livePrices, setLivePrices] = useState(MOCKED_PRICES);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(currentPrices => {
        const newPrices = { ...currentPrices };
        for (const symbol in newPrices) {
          const oldPrice = newPrices[symbol];
          // Create a small random fluctuation (e.g., +/- 0.5%)
          const fluctuation = oldPrice * (Math.random() - 0.5) * 0.005;
          newPrices[symbol] = Math.max(0, oldPrice + fluctuation);
        }
        return newPrices;
      });
    }, 2000); // Update prices every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <PriceFeedContext.Provider value={livePrices}>
      {children}
    </PriceFeedContext.Provider>
  );
};

export const usePriceFeed = () => {
  return useContext(PriceFeedContext);
};
