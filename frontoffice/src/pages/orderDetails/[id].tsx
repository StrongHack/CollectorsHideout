/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { OrderService } from "../../../services/orderService";
import { OrderType } from "../../../types";
import LineCard from "../../../components/lineCard";

/**
 * Formats Date variables to string dd/mm/yyyy
 *
 * @param date Date
 * @returns formatted date
 */
const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export default function Home() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (router.query.id) {
          OrderService.getOrder(router.query.id as string).then((orderData) => {
            setOrder(orderData);
          });
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrder();
  }, [router.query.id]);

  return (
    <section className="bg-white py-10">
      <div className="container max-w-screen-xl mx-auto px-4">
        <h2 className="font-bold text-2xl mb-5 text-black">Order Details</h2>
        <main className="text-start">
          {/* Card for Specific Details */}
          <div
            className="bg-gray-200 shadow-lg rounded-lg p-6 mx-auto mb-10 border border-gray-300 flex justify-between"
            style={{ maxWidth: "70%" }}
          >
            {/* First Column */}
            <div className="flex flex-col justify-start">
              <p className="font-semibold text-lg text-black mb-4">
                <strong>Addresses</strong>
              </p>
              <p className="font-semibold text-md text-gray-700 mb-3">
                <strong>Billing Address:</strong> {order?.billingAddress}
              </p>
              <p className="font-semibold text-md text-gray-700 mb-3">
                <strong>Shipping Address:</strong> {order?.shippingAddress}
              </p>
            </div>

            {/* Second Column */}
            <div className="flex flex-col justify-start">
            <p className="font-semibold text-lg text-black mb-4">
                <strong>Info</strong>
              </p>
            <p className="font-semibold text-md text-gray-700 mb-3">
                <strong>Mobile Number:</strong> {order?.mobileNumber}
              </p>
              <p className="font-semibold text-md text-gray-700 mb-3">
                <strong>Tracking Number:</strong> {order?.trackingNumber}
              </p>
              <p className="font-semibold text-md text-gray-700 mb-3">
                <strong>NIF:</strong> {order?.nif}
              </p>
            </div>

            {/* Third Column */}
            <div className="flex flex-col justify-start mr-20">
            <p className="font-semibold text-lg text-black mb-4">
                <strong>Summary</strong>
              </p>
              <p className="font-semibold text-md text-gray-700 mb-3">
                <strong>Total:</strong> {order?.total} €
              </p>
            </div>
          </div>

          {/* Rest of the Content */}
          <h2 className="mt-10 font-bold text-2xl text-black">
            Product(s) Info
          </h2>
          <div className="flex flex-wrap justify-center pl-4">
            {order?.lines.map((line) => (
              <div key={line.collectableId}>
                <div className="mx-auto">
                  <LineCard line={line} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}

