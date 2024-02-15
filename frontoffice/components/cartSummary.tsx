import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CollectableType, LineType } from "../types";
import { checkout } from "../lib/checkout";
import toast from "react-hot-toast";

export function CartSummary({
  cartItems,
  collectableInfo,
}: {
  cartItems: LineType[];
  collectableInfo: CollectableType[];
}) {
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setDisabled] = useState(true);

  /**
   * Calculate the subtotal, shipping, and total for the order
   *
   * @returns payment amount
   */
  const calculateSubtotal = () => {
    if (!Array.isArray(cartItems) || !Array.isArray(collectableInfo)) {
      return 0;
    }

    return cartItems.reduce((total, item) => {
      const collectable = collectableInfo.find(
        (collectable) => collectable[".id"] === item.collectableId
      );
      return total + (collectable?.collectablePrice || 0) * item.quantity;
    }, 0);
  };

  /**
   * Calculate the shipping estimate for the order
   *
   * @param {number} subtotal - The subtotal for the order
   * @returns {number} - The shipping estimate
   */
  const calculateShippingEstimate = (subtotal: number) => {
    if (cartItems && cartItems.length === 0) {
      return 0;
    }

    const flatRate = 5;
    return subtotal > 50 ? 0 : flatRate; // Free shipping for orders over €50
  };

  /**
   * Calculate the total for the order
   *
   * @param {number} subtotal - The subtotal for the order
   * @param {number} shipping - The shipping estimate for the order
   * @returns {number} - The total for the order
   */
  const calculateOrderTotal = (subtotal: number, shipping: number) => {
    if (cartItems && cartItems.length === 0) {
      return 0;
    }

    return subtotal + shipping;
  };

  /**
   * Returns items in lines
   *
   * @returns items in lines
   */
  const getLineItems = () => {
    const lineItems: any[] = [];

    for (const item of cartItems) {
      const collectable = collectableInfo.find(
        (collectable) => collectable[".id"] === item.collectableId
      );

      lineItems.push({
        price: collectable?.collectablePrice.toString(),
        quantity: item.quantity,
      });
    }

    return lineItems;
  };

  useEffect(() => {
    if (cartItems && cartItems.length !== 0) {
      setIsLoading(false);
      setDisabled(false);
    } else {
      setIsLoading(true);
      setDisabled(true);
    }

    try {
      const newSubtotal = calculateSubtotal();
      const newShipping = calculateShippingEstimate(newSubtotal);
      const newTotal = calculateOrderTotal(newSubtotal, newShipping);

      setSubtotal(newSubtotal);
      setShipping(newShipping);
      setTotal(newTotal);
    } catch (error) {
      toast.error("Error calculating ammount to pay. Try refreshin the page.");
      setDisabled(true); //Disables payment button
    }
  }, [cartItems, collectableInfo]); // Recalculate when products change

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg border-2 border-gray-200 bg-nav-bg px-4 py-6 shadow-md sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">€{subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-sm font-medium">€{shipping.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium">Order total</dt>
          <dd className="text-base font-medium">€{total.toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          className="w-full"
          onPress={() => {
            checkout({
              lineItems: getLineItems(),
            });
          }}
          isDisabled={isDisabled}
          isLoading={isLoading}
        >
          {isLoading ? "Loading..." : "Checkout"}
        </Button>
      </div>
    </section>
  );
}
