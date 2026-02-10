import { Order, getServiceLabel } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface InvoiceReceiptProps {
  order: Order;
}

export const InvoiceReceipt = ({ order }: InvoiceReceiptProps) => {
  const { store } = useAuth();

  const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = order.totalAmount - totalPaid;

  return (
    <div className="invoice-receipt p-6 border-2 border-dashed border-gray-300">
      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-4 mb-4">
        <h1 className="text-2xl font-bold text-primary">MYCLEANERS</h1>
        <p className="text-sm text-muted-foreground mt-1">{store.name}</p>
        <p className="text-xs text-muted-foreground">{store.address}</p>
        <p className="text-xs text-muted-foreground">Ph: {store.phone}</p>
      </div>

      {/* Invoice Title */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold border-2 border-foreground inline-block px-4 py-1">
          INVOICE
        </h2>
      </div>

      {/* Order Details */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order No:</span>
          <span className="font-bold">{order.orderCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Challan:</span>
          <span className="font-bold">{order.challanNo || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date:</span>
          <span>{format(new Date(order.createdAt), 'dd MMM yyyy')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service:</span>
          <span>{getServiceLabel(order.serviceType)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-gray-400 my-4" />

      {/* Customer Details */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Bill To:</p>
        <p className="font-bold">{order.customerName}</p>
        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
        {order.customerAddress && (
          <p className="text-xs text-muted-foreground">{order.customerAddress}</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-gray-400 my-4" />

      {/* Service Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between font-bold border-b pb-1">
          <span>Description</span>
          <span>Amount</span>
        </div>

        {order.serviceType === 'laundry' && (
          <div className="flex justify-between">
            <span>
              Laundry ({order.weight}kg, {order.pieces} pcs)
            </span>
            <span>₹{order.totalAmount}</span>
          </div>
        )}

        {order.serviceType === 'dryclean' && order.items && (
          <>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </>
        )}

        {order.serviceType === 'home_cleaning' && (
          <div className="flex justify-between">
            <span>Home Cleaning Service</span>
            <span>₹{order.totalAmount}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-400 my-4" />

      {/* Totals */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.totalAmount}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax (0%)</span>
          <span>₹0</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>Total</span>
          <span className="text-primary">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Payment Status */}
      {order.payments.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-400">
          <p className="text-xs text-muted-foreground mb-2">Payments:</p>
          {order.payments.map((payment) => (
            <div key={payment.id} className="flex justify-between text-sm">
              <span>
                {payment.method} ({payment.date})
              </span>
              <span className="text-green-600">-₹{payment.amount}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2 pt-2 border-t">
            <span>Balance Due</span>
            <span className={balance > 0 ? 'text-destructive' : 'text-green-600'}>
              ₹{balance}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
        <p className="text-xs text-muted-foreground italic">
          ⚠️ Handle with care
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Thank you for choosing MyCleaners!
        </p>
        <p className="text-xs text-muted-foreground">
          For queries: {store.phone}
        </p>
      </div>
    </div>
  );
};
