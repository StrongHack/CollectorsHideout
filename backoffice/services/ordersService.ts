import { defaultOrder } from "../constants/orders";
import { OrderType } from "../types";
import toast from "react-hot-toast";

export class OrdersService {
  //private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/orders`;
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
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
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
      if (error instanceof Error) {
        toast.error(`Error getting orders: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting orders: ${error}`);
      }

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
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return defaultOrder;
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
      if (error instanceof Error) {
        toast.error(`Error getting order: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting order: ${error}`);
      }

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
        toast.error(errorMessage);

        return false;
      }

      toast.success("Order created successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating order: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating order: ${error}`);
      }

      return false;
    }
  }

  /**
   * Updates order by id
   *
   * @param updatedOrder order to update
   * @returns true if updated successfully, false otherwise
   */
  static async updateOder(updatedOrder: OrderType): Promise<boolean> {
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
        toast.error(errorMessage);

        return false;
      }

      toast.success("Order updated successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating order: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating order: ${error}`);
      }

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
        toast.error(errorMessage);

        return false;
      }

      toast.success("Order deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting order: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting order: ${error}`);
      }

      return false;
    }
  }
}
