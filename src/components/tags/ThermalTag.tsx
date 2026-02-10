import { Order } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface ThermalTagProps {
  order: Order;
  itemName: string;
  pieceIndex: number;
  totalPieces: number;
  selected?: boolean;
  onSelect?: () => void;
}

export const ThermalTag = ({
  order,
  itemName,
  pieceIndex,
  totalPieces,
  selected,
  onSelect,
}: ThermalTagProps) => {
  const { store } = useAuth();

  return (
    <div
      onClick={onSelect}
      className={`thermal-tag cursor-pointer transition-all ${
        selected ? 'ring-2 ring-primary border-primary' : 'hover:border-muted-foreground'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-2 mb-2">
        <span className="font-bold text-primary text-sm">MYCLEANERS</span>
        <span className="text-xs text-muted-foreground">{store.name}</span>
      </div>

      {/* Barcode Placeholder */}
      <div className="flex justify-center py-2">
        <div className="flex gap-0.5">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="bg-foreground"
              style={{
                width: Math.random() > 0.5 ? '2px' : '1px',
                height: '32px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Order Info */}
      <div className="space-y-1 text-center mt-2">
        <p className="font-bold text-lg">{order.orderCode}</p>
        <p className="text-xs text-muted-foreground">
          Challan: {order.challanNo || 'N/A'}
        </p>
      </div>

      {/* Item Info */}
      <div className="mt-3 pt-2 border-t border-dashed border-gray-300 text-center">
        <p className="text-sm font-medium">{order.serviceType === 'laundry' ? 'Laundry' : 'Dry Clean'}</p>
        <p className="font-bold text-xl mt-1">
          {itemName} <span className="text-primary">{pieceIndex}/{totalPieces}</span>
        </p>
      </div>

      {/* Customer */}
      <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-center">
        <p className="text-sm font-medium">{order.customerName}</p>
        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
      </div>
    </div>
  );
};
