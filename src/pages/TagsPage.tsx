import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer, RefreshCw, CheckSquare, Square } from 'lucide-react';
import { useLayout } from '@/components/layout/AppLayout';
import { useOrders } from '@/contexts/OrderContext';
import { ThermalTag } from '@/components/tags/ThermalTag';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TagData {
  id: string;
  orderId: string;
  itemName: string;
  pieceIndex: number;
  totalPieces: number;
}

const TagsPage = () => {
  const { setPageTitle } = useLayout();
  const { orders, getOrder } = useOrders();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('order');

  const [selectedOrderId, setSelectedOrderId] = useState(orderIdParam || '');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [printer, setPrinter] = useState('thermal-1');

  useEffect(() => {
    setPageTitle('Tags');
  }, [setPageTitle]);

  const selectedOrder = getOrder(selectedOrderId);

  const tags = useMemo<TagData[]>(() => {
    if (!selectedOrder) return [];

    const tagList: TagData[] = [];

    if (selectedOrder.serviceType === 'laundry' && selectedOrder.pieces) {
      for (let i = 1; i <= selectedOrder.pieces; i++) {
        tagList.push({
          id: `${selectedOrder.id}-piece-${i}`,
          orderId: selectedOrder.id,
          itemName: 'Laundry Item',
          pieceIndex: i,
          totalPieces: selectedOrder.pieces,
        });
      }
    }

    if (selectedOrder.serviceType === 'dryclean' && selectedOrder.items) {
      let pieceIndex = 1;
      const totalPieces = selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0);
      
      selectedOrder.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          tagList.push({
            id: `${selectedOrder.id}-${item.id}-${i}`,
            orderId: selectedOrder.id,
            itemName: item.name,
            pieceIndex: pieceIndex++,
            totalPieces,
          });
        }
      });
    }

    return tagList;
  }, [selectedOrder]);

  const toggleTag = (tagId: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  const selectAll = () => {
    if (selectedTags.size === tags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(tags.map((t) => t.id)));
    }
  };

  const handlePrint = (type: 'all' | 'selected') => {
    const count = type === 'all' ? tags.length : selectedTags.size;
    if (count === 0) {
      toast.error('No tags to print');
      return;
    }
    toast.success(`Printing ${count} tag(s) to ${printer}`);
  };

  const handleRegenerate = () => {
    toast.success('Tags regenerated');
  };

  const eligibleOrders = orders.filter(
    (o) =>
      (o.serviceType === 'laundry' && o.pieces) ||
      (o.serviceType === 'dryclean' && o.items && o.items.length > 0)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Order:</span>
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {eligibleOrders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.orderCode} - {order.customerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Printer:</span>
          <Select value={printer} onValueChange={setPrinter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thermal-1">Thermal Printer 1</SelectItem>
              <SelectItem value="thermal-2">Thermal Printer 2</SelectItem>
              <SelectItem value="office">Office Printer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRegenerate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePrint('selected')}
            disabled={selectedTags.size === 0}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Selected ({selectedTags.size})
          </Button>
          <Button
            onClick={() => handlePrint('all')}
            disabled={tags.length === 0}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print All ({tags.length})
          </Button>
        </div>
      </div>

      {/* Tag Selection Controls */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAll}
            className="gap-2"
          >
            {selectedTags.size === tags.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {selectedTags.size === tags.length ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-sm text-muted-foreground">
            {selectedTags.size} of {tags.length} selected
          </span>
        </div>
      )}

      {/* Tags Grid */}
      {selectedOrder ? (
        tags.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tags.map((tag) => (
              <ThermalTag
                key={tag.id}
                order={selectedOrder}
                itemName={tag.itemName}
                pieceIndex={tag.pieceIndex}
                totalPieces={tag.totalPieces}
                selected={selectedTags.has(tag.id)}
                onSelect={() => toggleTag(tag.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-elevated">
            <p className="text-muted-foreground">
              This order has no items to generate tags for.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 card-elevated">
          <p className="text-muted-foreground">
            Select an order to view and print tags.
          </p>
        </div>
      )}
    </div>
  );
};

export default TagsPage;
