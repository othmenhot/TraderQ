import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLivePrices } from '../../hooks/useLivePrices';
import { executeTrade } from '../../lib/firestoreService';
import { SYMBOL_GROUPS } from '../../lib/symbols';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { toast } from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';

const formatSymbolForDisplay = (symbol) => (symbol ? (symbol.includes(':') ? symbol.split(':')[1] : symbol) : '');

const TradePanel = ({ selectedSymbol, onSymbolChange }) => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [lots, setLots] = useState(0.01);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("Stocks");
  const [orderType, setOrderType] = useState('Market');
  const [entryPrice, setEntryPrice] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const livePrices = useLivePrices();
  const portfolio = userProfile?.simulation || { balance: 0, positions: [], marginUsed: 0 };

  useEffect(() => {
    const symbolsInGroup = SYMBOL_GROUPS[selectedGroup];
    if (symbolsInGroup && !symbolsInGroup.includes(selectedSymbol)) {
      onSymbolChange(symbolsInGroup[0]);
    }
  }, [selectedGroup, selectedSymbol, onSymbolChange]);

  const totalPnl = useMemo(() => {
    if (!portfolio.positions || portfolio.positions.length === 0) return 0;
    return portfolio.positions.reduce((acc, pos) => {
      const currentPrice = livePrices[pos.symbol] || pos.entryPrice;
      const shares = pos.shares || pos.size;
      const pnl = (currentPrice - pos.entryPrice) * shares * (pos.action === 'SELL' ? -1 : 1);
      return acc + pnl;
    }, 0);
  }, [portfolio.positions, livePrices]);

  const equity = (portfolio.balance || 0) + totalPnl;
  const freeMargin = equity - (portfolio.marginUsed || 0);

  const handleLotChange = (amount) => setLots(prev => Math.max(0.01, parseFloat((prev + amount).toFixed(2))));

  const handleTrade = async (action) => {
    setIsLoading(true);
    try {
      const tradeDetails = { symbol: selectedSymbol, action, lots, orderType, tp: takeProfit ? parseFloat(takeProfit) : null, sl: stopLoss ? parseFloat(stopLoss) : null, entryPrice: orderType !== 'Market' ? parseFloat(entryPrice) : null };
      await executeTrade(user.uid, tradeDetails);
      await refreshUserProfile();
      toast.success(`${orderType} order executed!`);
      setTakeProfit('');
      setStopLoss('');
      setEntryPrice('');
    } catch (error) {
      toast.error(error.message || "Trade failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return <Card className="h-full flex items-center justify-center"><p>Loading portfolio...</p></Card>;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow space-y-4 overflow-y-auto p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Balance:</span><span>${(portfolio.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Equity:</span><span>${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Used Margin:</span><span>${(portfolio.marginUsed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Free Margin:</span><span>${freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Total P&L:</span>
            <span className={totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}>${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary p-1">
            {['Market', 'Limit', 'Stop'].map(type => (
              <Button key={type} variant={orderType === type ? 'default' : 'ghost'} size="sm" onClick={() => setOrderType(type)} className="text-xs h-8">{type}</Button>
            ))}
          </div>
          <div className="space-y-2">
              <div><Label>Asset Class</Label><Select value={selectedGroup} onValueChange={setSelectedGroup}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.keys(SYMBOL_GROUPS).map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Symbol</Label><Select value={selectedSymbol} onValueChange={onSymbolChange}><SelectTrigger><SelectValue>{formatSymbolForDisplay(selectedSymbol)}</SelectValue></SelectTrigger><SelectContent>{SYMBOL_GROUPS[selectedGroup].map(symbol => <SelectItem key={symbol} value={symbol}>{formatSymbolForDisplay(symbol)}</SelectItem>)}</SelectContent></Select></div>
          </div>
          {orderType !== 'Market' && (
            <div><Label htmlFor="entryPrice">Entry Price</Label><Input id="entryPrice" type="number" placeholder="Trigger Price" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} /></div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="sl">Stop Loss</Label><Input id="sl" type="number" placeholder="Optional" value={stopLoss} onChange={e => setStopLoss(e.target.value)} /></div>
            <div><Label htmlFor="tp">Take Profit</Label><Input id="tp" type="number" placeholder="Optional" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} /></div>
          </div>
          <div>
              <Label htmlFor="lots">Lots</Label>
              <div className="flex items-center mt-1">
                  <Button size="icon" variant="outline" onClick={() => handleLotChange(-0.01)} disabled={isLoading}><Minus className="h-4 w-4"/></Button>
                  <Input id="lots" type="number" value={lots} onChange={(e) => setLots(parseFloat(e.target.value) || 0.01)} className="text-center" disabled={isLoading}/>
                  <Button size="icon" variant="outline" onClick={() => handleLotChange(0.01)} disabled={isLoading}><Plus className="h-4 w-4"/></Button>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleTrade('BUY')} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>{isLoading ? '...' : 'Buy'}</Button>
              <Button onClick={() => handleTrade('SELL')} className="bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>{isLoading ? '...' : 'Sell'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradePanel;
