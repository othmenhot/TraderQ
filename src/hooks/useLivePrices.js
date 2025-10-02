import { useState, useEffect } from 'react';
import { MOCKED_PRICES } from '../lib/symbols';

export const useLivePrices = () => {
  const [livePrices, setLivePrices] = useState(MOCKED_PRICES);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(currentPrices => {
        const updatedPrices = { ...currentPrices };
        for (const symbol in updatedPrices) {
          const price = updatedPrices[symbol];
          const fluctuation = price * (Math.random() - 0.5) * 0.005; 
          updatedPrices[symbol] = Math.max(0, parseFloat((price + fluctuation).toFixed(4)));
        }
        return updatedPrices;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return livePrices;
};
