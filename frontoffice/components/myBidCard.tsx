import { AuctionBidCardProps } from "../types";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UploadService } from "../services/uploadService";
import { DateTimeUtils } from "../utils/dateTimeUtils";

export default function MyBidCard(props: AuctionBidCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  /**
   * Formats Date variables to string
   *
   * @param seconds
   * @returns formated date
   */
  const formatTime = (seconds: number) => {
    try {
      const endedStyle = seconds <= 0 ? "text-red-600 font-bold" : "text-black";
      const activeStyle = seconds > 0 ? "text-green-600 font-bold" : "text-black";

      if (seconds <= 0) {
        return <span className={endedStyle}>Auction Ended</span>;
      }

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      if (days > 0) {
        return (
          <span className={activeStyle}>
            {days} {days === 1 ? "day" : "days"}
          </span>
        );
      } else {
        return (
          <span className={activeStyle}>
            {hours}:{minutes < 10 ? "0" : ""}
            {minutes}:{remainingSeconds < 10 ? "0" : ""}
            {remainingSeconds}
          </span>
        );
      }
    } catch (error) {
      console.error(error);

      return (
        <span className="text-red-600 font-bold">
          Unknown
        </span>
      );
    }
  };

  useEffect(() => {
    if (props.auction.auctionImages && props.auction.auctionImages.length > 0) {
      UploadService.getImages(props.auction.auctionImages).then((images) => {
        setImagesPaths(images);
        setSelectedImage(images[0]);
      });
    } else {
      setSelectedImage("/default.png");
    }
  }, [props.auction.auctionImages]);

  return (
    <div
      key={props.auction[".id"]}
      className="w-[300px] h-[500px] m-2 bg-white rounded-lg shadow-md"
    >
      {/* Image */}
      <div className="w-full h-[250px] overflow-hidden">
        {selectedImage && (
          <Image
            alt="Auction image"
            src={selectedImage}
            className="w-full h-full object-cover object-center p-2"
          />
        )}
      </div>

      {/* Auction Information */}
      <div className="w-full h-[150px] px-3">
        {/* Auction Name*/}
        <div className="text-black text-xl font-bold text-md hover:text-orange-600">
          {props.auction.auctionName}
        </div>
        <div className="justify-between items-center mt-4">
          {/* Bids */}
          <p className="text-gray-700 text-lg">
            <strong>Minimum Bid:</strong>{" "}
            {props.auction.auctionMinimumBid.toFixed(2)}€
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Highest Bid:</strong>{" "}
            {props.auction.auctionHighestBid.toFixed(2)}€
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-900 text-xl">
            <strong>Time Left:</strong>{" "}
            {formatTime(
              DateTimeUtils.calculateTimeRemaining(props.auction.auctionEndDate.toString())
            )}
          </p>
        </div>
      </div>
      {/* Bid Button */}
      <div className="w-full h-[60px] flex items-center justify-center p-2">
        <Link href={`/auctionDetails/${props.auction[".id"]}`}>
          <div
            className="mx-auto bg-gray-700 hover:bg-gray-600 text-white py-2 px-20 rounded text-center"
          >
            View
          </div>
        </Link>
      </div>
    </div>
  );
}
