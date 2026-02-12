import axios from "axios";

/** Axios instance */
const api = axios.create({
  baseURL: "http://localhost:5000/v1/api",
  withCredentials: true
});

/* ================= AUTH ================= */

/** Login API */
export const loginUser = async (mobile: string, password: string) => {
  const res = await api.post("/auth/login", { mobile, password });
  return res.data;
};

/** Get My Store Info */
export const getStoreMe = async () => {
  const res = await api.get("/stores/me");
  return res.data;
};

/* ================= ORDERS ================= */

/** List orders paginated */
export const fetchOrders = async (params: { page?: number; limit?: number; status?: string; q?: string }) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

/** Get single order */
export const fetchOrderByIdApi = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

/** Create walk-in order */
export const createOrderApi = async (data: {
  challan_no: string;
  customerData: {
    mobile: string;
    full_name: string;
    address_line1: string;
    email?: string;
  };
  note?: string;
}) => {
  const res = await api.post("/orders", data);
  return res.data;
};

/** Update order status */
export const updateOrderStatusApi = async (
  orderId: string,
  to_status: string
) => {
  const res = await api.patch(`/orders/${orderId}/status`, { to_status });
  return res.data;
};

/* ================= ORDER ITEMS ================= */

/** Add item to order */
export const addOrderItemApi = async (
  orderId: string,
  item: {
    service_type: string;
    item_name: string;
    qty: number;
    unit_price: number;
  }
) => {
  const res = await api.post(`/orders/${orderId}/items`, item);
  return res.data;
};

/* ================= TAGS ================= */

/** Generate tags for order */
export const generateTagsApi = async (orderId: string) => {
  const res = await api.post(`/orders/${orderId}/tags/generate`);
  return res.data;
};

/** Print tags for order */
export const printTagsApi = async (orderId: string) => {
  const res = await api.post(`/orders/${orderId}/tags/print`);
  return res.data;
};

/* ================= INVOICES ================= */

/** Generate invoice for order */
export const generateInvoiceApi = async (orderId: string) => {
  const res = await api.post(`/orders/${orderId}/invoice`);
  return res.data;
};

/* ================= PAYMENTS ================= */

/** Record payment for order */
export const recordPaymentApi = async (
  orderId: string,
  data: { amount: number; method: string; note?: string }
) => {
  const res = await api.post(`/orders/${orderId}/payments`, data);
  return res.data;
};

/* ================= PICKUPS ================= */

/** List assigned pickup requests */
export const fetchPickupsApi = async () => {
  const res = await api.get("/pickup-requests");
  return res.data;
};

/** Convert pickup to order */
export const convertPickupApi = async (
  id: string,
  data: { challan_no: string; customer?: any }
) => {
  const res = await api.post(`/pickup-requests/${id}/convert`, data);
  return res.data;
};

export default api;
