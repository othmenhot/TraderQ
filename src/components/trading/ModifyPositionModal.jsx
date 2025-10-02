import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { X } from 'lucide-react';

Modal.setAppElement('#root'); // For accessibility

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    padding: '0',
    borderRadius: 'var(--radius)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    background: 'hsl(var(--card))',
    color: 'hsl(var(--card-foreground))',
    maxWidth: '400px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'hsla(var(--background) / 0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 50,
  },
};

const ModifyPositionModal = ({ isOpen, onRequestClose, position, onSave }) => {
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');

  useEffect(() => {
    if (position) {
      setTp(position.tp || '');
      setSl(position.sl || '');
    }
  }, [position]);

  const handleSave = () => {
    onSave({
      tp: tp ? parseFloat(tp) : null,
      sl: sl ? parseFloat(sl) : null,
    });
    onRequestClose();
  };

  if (!position) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Modify Position">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Modify Position: {position.symbol}</h2>
          <Button variant="ghost" size="icon" onClick={onRequestClose}><X className="h-4 w-4" /></Button>
        </div>

        <div>
          <Label htmlFor="tp">Take Profit (TP)</Label>
          <Input id="tp" type="number" placeholder="Enter TP price" value={tp} onChange={(e) => setTp(e.target.value)} />
        </div>
        
        <div>
          <Label htmlFor="sl">Stop Loss (SL)</Label>
          <Input id="sl" type="number" placeholder="Enter SL price" value={sl} onChange={(e) => setSl(e.target.value)} />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onRequestClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModifyPositionModal;
