import { useEffect, useState } from "react";
import { CartItems } from "../../../components/cartItems";
import { CartSummary } from "../../../components/cartSummary"; // Assuming this is the correct path
import { CollectableType, LineType } from "../../../types";
import { CollectablesService } from "../../../services/collectablesService";
import { UserService } from "../../../services/userService";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils/cookies";

export default function Page() {
  const [cartItems, setCartItems] = useState<LineType[]>([]);
  const [collectablesInfo, setCollectablesInfo] = useState<CollectableType[]>(
    []
  );
  const [userId, setUserId] = useState<string>("");

  /**
   * Fetch the cart items for the user
   */
  const fetchCartItems = async () => {
    try {
      const userId = getCookie("userId");

      if (!userId) {
        return toast.error("You must login to access your cart!");
      } else {
        setUserId(userId);
      }

      const cartResponse = await UserService.getCartProducts(userId);
      setCartItems(cartResponse);
      console.log(cartResponse);

      // Fetch details for each collectable in the cart
      const collectablesDetails = await Promise.all(
        cartResponse.map((item: { collectableId: string }) =>
          CollectablesService.getCollectable(item.collectableId)
        )
      );
      setCollectablesInfo(collectablesDetails);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen">
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-black">
          {" "}
          {/* Add text color for contrast */}
          Shopping Cart
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            {/* Cart Items */}
            <CartItems
              updateCartItems={fetchCartItems}
              cartItems={cartItems}
              setCartItems={setCartItems}
              collectableInfo={collectablesInfo}
              userId={userId || ""}
            />
          </section>
          <section className="lg:col-span-5">
            {/* Cart Summary */}
            <CartSummary
              cartItems={cartItems}
              collectableInfo={collectablesInfo}
            />
          </section>
        </form>
      </main>
    </div>
  );
}
