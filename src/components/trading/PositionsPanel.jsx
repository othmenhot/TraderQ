import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLivePrices } from '../../hooks/useLivePrices';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { X } from 'lucide-react';
import { closePosition, updatePosition } from '../../lib/firestoreService';
import { toast } from 'react-hot-toast';
import { format, formatDistance } from 'date-fns';
import ModifyPositionModal from './ModifyPositionModal';

const formatSymbolForDisplay = (symbol) => (symbol ? (symbol.includes(':') ? symbol.split(':')[1] : symbol) : '');
const getDate = (dateField) => {
    if (!dateField) return null;
    if (dateField.seconds) return new Date(dateField.seconds * 1000);
    if (dateField instanceof Date) return dateField;
    const date = new Date(dateField);
    return isNaN(date) ? null : date;
};

const PositionsPanel = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('positions');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const livePrices = useLivePrices();

  const portfolio = userProfile?.simulation || { positions: [], history: [] };

  const handleOpenModal = (position) => setSelectedPosition(position);
  const handleCloseModal = () => setSelectedPosition(null);

  const handleSaveChanges = async (newValues) => {
    if (!selectedPosition) return;
    setIsLoading(true);
    try {
      await updatePosition(user.uid, selectedPosition.id, newValues);
      await refreshUserProfile();
      toast.success("Position updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update position.");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };
  
  const handleClosePosition = async (position) => {
    setIsLoading(true);
    try {
      await closePosition(user.uid, position, livePrices[position.symbol]);
      await refreshUserProfile();
      toast.success("Position closed!");
    } catch (error) {
      toast.error(error.message || "Failed to close position.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModifyPositionModal isOpen={!!selectedPosition} onRequestClose={handleCloseModal} position={selectedPosition} onSave={handleSaveChanges} />
      <Card className="h-full flex flex-col">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('positions')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'positions' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            Open Positions ({portfolio.positions?.length || 0})
          </button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            History ({portfolio.history?.length || 0})
          </button>
        </div>
        <CardContent className="p-0 flex-grow overflow-y-auto">
          {activeTab === 'positions' && <PositionsList positions={portfolio.positions} onRowClick={handleOpenModal} onCloseClick={handleClosePosition} isLoading={isLoading} livePrices={livePrices} />}
          {activeTab === 'history' && <HistoryList history={portfolio.history} />}
        </CardContent>
      </Card>
    </>
  );
};

const PositionsList = ({ positions, onRowClick, onCloseClick, isLoading, livePrices }) => {
  if (!positions || positions.length === 0) return <p className="text-center text-muted-foreground p-8">No open positions.</p>;
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-muted-foreground"><tr className="border-b"><th className="p-2 font-medium">Symbol</th><th className="p-2 font-medium">P&L</th><th className="p-2 font-medium">Take Profit</th><th className="p-2 font-medium">Stop Loss</th><th className="p-2 font-medium"></th></tr></thead>
      <tbody>
        {positions.map((pos, index) => {
          const shares = pos.shares || pos.size;
          const currentPrice = livePrices[pos.symbol] || pos.entryPrice;
          const pnl = (currentPrice - pos.entryPrice) * shares * (pos.action === 'SELL' ? -1 : 1);
          return (
            <tr key={pos.id || index} className="border-b hover:bg-secondary/50">
              <td className="p-2 font-semibold cursor-pointer" onClick={() => onRowClick(pos)}>{formatSymbolForDisplay(pos.symbol)} ({pos.action})<br/><span className="text-xs text-muted-foreground">{pos.lots} lots</span></td>
              <td className={`p-2 font-semibold cursor-pointer ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`} onClick={() => onRowClick(pos)}>${pnl.toFixed(2)}</td>
              <td className="p-2 text-blue-500 cursor-pointer" onClick={() => onRowClick(pos)}>{pos.tp ? `$${pos.tp.toFixed(2)}` : 'Set TP'}</td>
              <td className="p-2 text-orange-500 cursor-pointer" onClick={() => onRowClick(pos)}>{pos.sl ? `$${pos.sl.toFixed(2)}` : 'Set SL'}</td>
              <td className="p-2 text-right">
                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onCloseClick(pos); }} disabled={isLoading}><X className="h-4 w-4" /></Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const HistoryList = ({ history }) => {
    if (!history || history.length === 0) {
      return <p className="text-center text-muted-foreground p-8">No closed positions yet.</p>;
    }
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = getDate(a.closedAt);
      const dateB = getDate(b.closedAt);
      if (!dateA || !dateB) return 0;
      return dateB - dateA;
    });
  
    return (
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr className="border-b">
            <th className="p-2 font-medium">Symbol</th>
            <th className="p-2 font-medium">P&L</th>
            <th className="p-2 font-medium">Duration</th>
            <th className="p-2 font-medium">Entry / Close Price</th>
            <th className="p-2 font-medium">Closed At</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((pos, index) => {
            const openedAt = getDate(pos.openedAt);
            const closedAt = getDate(pos.closedAt);
            const duration = (openedAt && closedAt) ? formatDistance(closedAt, openedAt, { addSuffix: false }) : 'N/A';
            return (
                <tr key={pos.id || index} className="border-b hover:bg-secondary/50">
                    <td className="p-2 font-semibold">{formatSymbolForDisplay(pos.symbol)} ({pos.action})</td>
                    <td className={`p-2 font-semibold ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>${pos.pnl.toFixed(2)}</td>
                    <td className="p-2 text-muted-foreground">{duration}</td>
                    <td className="p-2 text-muted-foreground">${pos.entryPrice.toFixed(2)} → ${pos.closingPrice.toFixed(2)}</td>
                    <td className="p-2 text-muted-foreground">{closedAt ? format(closedAt, 'dd/MM/yy HH:mm') : 'N/A'}</td>
                </tr>
            );
          })}
        </tbody>
      </table>
    );
};

export default PositionsPanel;
