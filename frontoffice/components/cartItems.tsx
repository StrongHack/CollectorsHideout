import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { CartItemsEmpty } from "./cartItemsEmpty";
import { useEffect, useState } from "react";
import { CollectableType, LineType } from "../types/index";
import { UserService } from "../services/userService";
import { UploadService } from "../services/uploadService";
import toast from "react-hot-toast";

export function CartItems({
  cartItems,
  setCartItems,
  collectableInfo,
  userId,
  updateCartItems,
}: {
  cartItems: LineType[];
  setCartItems: React.Dispatch<React.SetStateAction<LineType[]>>;
  collectableInfo: CollectableType[];
  userId: string;
  updateCartItems: Function;
}) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);

  /**
   * Handle changes to the quantity of a collectable
   *
   * @param {string} collectableId - The ID of the collectable
   * @param {number} quantity - The new quantity
   */
  const handleQuantityChange = async (
    collectableId: string,
    quantity: number,
    userId: string
  ) => {
    try {
      const updatedCartItems: LineType[] = cartItems
        .map((item) => {
          if (item.collectableId === collectableId) {
            // Update the quantity of the specific item
            return { ...item, quantity: quantity };
          }
          return item; // Return the unchanged item for other elements
        })
        .filter((item): item is LineType => item !== undefined); // Filter out undefined items

      const cartProductToUpdate = cartItems.find(
        (item) => item.collectableId === collectableId
      );

      if (cartProductToUpdate) {
        const updatedCartProduct = { ...cartProductToUpdate, quantity };

        const response = await UserService.updateCart(
          userId,
          updatedCartProduct
        );

        setCartItems(updatedCartItems);
        toast.success(`Cart updated to ` + quantity + ` items`);
      } else {
        toast.error("Item to update doesn't exist. Try refreshing the page.");
      }
    } catch (error) {
      toast.error("Error updating cart. Try again later.");
      console.error(error);
    }
  };

  /**
   * Remove a collectable from the cart
   *
   * @param {string} collectableId - The ID of the collectable to remove
   * @param {string} userId - The ID of the user
   */
  const handleRemoveCollectable = async (
    collectableId: string,
    userId: string
  ) => {
    try {
      const response = await UserService.removeFromCart(userId, collectableId);
      setCartItems(response.updatedCartItems);

      updateCartItems();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Error removing collectable from cart. Try again later.");
    }
  };

  useEffect(() => {
    if (collectableInfo && collectableInfo.length > 0) {
      try {
        const imagePaths = collectableInfo.map((collectable) => {
          return collectable.collectableImages.length > 0
            ? collectable.collectableImages[0]
            : "";
        });

        UploadService.getImages(imagePaths).then((images) => {
          setImagesPaths(images);
        });
      } catch (error) {
        setImagesPaths(["/default.png"]);
      }
    } else {
      setImagesPaths(["/default.png"]);
    }
  }, [collectableInfo, cartItems]);

  if (cartItems && cartItems.length === 0) {
    return <CartItemsEmpty />;
  }

  return (
    <ul
      role="list"
      className="divide-y divide-gray-200 border-y border-gray-200 divide-gray-500 border-gray-500"
    >
      {collectableInfo &&
        collectableInfo.map((collectable, index) => (
          <li
            key={collectable[".id"]}
            className="flex py-6 sm:py-10 text-black"
          >
            <div className="shrink-0">
              <Image
                src={imagesPaths[index] || "/default.png"}
                alt={collectable.collectableName}
                width={200}
                height={200}
                className="h-24 w-24 rounded-md border-2 border-gray-200 object-cover object-center sm:h-48 sm:w-48 border-gray-800"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
              <div className="relative justify-between pr-9 sm:flex sm:gap-x-6 sm:pr-0">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-sm">
                      <Link
                        href={`/collectableDetails/${collectable[".id"]}`}
                        className="text-2xl font-medium"
                      >
                        {collectable.collectableName}
                      </Link>
                    </h3>
                  </div>
                  <p className="mt-1 text-sm font-small">
                    <strong>State:</strong> {collectable.collectableState}
                  </p>
                  <p className="mt-1 text-sm font-small">
                    <strong>Edition:</strong>{" "}
                    {collectable.collectableEdition.slice(0, 20)}
                  </p>
                  <p className="mt-1 text-sm font-small">
                    <strong>Rarity:</strong> {collectable.collectableRarity}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0 sm:pr-9">
                  <div className="absolute right-0 top-0">
                    <Button
                      aria-label="Remove"
                      className="text-gray-400 hover:text-gray-500"
                      style={{
                        zIndex: 9999,
                      }}
                      onClick={() =>
                        collectable &&
                        handleRemoveCollectable(collectable[".id"], userId)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="darkRed"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </div>
                  <div className="absolute right-0 top-0">
                    <p className="mt-12 text-lg font-large">
                      <strong>Price:</strong> {collectable.collectablePrice}€
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm">
                <div className="flex justify-between items-center text-sm">
                  <div className="mr-2">
                    <span>Quantity:</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={
                        Array.isArray(cartItems)
                          ? cartItems.find(
                              (item) =>
                                item.collectableId === collectable[".id"]
                            )?.quantity
                          : 0
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          collectable[".id"],
                          parseInt(e.target.value),
                          userId
                        )
                      }
                      className="quantity-input mt-1 block w-[30%] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span>Ships in 1 week</span>
                </div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}
