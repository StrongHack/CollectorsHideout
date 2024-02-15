import { OrderType } from "../types";
import { defaultOrder } from "../constants/orders";
import { toast } from "react-hot-toast";

export class OrderService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/orders`;

  /**
   * Gets all orders
   *
   * @returns all orders
   */
  static async getOrders(): Promise<OrderType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        throw new Error("Error fetching orders");
      }

      const ordersRes = await res.json();

      const orders = ordersRes.map((item: any) => ({
        ...item,
        ".id": item.id, // Map the 'id' property to '.id'
      }));

      orders.forEach((order: any) => {
        delete order.id;
      });

      return orders;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Gets order by id
   *
   * @param id of order to fetch
   * @returns orders by id
   */
  static async getOrder(id: string): Promise<OrderType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        throw new Error(`Error fetching order ${id}`);
      }

      const order = await res.json();

      //Modifies order according to orderType
      const modifiedOrder = {
        ...order,
        ".id": order.id,
      };

      delete modifiedOrder.id;

      return modifiedOrder;
    } catch (error) {
      console.error(error);
      return defaultOrder;
    }
  }

  /**
   * Creates a new order
   *
   * @param order to be created
   * @returns true if order was created successfully, false otherwise
   */
  static async createOrder(order: OrderType): Promise<boolean> {
    try {
      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(errorMessage);
      }

      toast.success("Order created successfully!");
      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  /**
   * Updates order by id
   *
   * @param updatedOrder order to update
   * @returns true if updated successfully, false otherwise
   */
  static async updateOrder(updatedOrder: OrderType): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${updatedOrder[".id"]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        
        throw new Error(errorMessage);
      }

      toast.success("Order updated successfully");
      return true;
    } catch (error) {
      console.error(error);   
      
      return false;
    }
  }

  /**
   * Deletes order by id
   *
   * @param orderId id of orders to delete
   * @returns true if the order was successfully deleted, false otherwise
   */
  static async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
      
        throw new Error(errorMessage);
      }

      toast.success("Order deleted successfully");
      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
