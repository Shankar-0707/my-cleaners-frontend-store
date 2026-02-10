import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Tags,
  Receipt,
  CreditCard,
  XCircle,
  RefreshCw,
  Save,
} from 'lucide-react';
import { useLayout } from '@/components/layout/AppLayout';
import { useOrders } from '@/contexts/OrderContext';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { StatusTimeline } from '@/components/orders/StatusTimeline';
import { CancelOrderDialog } from '@/components/orders/CancelOrderDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getServiceLabel, canCancelOrder, OrderStatus, getNextStatus } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageTitle } = useLayout();
  const { getOrder, updateOrderStatus, cancelOrder, updateChallan, addPayment } = useOrders();

  const order = getOrder(id || '');

  const [editingChallan, setEditingChallan] = useState(false);
  const [challanNo, setChallanNo] = useState(order?.challanNo || '');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    if (order) {
      setPageTitle(`Order ${order.orderCode}`);
      setChallanNo(order.challanNo || '');
    }
  }, [order, setPageTitle]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleSaveChallan = () => {
    updateChallan(order.id, challanNo);
    setEditingChallan(false);
  };

  const handleUpdateStatus = () => {
    if (newStatus) {
      updateOrderStatus(order.id, newStatus);
      setStatusDialogOpen(false);
      setNewStatus('');
    }
  };

  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0) {
      addPayment(order.id, amount, paymentMethod);
      setPaymentDialogOpen(false);
      setPaymentAmount('');
    }
  };

  const handleConfirmCancel = (reason: string) => {
    cancelOrder(order.id, reason);
    setCancelDialogOpen(false);
  };

  const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = order.totalAmount - totalPaid;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{order.orderCode}</h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span>{order.customerName}</span>
            <span>•</span>
            <span>{order.customerPhone}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challan Section */}
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Challan Number</p>
                {editingChallan ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={challanNo}
                      onChange={(e) => setChallanNo(e.target.value)}
                      className="w-40"
                    />
                    <Button size="sm" onClick={handleSaveChallan}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="font-bold text-lg">
                    {order.challanNo || (
                      <span className="text-destructive">Missing</span>
                    )}
                  </p>
                )}
              </div>
              {!editingChallan && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingChallan(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="history">Status History</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="card-elevated p-6 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium">{getServiceLabel(order.serviceType)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium capitalize">{order.source === 'hq' ? 'HQ Assigned' : 'Walk-in'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Slot</p>
                  <p className="font-medium">{order.pickupSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drop Slot</p>
                  <p className="font-medium">{order.dropSlot}</p>
                </div>
                {order.serviceType === 'laundry' && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">{order.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pieces</p>
                      <p className="font-medium">{order.pieces} items</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg text-primary">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-1">{order.notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="items" className="card-elevated p-6 mt-4">
              {order.items && order.items.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Item</th>
                      <th className="text-center py-2 font-medium">Qty</th>
                      <th className="text-right py-2 font-medium">Price</th>
                      <th className="text-right py-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">{item.name}</td>
                        <td className="text-center py-3">{item.quantity}</td>
                        <td className="text-right py-3">₹{item.price}</td>
                        <td className="text-right py-3 font-medium">
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {order.serviceType === 'laundry'
                    ? `Laundry order: ${order.weight}kg, ${order.pieces} pieces`
                    : 'No itemized details available'}
                </p>
              )}
            </TabsContent>

            <TabsContent value="payments" className="card-elevated p-6 mt-4">
              {order.payments.length > 0 ? (
                <div className="space-y-4">
                  {order.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <div>
                        <p className="font-medium">{payment.method}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                      <p className="font-bold text-green-600">₹{payment.amount}</p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-medium">Balance Due</span>
                    <span
                      className={`font-bold ${
                        balance > 0 ? 'text-destructive' : 'text-green-600'
                      }`}
                    >
                      ₹{balance}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No payments recorded yet
                </p>
              )}
            </TabsContent>

            <TabsContent value="history" className="card-elevated p-6 mt-4">
              <StatusTimeline
                statusHistory={order.statusHistory}
                currentStatus={order.status}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <div className="card-elevated p-4">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Button
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setNewStatus(getNextStatus(order.status) || '');
                    setStatusDialogOpen(true);
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Update Status
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate(`/tags?order=${order.id}`)}
              >
                <Tags className="h-4 w-4" />
                Print Tags
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate(`/invoices?order=${order.id}`)}
              >
                <Receipt className="h-4 w-4" />
                Generate Invoice
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setPaymentDialogOpen(true)}
              >
                <CreditCard className="h-4 w-4" />
                Add Payment
              </Button>
              {canCancelOrder(order.status) && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="card-elevated p-4">
            <h3 className="font-semibold mb-4">Customer</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-muted-foreground">{order.customerPhone}</p>
              {order.customerAddress && (
                <p className="text-muted-foreground">{order.customerAddress}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        orderCode={order.orderCode}
        onConfirm={handleConfirmCancel}
      />

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="pickup_assigned">Pickup Assigned</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="drop_assigned">Drop Assigned</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={!newStatus}>
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPayment} disabled={!paymentAmount}>
                Add Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
