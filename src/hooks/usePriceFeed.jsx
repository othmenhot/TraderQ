import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MOCKED_PRICES, SYMBOLS } from '../lib/symbols';
import { updateTrade, closeTradeAndUpdateBalance } from '../lib/firestoreService';

const PriceFeedContext = createContext();

export const usePriceFeed = () => useContext(PriceFeedContext);

export const PriceFeedProvider = ({ children, user, trades }) => {
  const [prices, setPrices] = useState(MOCKED_PRICES);
  const intervalRef = useRef(null);

  // Use a ref to hold trades to avoid re-creating intervals when trades change
  const tradesRef = useRef(trades);
  useEffect(() => {
    tradesRef.current = trades;
  }, [trades]);

  const checkTrades = useCallback(async (newPrices) => {
    if (!user || !tradesRef.current || tradesRef.current.length === 0) {
      return;
    }

    const openPositions = tradesRef.current.filter(t => t.status === 'open');
    const pendingOrders = tradesRef.current.filter(t => t.status === 'pending');

    for (const order of pendingOrders) {
      const currentPrice = newPrices[order.symbol];
      if (!currentPrice) continue;

      const shouldActivate = (order.action === 'BUY' && currentPrice >= order.entryPrice) || 
                             (order.action === 'SELL' && currentPrice <= order.entryPrice);
      
      if (shouldActivate) {
        console.log(`Activating pending order ${order.id}`);
        await updateTrade(order.id, { status: 'open' });
      }
    }

    for (const pos of openPositions) {
      const currentPrice = newPrices[pos.symbol];
      if (!currentPrice) continue;

      const pnl = (currentPrice - pos.entryPrice) * (pos.lots * 100) * (pos.action === 'SELL' ? -1 : 1);
      
      const slHit = pos.sl && ((pos.action === 'BUY' && currentPrice <= pos.sl) || (pos.action === 'SELL' && currentPrice >= pos.sl));
      const tpHit = pos.tp && ((pos.action === 'BUY' && currentPrice >= pos.tp) || (pos.action === 'SELL' && currentPrice <= pos.tp));

      if (slHit || tpHit) {
        console.log(`Closing position ${pos.id} due to ${slHit ? 'Stop Loss' : 'Take Profit'}`);
        await closeTradeAndUpdateBalance(user.uid, pos, currentPrice, pnl);
      }
    }
  }, [user]);

  const simulatePriceChanges = useCallback(() => {
    setPrices(prevPrices => {
      const newPrices = { ...prevPrices };
      SYMBOLS.forEach(symbol => {
        const currentPrice = newPrices[symbol] || 100;
        const changePercent = (Math.random() - 0.5) * 0.005; // +/- 0.25%
        newPrices[symbol] = currentPrice * (1 + changePercent);
      });
      checkTrades(newPrices); // Check trades with the new prices
      return newPrices;
    });
  }, [checkTrades]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(simulatePriceChanges, 1500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [simulatePriceChanges]);

  const value = { prices };

  return (
    <PriceFeedContext.Provider value={value}>
      {children}
    </PriceFeedContext.Provider>
  );
};
