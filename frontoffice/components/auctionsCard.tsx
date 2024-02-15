import Link from "next/link";
import { AuctionCardProps, AuctionType } from "../types";
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { UploadService } from "../services/uploadService";
import { DateTimeUtils } from "../utils/dateTimeUtils";

export default function AuctionCard(props: AuctionCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [remainingTime, setRemainingTime] = useState(0);

  /**
   * Formats Date variables to string
   *
   * @param startDate start date
   * @param endDate end date
   * @returns string formatted date
   */
  const formatTime = (startDate: string, endDate: string) => {
    try {
      const currentDateTime = new Date();
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      // auction not started yet
      if (currentDateTime < startDateTime) {
        return (
          <span className="text-green-600 font-bold">
            Auction Starting Soon!
          </span>
        );
      } else if (
        currentDateTime >= startDateTime &&
        currentDateTime < endDateTime
      ) {
        // auction started and show remaining time
        const seconds = DateTimeUtils.calculateTimeRemaining(endDate);
        const activeStyle =
          seconds > 0 ? "text-green-600 font-bold" : "text-black";

        if (seconds <= 0) {
          return <span className="text-red-600 font-bold">Auction Ended</span>;
        }

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (days > 0) {
          return (
            <span className={activeStyle}>
              <strong className="text-gray-600">Time Left:</strong> {days}{" "}
              {days === 1 ? "day" : "days"}
            </span>
          );
        } else {
          return (
            <span className={activeStyle}>
              <strong>Time Left:</strong> {hours}:{minutes < 10 ? "0" : ""}
              {minutes}:{remainingSeconds < 10 ? "0" : ""}
              {remainingSeconds}
            </span>
          );
        }
      } else {
        // auction ended
        return <span className="text-red-600 font-bold">Auction Ended</span>;
      }
    } catch (error) {
      return <span className="text-red-600 font-bold">Unkown</span>;
    }
  };

  const calculateRemainingTime = () => {
    try {
      const now = new Date();
      const endTime = new Date(props.auction.auctionEndDate);
      const timeDifference = endTime.getTime() - now.getTime();

      if (timeDifference <= 0) {
        return 0;
      }

      return timeDifference;
    } catch (error) {
      return -1;
    }
  };

  useEffect(() => {
    if (props.auction.auctionImages && props.auction.auctionImages.length > 0) {
      try {
        UploadService.getImages(props.auction.auctionImages).then((images) => {
          if (images.length !== 0) {
            setImagesPaths(images);
          }

          setSelectedImage(images[0]);
        });
      } catch (error) {
        setImagesPaths([]);
        setSelectedImage("/default.png");
      }
    } else {
      setImagesPaths([]);
      setSelectedImage("/default.png");
    }
  }, [props.auction.auctionImages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000); // Update every second

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [props.auction.auctionEndDate]);

  return (
    <div
      key={props.auction[".id"]}
      className="w-[300px] h-[515px] m-2 bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-[290px] overflow-hidden">
        {selectedImage && (
          <Image
            alt="Auction image"
            src={selectedImage ? selectedImage : "/default.png"}
            className="w-[300px] h-[290px] object-cover object-center p-2"
          />
        )}
      </div>
      {/* Auction Information */}
      <div className="w-full h-[150px] px-3">
        {/* Auction Name*/}
        <div className="text-black text-xl font-bold text-md hover:text-orange-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.auction.auctionName}
        </div>
        {/* Auction Description */}
        <div className="text-black text-md overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.auction.collectionName}
        </div>
        <div className="justify-between items-center mt-4">
          {/* Bids */}
          <p className="text-gray-700 text-l overflow-hidden overflow-ellipsis whitespace-nowrap">
            <strong>Minimum Bid:</strong>{" "}
            {props.auction.auctionMinimumBid.toFixed(2)}€
          </p>
          <p className="text-gray-700 text-l overflow-hidden overflow-ellipsis whitespace-nowrap">
            <strong>Highest Bid:</strong>{" "}
            {props.auction.auctionHighestBid.toFixed(2)}€
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-900 text-x">
            {formatTime(
              props.auction.auctionStartDate.toString(),
              props.auction.auctionEndDate.toString()
            )}
          </p>
        </div>
      </div>
      {/* Bid Button */}
      <div className="w-full h-[90px] flex items-center justify-center p-2">
        <Link href={`/auctionDetails/${props.auction[".id"]}`}>
          <div className="mx-auto bg-gray-700 text-white hover:bg-gray-600 py-2 px-20 rounded text-center">
            View
          </div>
        </Link>
      </div>
    </div>
  );
}
