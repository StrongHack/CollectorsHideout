import { OrderType } from "../types";

/* Default Auction */
export const defaultOrder: OrderType = {
    ".id": "",
    lines: [],    
    trackingNumber: 0,
    total: 0,
    userId: "",
    iva: 0,
    status: "",
    orderDate: new Date(),
    mobileNumber: 0,
    nif: 0,
    billingAddress: "",
    shippingAddress: "",
  
}
