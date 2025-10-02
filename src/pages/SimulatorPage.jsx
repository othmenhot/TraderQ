import React, { useState } from 'react';
import TradingViewWidget from '../components/trading/TradingViewWidget';
import TradePanel from '../components/trading/TradePanel';
import PositionsPanel from '../components/trading/PositionsPanel';
import { Card, CardContent } from '../components/ui/Card';

const SimulatorPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:AAPL');

  return (
    // Use a full-height flex container for robust layout
    <div className="container mx-auto px-6 py-8 h-full flex flex-col gap-8">
      
      {/* Top Row: This part will grow to fill available space */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        
        {/* TradingView Chart */}
        <div className="lg:col-span-2 h-full">
          <Card className="h-full flex flex-col">
            <CardContent className="p-0 flex-grow">
              <TradingViewWidget symbol={selectedSymbol} />
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1 h-full">
          <TradePanel 
            selectedSymbol={selectedSymbol} 
            onSymbolChange={setSelectedSymbol} 
          />
        </div>
      </div>

      {/* Bottom Row: This part has a fixed height and will not shrink */}
      <div className="flex-shrink-0 h-64"> 
        <PositionsPanel />
      </div>

    </div>
  );
};

export default SimulatorPage;
