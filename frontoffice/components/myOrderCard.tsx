import { OrderType } from "../types";
import Link from "next/link";
import { useState } from "react";
import { OrderService } from "../services/orderService";
import { Divide } from "lucide-react";
import toast from "react-hot-toast";
import { UploadService } from "../services/uploadService";

interface OrderCardProps {
  order: OrderType;
  onChange: Function;
}

export default function MyOrderCard(props: OrderCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  /**
   * Formats Date variables to string dd/mm/yyyy
   *
   * @param date Date
   * @returns formatted date
   */
  const formatDate = (date: Date) => {
    try {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (e) {
      console.error(e);

      return "00/00/0000";
    }
  };

  /**
   * Handles deletion of order
   *
   * @param orderId id of order to delete
   */
  const handleDelete = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const success = await OrderService.deleteOrder(orderId);

        if (!success) {
          throw new Error("Error deleting order");
        }

        toast.success("Order deleted successfully!");
        props.onChange();
      } catch (err) {
        console.error(err);
        toast.error("Error deleting order. Please try again later.");
      }
    }
  };

  return (
    <div
      key={props.order[".id"]}
      className="flex w-[800px] h-[260px] m-2 bg-white rounded-lg shadow-md"
    >
      {/* Order Information Section */}
      <div className="flex-grow p-3">
        <div className="text-center mb-4 text-black text-lg font-bold">
          <h1 className="text-gray-800 text-xl">
            <strong>Tracking Number:</strong> {props.order.trackingNumber}
          </h1>
        </div>

        <p className="text-gray-700 text-lg">
          <strong>Billing Address:</strong> {props.order.billingAddress}
        </p>
        <p className="text-gray-700 text-lg">
          <strong>Shipping Address:</strong> {props.order.shippingAddress}
        </p>
        <p className="text-gray-700 text-lg">
          <strong>Mobile Number:</strong> {props.order.mobileNumber}
        </p>
        <p className="text-gray-700 text-lg">
          <strong>NIF:</strong> {props.order.nif}
        </p>
        <p className="text-gray-700 text-lg">
          <strong>Date of Order:</strong>{" "}
          {formatDate(new Date(props.order.orderDate))}
        </p>
        <p className="text-gray-900 text-xl hover:text-orange-600">
          <strong>Status: </strong>
          {props.order.status}
        </p>
        <p className="text-gray-900 text-xl">
          <strong>Total: </strong>
          {props.order.total}€
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col w-[150px] p-4">
        {" "}
        {/* Adjust the width as needed */}
        <Link
          href={`/orderDetails/${props.order[".id"]}`}
          className="flex-1 w-full h-full"
        >
          <div className="bg-gray-700 hover:bg-gray-400 text-white rounded text-center flex items-center justify-center w-full h-full">
            View
          </div>
        </Link>
        <Divide className="h-4" />
        <button
          className="flex-1 w-full h-full bg-red-800 hover:bg-red-300 text-white rounded text-center flex items-center justify-center"
          onClick={() => handleDelete(props.order[".id"])}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
