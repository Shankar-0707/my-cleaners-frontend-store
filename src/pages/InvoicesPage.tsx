import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer, Download } from 'lucide-react';
import { useLayout } from '@/components/layout/AppLayout';
import { useOrders } from '@/contexts/OrderContext';
import { InvoiceReceipt } from '@/components/invoice/InvoiceReceipt';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const InvoicesPage = () => {
  const { setPageTitle } = useLayout();
  const { orders, getOrder } = useOrders();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('order');

  const [selectedOrderId, setSelectedOrderId] = useState(orderIdParam || '');

  useEffect(() => {
    setPageTitle('Invoices');
  }, [setPageTitle]);

  const selectedOrder = getOrder(selectedOrderId);

  const handlePrint = () => {
    if (!selectedOrder) {
      toast.error('Please select an order');
      return;
    }
    toast.success('Printing invoice...');
    window.print();
  };

  const handleDownload = () => {
    if (!selectedOrder) {
      toast.error('Please select an order');
      return;
    }
    toast.success('PDF download started');
  };

  const ordersWithAmount = orders.filter((o) => o.totalAmount > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Order:</span>
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {ordersWithAmount.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.orderCode} - {order.customerName} - ₹{order.totalAmount}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!selectedOrder}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            onClick={handlePrint}
            disabled={!selectedOrder}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="flex justify-center">
        {selectedOrder ? (
          <div className="print:m-0">
            <InvoiceReceipt order={selectedOrder} />
          </div>
        ) : (
          <div className="text-center py-12 card-elevated w-full max-w-md">
            <p className="text-muted-foreground">
              Select an order to preview and print the invoice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
