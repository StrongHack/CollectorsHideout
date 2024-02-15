import { PublicationCardProps, PublicationType } from "../types";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PublicationsService } from "../services/publicationsService";
import { UploadService } from "../services/uploadService";
import toast from "react-hot-toast";

export default function PublicationCard(props: PublicationCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      if (props.publication.images && props.publication.images.length > 0) {
        UploadService.getImages(props.publication.images).then((images) => {
          setImagesPaths(images);
          setSelectedImage(images[0]);
        });
      } else {
        setSelectedImage("/default.png");
      }
    } catch (error) {
      setImagesPaths([]);
      setSelectedImage("/default.png");
    }
  }, [props.publication.images]);

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
    } catch (error) {
      return "00/00/0000"
    }
  };

  return (
    <div
      key={props.publication[".id"]}
      className="w-[300px] h-[520px] mx-1 bg-white rounded-lg shadow-md"
    >
      {/* Image */}
      <div className="w-full h-[290px] overflow-hidden">
        {selectedImage && (
          <Image
            alt="Publication image"
            src={selectedImage}
            className="w-[300px] h-[290px] object-cover object-center p-2"
          />
        )}
      </div>

      {/* Publication Information */}
      <div className="w-full h-[178px] px-3 overflow-hidden">
        {/* Publication Name and Description */}
        <div className="text-black text-lg font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.publication.title}
        </div>

        {/* Edition, State, Rarity */}
        <p className="text-gray-700 text-lg">
          <strong>Type:</strong> {props.publication.type}
        </p>
        <p className="text-gray-700 text-lg">
          <strong>State:</strong>{" "}
          {props.publication.type === "Display"
            ? "Not For Sale"
            : props.publication.state}
        </p>

        <p className="text-gray-700 text-lg">
          <strong>
            {props.publication.editDate ? "Last Edited Date: " : "Date: "}
          </strong>
          {props.publication.editDate
            ? formatDate(new Date(props.publication.editDate))
            : formatDate(new Date(props.publication.date))}
        </p>

        {/* Price and Add to Cart Button */}
        <div className="flex justify-between items-center mt-4">
          {props.publication.type === "Display" ? (
            <p className="text-gray-900 text-xl hover:text-orange-600"></p>
          ) : props.publication.state === "Sold" ? (
            <p className="text-gray-900 text-xl hover:text-orange-600">
              <strong>Already Sold</strong>
            </p>
          ) : (
            <p className="text-gray-900 text-xl hover:text-orange-600">
              <strong>Price: </strong>
              {props.publication.price}€
            </p>
          )}
        </div>
      </div>
      <div className="w-full h-[50px] flex items-center justify-center p-2">
        <Link
          href={`/publicationsDetails/${props.publication[".id"]}`}
          className="flex-1"
        >
          <div
            className="w-full mx-auto bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-center"
          >
            View
          </div>
        </Link>
      </div>
    </div>
  );
}
