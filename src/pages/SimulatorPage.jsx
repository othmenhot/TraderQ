import React, { useState } from 'react';
import { TradingProvider, useTradingContext } from '../hooks/useTradingContextProvider';
import TradingViewWidget from '../components/trading/TradingViewWidget'; // <-- Back to the original widget
import TradePanel from '../components/trading/TradePanel';
import PositionsPanel from '../components/trading/PositionsPanel';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { addTrade } from '../lib/firestoreService';
import { toast } from 'react-hot-toast';

const SimulatorContent = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:AAPL');
  const { user } = useAuth();

  const handlePlaceOrder = async (tradeDetails) => {
    if (!user) {
      toast.error('You must be logged in to trade.');
      return;
    }
    try {
      await addTrade(user.uid, tradeDetails);
      toast.success('Trade placed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to place trade.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 h-full flex flex-col gap-8">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-2 h-full">
          <Card className="h-full flex flex-col">
            <CardContent className="p-0 flex-grow">
              <TradingViewWidget symbol={selectedSymbol} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 h-full">
          <TradePanel 
            selectedSymbol={selectedSymbol} 
            onSymbolChange={setSelectedSymbol}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
      <div className="flex-shrink-0 h-64"> 
        <PositionsPanel onSymbolSelect={setSelectedSymbol} />
      </div>
    </div>
  );
};

const SimulatorPage = () => {
  // The TradingProvider is now only in App.jsx, which is correct.
  return <SimulatorContent />;
};

export default SimulatorPage;
