import { defaultOrder } from "../constants/orders";
import { OrdersService } from "../services/ordersService";
import { OrderType } from "../types";

//test if getOrder returns false when id doesn't exist
test("getOrder should return defaultOrder if order does not exist", async () => {
  const orderId = "randomNonExistingId";

  const success = await OrdersService.getOrder(orderId);

  expect(success).toBe(defaultOrder);
});

//test if createOrder returns false when order doest not exist
test("createOrder should return false when order does not exist", async () => {
  let order: OrderType = {
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
  };

  const success = await OrdersService.createOrder(order);

  expect(success).toBeFalsy();
});

//test if updateOrder returns false when order to update doesn't exist
test("updateOrder should return false if order does not exist", async () => {
    const success = await OrdersService.updateOder(defaultOrder);

    expect(success).toBeFalsy();
});

//test if deleteOrder returns false when id doesn't exist
test("deleteOrder should return false if order does not exist", async () => {
    const orderId = "randomNonExistingId";

    const success = await OrdersService.deleteOrder(orderId);

    expect(success).toBeFalsy();
});