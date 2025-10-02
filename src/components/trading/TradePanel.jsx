import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTradingContext } from '../../hooks/useTradingContextProvider';
import { SYMBOL_GROUPS } from '../../lib/symbols';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { toast } from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';

const formatSymbolForDisplay = (symbol) => (symbol ? (symbol.includes(':') ? symbol.split(':')[1] : symbol) : '');

const TradePanel = ({ selectedSymbol, onSymbolChange, onPlaceOrder }) => {
  const { user, userProfile } = useAuth();
  const { prices, balance, equity, marginUsed, freeMargin, totalPnl } = useTradingContext();

  const [lots, setLots] = useState(0.01);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("Stocks");
  const [orderType, setOrderType] = useState('Market');
  const [entryPrice, setEntryPrice] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  
  const leverage = userProfile?.simulation?.leverage || 100;

  useEffect(() => {
    const symbolsInGroup = SYMBOL_GROUPS[selectedGroup];
    if (symbolsInGroup && !symbolsInGroup.includes(selectedSymbol)) {
      onSymbolChange(symbolsInGroup[0]);
    }
  }, [selectedGroup, selectedSymbol, onSymbolChange]);

  const currentMarketPrice = prices[selectedSymbol];
  const priceForCalc = orderType === 'Market' ? currentMarketPrice : parseFloat(entryPrice);

  const marginRequired = useMemo(() => {
    const lotsValue = parseFloat(lots);
    if (!priceForCalc || isNaN(lotsValue) || lotsValue < 0.01) return 0;
    const shares = lotsValue * 100;
    const positionValue = shares * priceForCalc;
    return positionValue / leverage;
  }, [lots, priceForCalc, leverage]);

  const canPlaceTrade = freeMargin >= marginRequired && parseFloat(lots) >= 0.01;

  const handleLotChange = (amount) => {
    setLots(prev => {
      const currentLots = parseFloat(prev);
      if (isNaN(currentLots)) return 0.01;
      const newLots = Math.max(0.01, currentLots + amount);
      return newLots.toFixed(2);
    });
  };

  const handleLotsInputBlur = () => {
    const lotsValue = parseFloat(lots);
    if (isNaN(lotsValue) || lotsValue < 0.01) {
      setLots(0.01);
    }
  };
  
  const handleTrade = async (action) => {
    const lotsValue = parseFloat(lots);
    if (isNaN(lotsValue) || lotsValue < 0.01) {
      toast.error("Lot size must be at least 0.01.");
      setLots(0.01);
      return;
    }
    if (!canPlaceTrade) {
      toast.error("Insufficient free margin to place this trade.");
      return;
    }
    setIsLoading(true);
    try {
      const tradeDetails = { 
        symbol: selectedSymbol, action, lots: lotsValue, orderType, 
        tp: takeProfit ? parseFloat(takeProfit) : null, 
        sl: stopLoss ? parseFloat(stopLoss) : null, 
        entryPrice: priceForCalc,
        status: orderType === 'Market' ? 'open' : 'pending',
        margin: marginRequired,
      };
      if (!tradeDetails.entryPrice) throw new Error("Entry price is required.");
      await onPlaceOrder(tradeDetails);
      setTakeProfit(''); setStopLoss(''); setEntryPrice('');
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
           <div className="flex justify-between text-sm"><span className="text-muted-foreground">Balance:</span><span>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Equity:</span><span>${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Used Margin:</span><span>${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Free Margin:</span><span className={freeMargin < 0 ? 'text-destructive' : ''}>${freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm pt-2 border-t"><span className="text-muted-foreground">Total P&L:</span><span className={totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}>${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Market Price</span>
            <p className="font-semibold text-lg">{currentMarketPrice > 0 ? currentMarketPrice.toFixed(4) : "..."}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary p-1">
            {['Market', 'Limit', 'Stop'].map(type => (<Button key={type} variant={orderType === type ? 'default' : 'ghost'} size="sm" onClick={() => setOrderType(type)} className="text-xs h-8">{type}</Button>))}
          </div>
          <div className="space-y-2">
              <div><Label>Asset Class</Label><Select value={selectedGroup} onValueChange={setSelectedGroup}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.keys(SYMBOL_GROUPS).map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Symbol</Label><Select value={selectedSymbol} onValueChange={onSymbolChange}><SelectTrigger><SelectValue>{formatSymbolForDisplay(selectedSymbol)}</SelectValue></SelectTrigger><SelectContent>{SYMBOL_GROUPS[selectedGroup].map(symbol => <SelectItem key={symbol} value={symbol}>{formatSymbolForDisplay(symbol)}</SelectItem>)}</SelectContent></Select></div>
          </div>
          {orderType !== 'Market' && (<div><Label htmlFor="entryPrice">Entry Price</Label><Input id="entryPrice" type="number" placeholder="Trigger Price" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} /></div>)}
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="sl">Stop Loss</Label><Input id="sl" type="number" placeholder="Optional" value={stopLoss} onChange={e => setStopLoss(e.target.value)} /></div>
            <div><Label htmlFor="tp">Take Profit</Label><Input id="tp" type="number" placeholder="Optional" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} /></div>
          </div>
          <div>
              <Label htmlFor="lots">Lots</Label>
              <div className="flex items-center mt-1">
                  <Button size="icon" variant="outline" onClick={() => handleLotChange(-0.01)} disabled={isLoading}><Minus className="h-4 w-4"/></Button>
                  <Input 
                    id="lots" 
                    type="number" 
                    value={lots} 
                    onChange={(e) => setLots(e.target.value)}
                    onBlur={handleLotsInputBlur}
                    className="text-center" 
                    disabled={isLoading}
                    min="0.01"
                    step="0.01"
                  />
                  <Button size="icon" variant="outline" onClick={() => handleLotChange(0.01)} disabled={isLoading}><Plus className="h-4 w-4"/></Button>
              </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Margin Required: ${marginRequired.toFixed(2)}
          </div>
          <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleTrade('BUY')} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading || !canPlaceTrade}>{isLoading ? '...' : 'Buy'}</Button>
              <Button onClick={() => handleTrade('SELL')} className="bg-red-600 hover:bg-red-700 text-white" disabled={isLoading || !canPlaceTrade}>{isLoading ? '...' : 'Sell'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradePanel;
