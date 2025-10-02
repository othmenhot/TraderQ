import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTradingContext } from '../../hooks/useTradingContextProvider';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { X, CandlestickChart, Filter, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, isWithinInterval } from 'date-fns';
import ModifyPositionModal from './ModifyPositionModal';
import DateFilterModal from './DateFilterModal';
import { updateTrade, closeTradeAndUpdateBalance, deleteTrade } from '../../lib/firestoreService';

const formatSymbolForDisplay = (symbol) => (symbol ? (symbol.includes(':') ? symbol.split(':')[1] : symbol) : '');
const getDate = (dateField) => {
    if (!dateField) return null;
    if (dateField.seconds) return new Date(dateField.seconds * 1000);
    if (dateField instanceof Date) return dateField;
    const date = new Date(dateField);
    return isNaN(date) ? null : date;
};

const PositionsPanel = ({ onSymbolSelect }) => {
  const { user } = useAuth();
  const { prices, trades } = useTradingContext();

  const [activeTab, setActiveTab] = useState('positions');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(undefined);

  const openPositions = useMemo(() => trades.filter(t => t.status === 'open'), [trades]);
  const pendingOrders = useMemo(() => trades.filter(t => t.status === 'pending'), [trades]);
  const historyPositions = useMemo(() => {
    const closed = trades.filter(t => t.status === 'closed');
    if (!dateRange || !dateRange.from) return closed;
    return closed.filter(pos => {
      const closedAt = getDate(pos.closedAt);
      if (!closedAt) return false;
      const to = dateRange.to || dateRange.from;
      return isWithinInterval(closedAt, { start: dateRange.from, end: to });
    });
  }, [trades, dateRange]);


  const handleOpenModal = (position) => setSelectedPosition(position);
  const handleCloseModal = () => setSelectedPosition(null);

  const handleSaveChanges = async (newValues) => {
    if (!selectedPosition || !user) return;
    setIsLoading(true);
    try {
      await updateTrade(selectedPosition.id, newValues);
      toast.success("Position updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update position.");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };
  
  const handleClosePosition = async (position) => {
    if(!user) return;
    setIsLoading(true);
    try {
      const currentPrice = prices[position.symbol];
      if (!currentPrice) throw new Error("Could not get current price to close position.");
      
      const pnl = (currentPrice - position.entryPrice) * (position.lots * 100) * (position.action === 'SELL' ? -1 : 1);
      
      await closeTradeAndUpdateBalance(user.uid, position, currentPrice, pnl);
      
      toast.success("Position closed!");
    } catch (error) {
      toast.error(error.message || "Failed to close position.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await deleteTrade(orderId);
      toast.success("Pending order cancelled.");
    } catch (error) {
      toast.error(error.message || "Failed to cancel order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModifyPositionModal isOpen={!!selectedPosition} onRequestClose={handleCloseModal} position={selectedPosition} onSave={handleSaveChanges} />
      <DateFilterModal isOpen={isFilterModalOpen} onRequestClose={() => setIsFilterModalOpen(false)} onApplyFilter={setDateRange} />
      <Card className="h-full flex flex-col">
        <div className="flex justify-between items-center border-b">
          <div className="flex">
            <button onClick={() => setActiveTab('positions')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'positions' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Open Positions ({openPositions.length})
            </button>
             <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'pending' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Pending Orders ({pendingOrders.length})
            </button>
            <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              History ({historyPositions.length})
            </button>
          </div>
          {activeTab === 'history' && (
            <div className="pr-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(true)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardContent className="p-0 flex-grow overflow-y-auto">
          {activeTab === 'positions' && <PositionsList positions={openPositions} onRowClick={handleOpenModal} onCloseClick={handleClosePosition} isLoading={isLoading} livePrices={prices} onSymbolSelect={onSymbolSelect} />}
          {activeTab === 'pending' && <PendingOrdersList orders={pendingOrders} onRowClick={handleOpenModal} onCancelClick={handleCancelOrder} isLoading={isLoading} />}
          {activeTab === 'history' && <HistoryList history={historyPositions} />}
        </CardContent>
      </Card>
    </>
  );
};

// --- Sub-components for different lists ---

const PositionsList = ({ positions, onRowClick, onCloseClick, isLoading, livePrices, onSymbolSelect }) => {
  if (!positions || positions.length === 0) return <p className="text-center text-muted-foreground p-8">No open positions.</p>;
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="p-2 font-medium">Symbol</th><th className="p-2 font-medium">Volume (Lots)</th><th className="p-2 font-medium">Entry Price</th><th className="p-2 font-medium">Take Profit</th><th className="p-2 font-medium">Stop Loss</th><th className="p-2 font-medium">P&L</th><th className="p-2 font-medium"></th></tr></thead>
      <tbody>
        {positions.map((pos) => {
          const shares = pos.lots * 100;
          const currentPrice = livePrices[pos.symbol] || pos.entryPrice;
          const pnl = (currentPrice - (pos.entryPrice || 0)) * shares * (pos.action === 'SELL' ? -1 : 1);
          return (
            <tr key={pos.id} className="border-b hover:bg-secondary/50 cursor-pointer">
              <td className="p-2 font-semibold" onClick={() => onRowClick(pos)}><div className="flex items-center gap-2"><span>{formatSymbolForDisplay(pos.symbol)} <span className={`text-xs ${pos.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>({pos.action})</span></span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onSymbolSelect(pos.symbol); }}><CandlestickChart className="h-4 w-4 text-muted-foreground" /></Button></div></td>
              <td className="p-2" onClick={() => onRowClick(pos)}>{pos.lots}</td>
              <td className="p-2" onClick={() => onRowClick(pos)}>${(pos.entryPrice || 0).toFixed(4)}</td>
              <td className="p-2 text-blue-500" onClick={() => onRowClick(pos)}>{pos.tp ? `$${pos.tp.toFixed(2)}` : 'Set TP'}</td>
              <td className="p-2 text-orange-500" onClick={() => onRowClick(pos)}>{pos.sl ? `$${pos.sl.toFixed(2)}` : 'Set SL'}</td>
              <td className={`p-2 font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`} onClick={() => onRowClick(pos)}>${pnl.toFixed(2)}</td>
              <td className="p-2 text-right"><Button size="icon" variant="destructive" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onCloseClick(pos); }} disabled={isLoading}><X className="h-4 w-4" /></Button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const PendingOrdersList = ({ orders, onRowClick, onCancelClick, isLoading }) => {
  if (!orders || orders.length === 0) return <p className="text-center text-muted-foreground p-8">No pending orders.</p>;
  return (
     <table className="w-full text-sm">
      <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="p-2 font-medium">Symbol</th><th className="p-2 font-medium">Type</th><th className="p-2 font-medium">Volume</th><th className="p-2 font-medium">Entry Price</th><th className="p-2 font-medium">Take Profit</th><th className="p-2 font-medium">Stop Loss</th><th className="p-2 font-medium"></th></tr></thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b hover:bg-secondary/50 cursor-pointer">
            <td className="p-2 font-semibold" onClick={() => onRowClick(order)}>{formatSymbolForDisplay(order.symbol)} <span className={`text-xs ${order.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>({order.action})</span></td>
            <td className="p-2" onClick={() => onRowClick(order)}>{order.orderType}</td>
            <td className="p-2" onClick={() => onRowClick(order)}>{order.lots}</td>
            <td className="p-2" onClick={() => onRowClick(order)}>${(order.entryPrice || 0).toFixed(4)}</td>
            <td className="p-2" onClick={() => onRowClick(order)}>{order.tp ? `$${order.tp.toFixed(2)}` : 'N/A'}</td>
            <td className="p-2" onClick={() => onRowClick(order)}>{order.sl ? `$${order.sl.toFixed(2)}` : 'N/A'}</td>
            <td className="p-2 text-right">
              <Button size="icon" variant="destructive" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onCancelClick(order.id); }} disabled={isLoading}><X className="h-4 w-4" /></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const HistoryList = ({ history }) => {
    if (!history || history.length === 0) return <p className="text-center text-muted-foreground p-8">No trading history for the selected period.</p>;
    const sortedHistory = [...history].sort((a, b) => getDate(b.closedAt) - getDate(a.closedAt));
    return (
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="p-2 font-medium">Symbol</th><th className="p-2 font-medium">Volume</th><th className="p-2 font-medium">Entry Price</th><th className="p-2 font-medium">Close Price</th><th className="p-2 font-medium">Closed At</th><th className="p-2 font-medium">P&L</th></tr></thead>
        <tbody>
          {sortedHistory.map((pos) => (
            <tr key={pos.id} className="border-b hover:bg-secondary/50">
              <td className="p-2 font-semibold">{formatSymbolForDisplay(pos.symbol)} <span className={`text-xs ${pos.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>({pos.action})</span></td>
              <td className="p-2">{pos.lots}</td>
              <td className="p-2">${(pos.entryPrice || 0).toFixed(4)}</td>
              <td className="p-2">${(pos.closingPrice || 0).toFixed(4)}</td>
              <td className="p-2 text-muted-foreground">{pos.closedAt ? format(getDate(pos.closedAt), 'dd/MM/yy HH:mm') : 'N/A'}</td>
              <td className={`p-2 font-semibold ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>${(pos.pnl || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
};

export default PositionsPanel;
