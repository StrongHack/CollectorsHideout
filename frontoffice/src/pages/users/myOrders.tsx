/* eslint-disable react-hooks/rules-of-hooks */

import { ModalActionType, OrderType } from "../../../types";
import MyOrderCard from "../../../components/myOrderCard";
import { useEffect, useState } from "react";
import ProfileNavbar from "../../../components/profileNavbar";
import { useDisclosure } from "@nextui-org/react";
import { OrderService } from "../../../services/orderService";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils/cookies";

export default function myOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [orderId, setOrderId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * Fetches orders
   */
  const fetchOrders = async () => {
    try {
      const orders = await OrderService.getOrders();

      setOrders(orders);
    } catch (err) {
      console.error(err);

      setOrders([]);
    }
  };

  /**
   * Opens modal to create a new order
   */
  const handleCreate = () => {
    const userId = getCookie('userId');

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }
    
    setAction("create");
    setOrderId("");

    onOpen();
  };

  useEffect(() => {
    const userId = getCookie('userId');

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }
    
    fetchOrders();
  }, []);

  return (
    <main className="flex h-full min-h-screen bg-gray-200">
      {/* Profile Navbar */}
      <div className="bg-black w-[25%] h-[90%] bg-gray-200 mx-auto p-4">
        <ProfileNavbar />
      </div>

      {/* List of orders */}
      <div className="bg-black w-[80%] bg-gray-200 mx-auto p-4 justify-center">
        <div className="w-full pr-8 flex flex-row justify-between">
          <h1 className="text-3xl text-black text-bold font-bold text-center my-1">
            My Orders
          </h1>
        </div>
        <div className="flex flex-wrap justify-center pl-4">
          {orders.map((order) => (
            <div
              key={order[".id"]}
              className=" bg-gray-200 p-4 mr-2"
            >
              <div className="mx-auto">
                <MyOrderCard
                  onChange={fetchOrders}
                  order={order}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
