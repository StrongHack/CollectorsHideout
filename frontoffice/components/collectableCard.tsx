import toast from "react-hot-toast";
import { UploadService } from "../services/uploadService";
import { UserService } from "../services/userService";
import { CollectableCardProps, CollectableType, LineType } from "../types";
import { Image, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookies";

export default function CollectableCard(props: CollectableCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("/default.png");
  const collectable = props.collectable;

  /** 
  * Add the collectable to the cart
  */
  const handleAddToCart = async () => {
    if (!collectable) {
      return toast.error('Error adding collectable to cart. Try again later.');
    }

    try {
      const cartItem = transformToLineType(collectable);
      const userId = getCookie('userId');

      if (!userId) {
        return toast.error('Please log in to add to cart!');
      }

      const cartItems = await UserService.getCartProducts(userId);
      const cartItemToUpdate = cartItems.find(
        (item: { collectableId: string; }) => item.collectableId === cartItem.collectableId
      );

      //if the collectable is already in the cart, increase the quantity
      if (cartItemToUpdate) {
        cartItemToUpdate.quantity += 1;
        await UserService.updateCart(userId, cartItemToUpdate);
        
        return toast.success("Item added to cart");
      }

      const response = await UserService.addToCart(userId, cartItem);
      toast.success("Item added to cart");
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error("Error adding item to cart");
    }
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
    if (
      props.collectable.collectableImages &&
      props.collectable.collectableImages.length > 0
    ) {
      try {
        UploadService.getImages(props.collectable.collectableImages).then(
          (images) => {
            setImagesPaths(images);
            setSelectedImage(images[0]);
          }
        );
      } catch (error) {
        setImagesPaths([]);
        setSelectedImage("/default.png");
      }
    } else {
      setSelectedImage("/default.png")
    }
  }, [props.collectable.collectableImages]);

  return (
    <div
      key={props.collectable[".id"]}
      className="w-[300px] h-[500px] m-2 bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-[250px] overflow-hidden">
        {selectedImage && (
          <Image
            alt="Collectable image"
            src={selectedImage}
            className="w-[300px] h-[250px] object-cover object-center p-2"
          />
        )}
      </div>

      {/* Product Information */}
      <div className="w-full h-[200px] px-3">
        {/* Product Name */}
        <div className="text-black text-xl font-bold text-md hover:text-orange-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.collectable.collectableName}
        </div>
        <div className="justify-between items-center mt-4">
          {/* Edition, State, Rarity */}
          <p className="text-gray-700 text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
            <strong>Edition:</strong> {props.collectable.collectableEdition}
          </p>
          <p className="text-gray-700 text-lg">
            <strong>State:</strong> {props.collectable.collectableState}
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Rarity:</strong> {props.collectable.collectableRarity}
          </p>
        </div>
        {/* Price and Add to Cart Button */}
        <div className="flex justify-between items-center mt-4 overflow-hidden overflow-ellipsis whitespace-nowrap">
          <p className="text-gray-900 text-xl">
            <strong>Price: </strong>
            {props.collectable.collectablePrice.toFixed(2)}€
          </p>
        </div>
      </div>
      <div className="w-full h-[50px] flex items-center justify-center p-2">
        <Link
          href={`/collectableDetails/${props.collectable[".id"]}`}
          className="flex-1"
        >
          <div
            className="bg-gray-700 hover:bg-gray-600 w-full mx-auto text-white py-2 rounded text-center"
          >
            View
          </div>
        </Link>
        <div className="mx-1"></div>
        <button
          onClick={() =>
            collectable &&
            handleAddToCart(
            )
          }
          className="flex-1 mx-auto bg-teal-700 text-white hover:bg-teal-600 px-1 py-2 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
