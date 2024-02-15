import {
  ModalActionType,
  PublicationCardProps,
  PublicationType,
} from "../types";
import { Image, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicationsService } from "../services/publicationsService";
import { UploadService } from "../services/uploadService";
import toast from "react-hot-toast";
import PublicationModal from "./publicationModal";
import { defaultPublication } from "../constants/publications";

export default function MyPublicationCard(props: PublicationCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [publicationId, setPublicationId] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<ModalActionType>("edit");

  useEffect(() => {
    if (props.publication.images && props.publication.images.length > 0) {
      UploadService.getImages(props.publication.images).then((images) => {
        setImagesPaths(images);
        setSelectedImage(images[0]);
      });
    } else {
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
      return "00/00/0000";
    }
  };

  /**
   * Handles deletion of publication
   *
   * @param publicationId id of the publication to delete
   */
  const handleDelete = async (publicationId: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        const success = await PublicationsService.deletePublication(
          publicationId
        );

        if (!success) {
          toast.error("Error deleting publication");
        }

        props.onChange();
      } catch (error) {
        console.error(error);

      }
    }
  };

  return (
    <div
      key={props.publication[".id"]}
      className="w-[300px] h-[520px] m-2 bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-[290px] overflow-hidden">
        {selectedImage && (
          <Image
            alt="Collectable image"
            src={selectedImage}
            className="w-[300px] h-[290px] object-cover object-center p-2"
          />
        )}
      </div>

      {/* Publication Information */}
      <div className="w-full h-[180px] px-3">
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
            <p className="text-gray-900 text-xl hover:text-orange-600">
              <strong>Only For Display</strong>
            </p>
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
          <div className="bg-gray-700 text-white hover:bg-gray-600 w-full mx-auto py-2 rounded text-center">
            View
          </div>
        </Link>
        <div className="px-1"></div>
        <button
          className="flex-1 mx-auto bg-gray-500 hover:bg-gray-400 text-white px-1 py-2 rounded"
          onClick={() => props.edit(props.publication[".id"])}
        >
          Edit
        </button>
        <div className="px-1"></div>
        <button
          className="flex-1 mx-auto bg-red-800 hover:bg-red-700 text-white px-1 py-2 rounded"
          onClick={() => handleDelete(props.publication[".id"])}
        >
          Remove
        </button>
      </div>
      <PublicationModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        updateTable={props.updateTable}
        id={publicationId}
        action={action}
      />
    </div>
  );
}
