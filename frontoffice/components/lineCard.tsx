/* eslint-disable react-hooks/exhaustive-deps */
import { CollectableType, LineType } from "../types";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { OrderService } from "../services/orderService";
import { CollectablesService } from "../services/collectablesService";
import { UploadService } from "../services/uploadService";

interface LineCardProps {
  line: LineType;
}

export default function LineCard(props: LineCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [collectables, setCollectables] = useState<CollectableType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  /**
   * Fetches collectables
   */
  const fetchCollectables = async () => {
    const collectables = await CollectablesService.getCollectables();

    setCollectables(collectables);
  };

  useEffect(() => {
    fetchCollectables();
  }, []);

  const targettedCollectable = collectables.find(collectable => collectable[".id"] === props.line.collectableId)

  useEffect(() => {
    if (
      targettedCollectable
    ) {
      UploadService.getImages(targettedCollectable.collectableImages).then(
        (images) => {
          setImagesPaths(images);
          setSelectedImage(images[0]);
        }
      );
    } else {
      setSelectedImage("/default.png")
    }
  }, []);
  
  return (
    <div
      key={props.line.collectableId}
      className="flex w-[900px] h-[200px] m-2 bg-gray-200 rounded-lg shadow-md overflow-hidden"
    >
      {/* Collectable Image */}
      <div className="w-1/3 h-full p-5 overflow-hidden justify-center">
        {selectedImage && (
          <Image
            alt="Collectable image"
            src={selectedImage}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>
  
      {/* Collectable Information */}
      <div className="w-1/2 h-full bg-gray-200 flex flex-col justify-center">
        {/* Collectable Name */}
        <div className="text-start mb-2 text-black text-lg font-bold">
          <h1 className="text-gray-800 text-xl">
            <strong>Name:</strong> {collectables.find(collectable => collectable[".id"] === props.line.collectableId)?.collectableName}
          </h1>
          <h1 className="text-gray-800 text-xl">
            <strong>State:</strong> {collectables.find(collectable => collectable[".id"] === props.line.collectableId)?.collectableState}
          </h1>
        </div>
      </div>
  
      {/* Discount and Quantity */}
      <div className="w-1/3 h-full flex flex-col justify-center items-center">
        <p className="text-gray-700 text-lg">
          <strong>Discount:</strong> {props.line.discount} %
        </p>
        <p className="text-gray-700 text-lg">
          <strong>Quantity:</strong> {props.line.quantity}
        </p>
        <p className="text-gray-700 text-lg">
        <strong>Price:</strong> {collectables.find(collectable => collectable[".id"] === props.line.collectableId)?.collectablePrice} €
        </p>
      </div>
    </div>
  );
  
}

