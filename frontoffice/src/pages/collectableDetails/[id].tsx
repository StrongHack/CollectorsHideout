/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { CollectablesService } from "../../../services/collectablesService";
import { CollectableType, LineType } from "../../../types";
import { UploadService } from "../../../services/uploadService";
import { UserService } from "../../../services/userService";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils/cookies";
import { Link } from "@nextui-org/react";

export default function Home() {
  const router = useRouter();
  const [collectable, setCollectable] = useState<CollectableType | null>(null);
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();

  /**
   * Add the collectable to the cart
   */
  const handleAddToCart = async () => {
    if (!collectable) {
      return console.error("No collectable selected to add to cart");
    }

    const cartItem = transformToLineType(collectable);

    try {
      const userId = getCookie("userId");

      if (!userId) {
        return toast.error("Log in to add products to cart!");
      }

      //if the collectable is already in the cart, increase the quantity
      const cartItems = await UserService.getCartProducts(userId);
      const cartItemToUpdate = cartItems.find(
        (item: { collectableId: string }) =>
          item.collectableId === cartItem.collectableId
      );
      if (cartItemToUpdate) {
        cartItemToUpdate.quantity += 1;
        const response = await UserService.updateCart(userId, cartItemToUpdate);

        toast.success("Item added to cart");
        console.log("Item added to cart:", response);
        return;
      }
      const response = await UserService.addToCart(userId, cartItem);
      toast.success("Item added to cart");
      console.log("Item added to cart:", response);
    } catch (error) {
      toast.error("Error adding item to cart");
      console.error("Error adding item to cart:", error);
    }
  };

  /**
   * Handles click in image
   *
   * @param image clicked
   */
  const handleClick = (image: string) => {
    setSelectedImage(image);
  };

  /**
   * Transform the collectable to a line item
   *
   * @param {CollectableType} collectable - The collectable to transform
   * @returns {LineType} - The transformed collectable
   */
  function transformToLineType(collectable: CollectableType): LineType {
    return {
      collectableId: collectable[".id"],
      quantity: 1,
      discount: 0,
    };
  }

  useEffect(() => {
    const fetchCollectable = async () => {
      try {
        if (router.query.id) {
          CollectablesService.getCollectable(router.query.id as string).then(
            (collectableData) => {
              setCollectable(collectableData);

              try {
                UploadService.getImages(collectableData.collectableImages).then(
                  (images) => {
                    setImagesPaths(images);
                  }
                );
              } catch (error) {
                setImagesPaths([]);
              }
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollectable();
  }, [router.query.id]);

  useEffect(() => {
    if (imagesPaths.length > 0) {
      setSelectedImage(imagesPaths[0]);
    } else {
      setSelectedImage("/default.png");
    }
  }, [imagesPaths]);

  return (
    <section className="bg-white py-10">
      <div className="container max-w-screen-xl mx-auto px-4 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-5">
          <aside>
            <div className="container max-w-screen-xl mx-auto p-2 rounded-lg flex justify-center items-center">
              <img
                className="w-[500px] h-[450px] max-w-screen-xl mx-auto p-2 border border-gray-500 border-2 rounded-lg flex justify-center items-center"
                src={`${selectedImage}`}
                alt="Product title"
                width="300"
                height="300"
              />
            </div>
            {imagesPaths.length > 1 && (
              <div className="space-x-2 overflow-auto text-center whitespace-nowrap">
                {imagesPaths.map((image, index) => (
                  <Link
                    key={index}
                    className={`inline-block max-w-screen-xl mx-auto border border-gray-500 border-2 rounded-lg p-2 hover:border-blue-500 cursor-pointer ${
                      selectedImage === image ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleClick(image)}
                  >
                    <img
                      className="w-14 h-14 container thumbnail-image"
                      src={`${image}`}
                      alt={`Product image ${index + 1}`}
                      width="300"
                      height="300"
                    />
                  </Link>
                ))}
              </div>
            )}
          </aside>
          <main>
            <h2 className="font-bold text-3xl mb-4 text-black">
              {collectable?.collectableName}
            </h2>
            <p className="mb-4 font-semibold text-xl text-black">
              {collectable?.collectablePrice}€
            </p>
            <p className="mb-7 text-zinc-500 text-justify text-sm">
              {collectable?.collectableDescription}
            </p>
            <div className="flex flex-col">
              <ul className="mb-5 ">
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    Stock:
                  </b>
                  <b className="text-zinc-500 ml-[-45px]">
                    {collectable?.collectableStock}
                  </b>
                </li>
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    State:
                  </b>
                  <b className="text-zinc-500 ml-[-45px]">
                    {collectable?.collectableState}
                  </b>
                </li>
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    Edition:
                  </b>
                  <b className="text-zinc-500 ml-[-45px]">
                    {collectable?.collectableEdition}
                  </b>
                </li>
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    Rarity:
                  </b>
                  <b className="text-zinc-500 ml-[-45px]">
                    {collectable?.collectableRarity}
                  </b>
                </li>
              </ul>
              <div className="flex-1 flex flex-wrap gap-2 mb-5">
                <button
                  className="bg-teal-700 text-white hover:bg-teal-600 px-1 py-2 inline-bloc border border-transparent rounded-md w-2/5 h-3/5"
                  onClick={() => collectable && handleAddToCart()}
                >
                  <i className="fa fa-shopping-cart mr-2"></i>
                  Add to cart
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
