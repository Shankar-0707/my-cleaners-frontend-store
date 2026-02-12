import axios from "axios";

/** Axios instance */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/** Attach token automatically */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= AUTH ================= */

/** Login API */
export const loginUser = async (mobile: string, password: string) => {
  const res = await api.post("/auth/login", { mobile, password });
  return res.data;
};

/* ================= ORDERS ================= */

/** Create walk-in order */
export const createOrder = async (data: {
  challan_no: string;
  customer: { full_name: string; mobile: string };
}) => {
  const res = await api.post("/orders", data);
  return res.data;
};

/** Add item to order */
export const addOrderItem = async (
  orderId: string,
  data: {
    service_type: string;
    item_name: string;
    qty: number;
    unit_price: number;
  }
) => {
  const res = await api.post(`/orders/${orderId}/items`, data);
  return res.data;
};

/** Update order status */
export const updateOrderStatus = async (
  orderId: string,
  to_status: string
) => {
  const res = await api.patch(`/orders/${orderId}/status`, { to_status });
  return res.data;
};

/** Generate invoice */
export const generateInvoice = async (orderId: string) => {
  const res = await api.post(`/orders/${orderId}/invoice`);
  return res.data;
};

/** Add payment */
export const addPayment = async (
  orderId: string,
  data: { amount: number; method: string }
) => {
  const res = await api.post(`/orders/${orderId}/payments`, data);
  return res.data;
};

export default api;
