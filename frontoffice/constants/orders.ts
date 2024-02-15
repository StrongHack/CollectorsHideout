import { OrderType } from "../types";

// Order status enum
export const Status = [
  "Processing",
  "Shipped",
  "Delivered"
]

/** Default Order */
export const defaultOrder: OrderType = {
    ".id": "",
    trackingNumber: 0,
  userId: "",
  total: 0,
  iva: 0,
  status: "",
  orderDate: new Date(),
  mobileNumber: 0,
  nif: 0,
  billingAddress: "",
  shippingAddress: "",
  lines: [],
  };