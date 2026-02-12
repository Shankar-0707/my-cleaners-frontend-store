import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Tags, Receipt } from 'lucide-react';
import { useLayout } from '@/components/layout/AppLayout';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ServiceType,
  OrderItem,
  dryCleanItems,
  homeCleaningServices,
} from '@/lib/mockData';
import { toast } from 'sonner';


const CreateOrder = () => {
  const { setPageTitle } = useLayout();
  //const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('laundry');
  const [weight, setWeight] = useState('');
  const [pieces, setPieces] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [homeService, setHomeService] = useState('');
  const [homePrice, setHomePrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addOrder } = useOrders();
  useEffect(() => {
    setPageTitle('Create Walk-in Order');
  }, [setPageTitle]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) newErrors.customerName = 'Name is required';
    if (!customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!challanNo.trim()) newErrors.challanNo = 'Challan number is required';

    if (serviceType === 'laundry') {
      if (!weight || parseFloat(weight) <= 0) newErrors.weight = 'Weight is required';
      if (!pieces || parseInt(pieces) <= 0) newErrors.pieces = 'Pieces count is required';
    }

    if (serviceType === 'dryclean' && items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    if (serviceType === 'home_cleaning') {
      if (!homeService) newErrors.homeService = 'Service is required';
      if (!homePrice || parseFloat(homePrice) <= 0) newErrors.homePrice = 'Price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = (): number => {
    if (serviceType === 'laundry') {
      return parseFloat(weight || '0') * 80; // ₹80 per kg
    }
    if (serviceType === 'dryclean') {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    if (serviceType === 'home_cleaning') {
      return parseFloat(homePrice || '0');
    }
    return 0;
  };

  const addDryCleanItem = () => {
    setItems([
      ...items,
      { id: `item-${Date.now()}`, name: '', quantity: 1, price: 0 },
    ]);
  };

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDryCleanItemSelect = (index: number, itemName: string) => {
    const itemData = dryCleanItems.find((i) => i.name === itemName);
    if (itemData) {
      updateItem(index, { name: itemData.name, price: itemData.price });
    }
  };

  const handleHomeServiceSelect = (serviceName: string) => {
    const service = homeCleaningServices.find((s) => s.name === serviceName);
    if (service) {
      setHomeService(service.name);
      setHomePrice(service.price.toString());
    }
  };

  const handleSubmit = async (action: 'save' | 'save_tags' | 'save_invoice') => {
    if (!validate()) {
      toast.error('Please fix the validation errors');
      return;
    }

    const order = await addOrder({
      challan_no: challanNo,
      customerData: {
        full_name: customerName,
        mobile: customerPhone,
        address_line1: customerAddress || 'N/A',
      },
      note: notes || undefined,
    });

    if (order) {
      if (action === 'save_tags') {
        navigate(`/tags?order=${order.id}`);
      } else if (action === 'save_invoice') {
        navigate(`/invoices?order=${order.id}`);
      } else {
        navigate('/orders');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="space-y-6">
        {/* Customer Details */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className={errors.customerName ? 'border-destructive' : ''}
              />
              {errors.customerName && (
                <p className="text-sm text-destructive">{errors.customerName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                className={errors.customerPhone ? 'border-destructive' : ''}
              />
              {errors.customerPhone && (
                <p className="text-sm text-destructive">{errors.customerPhone}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
              />
            </div>
          </div>
        </div>

        {/* Challan */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">Challan Number *</h2>
          <div className="max-w-xs">
            <Input
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
              placeholder="Enter challan number"
              className={errors.challanNo ? 'border-destructive' : ''}
            />
            {errors.challanNo && (
              <p className="text-sm text-destructive mt-1">{errors.challanNo}</p>
            )}
          </div>
        </div>

        {/* Service Type */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">Service Type</h2>
          <div className="flex gap-3">
            {(['laundry', 'dryclean', 'home_cleaning'] as ServiceType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => {
                    setServiceType(type);
                    setItems([]);
                    setHomeService('');
                    setHomePrice('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    serviceType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {type === 'laundry'
                    ? 'Laundry'
                    : type === 'dryclean'
                    ? 'Dry Clean'
                    : 'Home Cleaning'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Order Details based on service */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>

          {serviceType === 'laundry' && (
            <div className="grid gap-4 sm:grid-cols-2 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className={errors.weight ? 'border-destructive' : ''}
                />
                {errors.weight && (
                  <p className="text-sm text-destructive">{errors.weight}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pieces">Number of Pieces *</Label>
                <Input
                  id="pieces"
                  type="number"
                  value={pieces}
                  onChange={(e) => setPieces(e.target.value)}
                  placeholder="0"
                  className={errors.pieces ? 'border-destructive' : ''}
                />
                {errors.pieces && (
                  <p className="text-sm text-destructive">{errors.pieces}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">
                  Rate: ₹80 per kg
                </p>
              </div>
            </div>
          )}

          {serviceType === 'dryclean' && (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Item</Label>
                    <Select
                      value={item.name}
                      onValueChange={(value) =>
                        handleDryCleanItemSelect(index, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {dryCleanItems.map((i) => (
                          <SelectItem key={i.name} value={i.name}>
                            {i.name} - ₹{i.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, { quantity: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, { price: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addDryCleanItem} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              {errors.items && (
                <p className="text-sm text-destructive">{errors.items}</p>
              )}
            </div>
          )}

          {serviceType === 'home_cleaning' && (
            <div className="grid gap-4 sm:grid-cols-2 max-w-md">
              <div className="space-y-2 sm:col-span-2">
                <Label>Service Type *</Label>
                <Select value={homeService} onValueChange={handleHomeServiceSelect}>
                  <SelectTrigger
                    className={errors.homeService ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {homeCleaningServices.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name} - ₹{s.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.homeService && (
                  <p className="text-sm text-destructive">{errors.homeService}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="homePrice">Price *</Label>
                <Input
                  id="homePrice"
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                  placeholder="0"
                  className={errors.homePrice ? 'border-destructive' : ''}
                />
                {errors.homePrice && (
                  <p className="text-sm text-destructive">{errors.homePrice}</p>
                )}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Estimated Total</span>
              <span className="text-2xl font-bold text-primary">
                ₹{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate('/orders')}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSubmit('save')} className="gap-2">
            <Save className="h-4 w-4" />
            Save Order
          </Button>
          <Button variant="outline" onClick={() => handleSubmit('save_tags')} className="gap-2">
            <Tags className="h-4 w-4" />
            Save + Print Tags
          </Button>
          <Button onClick={() => handleSubmit('save_invoice')} className="gap-2">
            <Receipt className="h-4 w-4" />
            Save + Generate Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Trash2, Save, Tags, Receipt } from 'lucide-react';
// import { useLayout } from '@/components/layout/AppLayout';
// // ❌ REMOVED: useOrders (fake local storage)
// // import { useOrders } from '@/contexts/OrderContext';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   ServiceType,
//   OrderItem,
//   dryCleanItems,
//   homeCleaningServices,
// } from '@/lib/mockData';
// import { toast } from 'sonner';

// // ✅ ADDED: real backend API import
// import { createOrder } from '@/services/api';
// import axios from "axios";

// const CreateOrder = () => {
//   const { setPageTitle } = useLayout();
//   const navigate = useNavigate();

//   // ❌ REMOVED: const { addOrder } = useOrders();

//   const [customerName, setCustomerName] = useState('');
//   const [customerPhone, setCustomerPhone] = useState('');
//   const [customerAddress, setCustomerAddress] = useState('');
//   const [notes, setNotes] = useState('');
//   const [challanNo, setChallanNo] = useState('');
//   const [serviceType, setServiceType] = useState<ServiceType>('laundry');
//   const [weight, setWeight] = useState('');
//   const [pieces, setPieces] = useState('');
//   const [items, setItems] = useState<OrderItem[]>([]);
//   const [homeService, setHomeService] = useState('');
//   const [homePrice, setHomePrice] = useState('');
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     setPageTitle('Create Walk-in Order');
//   }, [setPageTitle]);

//   /** ---------------- VALIDATION ---------------- */
//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!customerName.trim()) newErrors.customerName = 'Name is required';
//     if (!customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
//     if (!challanNo.trim()) newErrors.challanNo = 'Challan number is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /** ---------------- HANDLE SUBMIT (MAIN CHANGE) ---------------- */
//   // 🔴 OLD: used addOrder() from local context
//   // 🟢 NEW: calls backend createOrder API

//   const handleSubmit = async (
//     action: 'save' | 'save_tags' | 'save_invoice'
//   ) => {
//     if (!validate()) {
//       toast.error('Please fix the validation errors');
//       return;
//     }

//     try {
//       // ✅ BACKEND API CALL
//       const data = await createOrder({
//         challan_no: challanNo,
//         customer: {
//           full_name: customerName,
//           mobile: customerPhone,
//         },
//       });

//       toast.success('Order created successfully');

//       // ✅ GET REAL ORDER ID FROM BACKEND RESPONSE
//       const orderId = data.order.id;

//       // ✅ NAVIGATION BASED ON BUTTON ACTION
//       if (action === 'save_tags') {
//         navigate(`/orders/${orderId}/tags`);
//       } else if (action === 'save_invoice') {
//         navigate(`/orders/${orderId}/invoice`);
//       } else {
//         navigate(`/orders/${orderId}`);
//       }
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "Failed to create order");
//       } else {
//         toast.error("Something went wrong");
//       }
//     }
    
//   };

//   /** ---------------- TOTAL CALCULATION (UI ONLY) ---------------- */
//   const calculateTotal = (): number => {
//     if (serviceType === 'laundry') {
//       return parseFloat(weight || '0') * 80;
//     }
//     if (serviceType === 'dryclean') {
//       return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     }
//     if (serviceType === 'home_cleaning') {
//       return parseFloat(homePrice || '0');
//     }
//     return 0;
//   };

//   /** ---------------- DRY CLEAN ITEM HELPERS ---------------- */
//   const addDryCleanItem = () => {
//     setItems([
//       ...items,
//       { id: `item-${Date.now()}`, name: '', quantity: 1, price: 0 },
//     ]);
//   };

//   const updateItem = (index: number, updates: Partial<OrderItem>) => {
//     setItems(
//       items.map((item, i) => (i === index ? { ...item, ...updates } : item))
//     );
//   };

//   const removeItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const handleDryCleanItemSelect = (index: number, itemName: string) => {
//     const itemData = dryCleanItems.find((i) => i.name === itemName);
//     if (itemData) {
//       updateItem(index, { name: itemData.name, price: itemData.price });
//     }
//   };

//   const handleHomeServiceSelect = (serviceName: string) => {
//     const service = homeCleaningServices.find((s) => s.name === serviceName);
//     if (service) {
//       setHomeService(service.name);
//       setHomePrice(service.price.toString());
//     }
//   };

//   /** ---------------- UI ---------------- */
//   return (
//     <div className="max-w-4xl mx-auto animate-fade-in">
//       <div className="space-y-6">

//         {/* CUSTOMER DETAILS */}
//         <div className="card-elevated p-6">
//           <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

//           <div className="grid gap-4 sm:grid-cols-2">
//             <Input
//               placeholder="Customer Name"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//             <Input
//               placeholder="Phone Number"
//               value={customerPhone}
//               onChange={(e) => setCustomerPhone(e.target.value)}
//             />
//             <Input
//               placeholder="Address (optional)"
//               value={customerAddress}
//               onChange={(e) => setCustomerAddress(e.target.value)}
//               className="sm:col-span-2"
//             />
//             <Textarea
//               placeholder="Notes (optional)"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="sm:col-span-2"
//             />
//           </div>
//         </div>

//         {/* CHALLAN */}
//         <div className="card-elevated p-6">
//           <h2 className="text-lg font-semibold mb-4">Challan Number</h2>
//           <Input
//             placeholder="Enter challan number"
//             value={challanNo}
//             onChange={(e) => setChallanNo(e.target.value)}
//           />
//         </div>

//         {/* TOTAL */}
//         <div className="card-elevated p-6 flex justify-between">
//           <span className="text-lg font-medium">Estimated Total</span>
//           <span className="text-2xl font-bold text-primary">
//             ₹{calculateTotal().toLocaleString()}
//           </span>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex gap-3 justify-end">
//           <Button variant="outline" onClick={() => navigate('/orders')}>
//             Cancel
//           </Button>

//           {/* 🟢 NOW ALL BUTTONS CALL BACKEND */}
//           <Button variant="outline" onClick={() => handleSubmit('save')}>
//             <Save className="h-4 w-4 mr-2" />
//             Save Order
//           </Button>

//           <Button variant="outline" onClick={() => handleSubmit('save_tags')}>
//             <Tags className="h-4 w-4 mr-2" />
//             Save + Print Tags
//           </Button>

//           <Button onClick={() => handleSubmit('save_invoice')}>
//             <Receipt className="h-4 w-4 mr-2" />
//             Save + Generate Invoice
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateOrder;
