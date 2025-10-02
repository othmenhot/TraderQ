import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MOCKED_PRICES, SYMBOLS } from '../lib/symbols';
import { updateTrade, closeTradeAndUpdateBalance, getUserTrades } from '../lib/firestoreService';
import { useAuth } from './useAuth';

const TradingContext = createContext();
export const useTradingContext = () => useContext(TradingContext);

export const TradingProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [prices, setPrices] = useState(MOCKED_PRICES);
  const [trades, setTrades] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserTrades(user.uid, setTrades);
      return () => unsubscribe();
    }
  }, [user]);

  const tradesRef = useRef(trades);
  useEffect(() => { tradesRef.current = trades; }, [trades]);

  const checkTrades = useCallback(async (newPrices) => {
    // ... (This logic is complex but remains unchanged)
  }, [user]);

  const simulatePriceChanges = useCallback(() => {
    const newPrices = {};
    setPrices(prevPrices => {
      const updatedPrices = { ...prevPrices };
      for (const symbol of SYMBOLS) {
        const lastPrice = updatedPrices[symbol];
        const changePercent = (Math.random() - 0.5) * 0.005;
        const newPrice = lastPrice * (1 + changePercent);
        updatedPrices[symbol] = newPrice;
        newPrices[symbol] = newPrice;
      }
      checkTrades(newPrices);
      return updatedPrices;
    });
  }, [checkTrades]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(simulatePriceChanges, 1500);
    return () => clearInterval(intervalRef.current);
  }, [simulatePriceChanges]);

  const metrics = useMemo(() => {
    const balance = userProfile?.simulation?.balance || 0;
    const leverage = userProfile?.simulation?.leverage || 100;
    const openPositions = trades.filter(t => t.status === 'open');
    const totalPnl = openPositions.reduce((acc, pos) => {
      const currentPrice = prices[pos.symbol] || pos.entryPrice;
      const pnl = (currentPrice - pos.entryPrice) * (pos.lots * 100) * (pos.action === 'SELL' ? -1 : 1);
      return acc + pnl;
    }, 0);
    const marginUsed = openPositions.reduce((acc, pos) => acc + (pos.margin || 0), 0);
    const equity = balance + totalPnl;
    const freeMargin = equity - marginUsed;
    return { balance, equity, marginUsed, freeMargin, totalPnl };
  }, [trades, prices, userProfile]);

  const value = { prices, trades, ...metrics };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};
