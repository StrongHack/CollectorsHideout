/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { AuctionsService } from "../../../services/auctionService";
import { AuctionType } from "../../../types";
import { formatDate } from "../../../constants/global";
import { UploadService } from "../../../services/uploadService";
import { useRouter } from "next/router";
import { DateTimeUtils } from "../../../utils/dateTimeUtils";
import { Link } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [auction, setAuction] = useState<AuctionType[] | null>(null);
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();
  const intervalRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [countdownTimers, setCountdownTimers] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});

  /**
   * Updates the countdown timer for the auction
   *
   * @param endDate
   * @param auctionId
   */
  const updateCountdownTimer = (
    startDate: string,
    endDate: string,
    auctionId: string
  ) => {
    try {
      // Clear any existing timer
      if (intervalRef.current[auctionId]) {
        clearInterval(intervalRef.current[auctionId]);
      }

      intervalRef.current[auctionId] = setInterval(() => {
        const seconds = DateTimeUtils.calculateTimeRemaining(endDate);

        if (seconds <= 0) {
          clearInterval(intervalRef.current[auctionId]);
        } else {
          setAuction((prevAuctions) => {
            if (!prevAuctions) return null;

            return prevAuctions.map((auction) => {
              if (auction[".id"] === auctionId) {
                return {
                  ...auction,
                  remainingTime: formatRemainingTime(startDate, endDate),
                };
              }
              return auction;
            });
          });
        }
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   * Verifies if the auction will start soon, is active or has ended
   *
   * @param startDate start date of the auction
   * @param endDate end date of the auction
   * @returns the remaining time of the auction
   */
  const formatRemainingTime = (startDate: string, endDate: string) => {
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
              <strong className="text-gray-600">Time Left:</strong>
              {"  "} {days} {days === 1 ? "day" : "days"}
            </span>
          );
        } else {
          return (
            <span className={activeStyle}>
              <strong className="text-gray-600">Time Left:</strong>
              {"  "} {hours}:{minutes < 10 ? "0" : ""}
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
      return <span className="text-red-600 font-bold">Unknown</span>;
    }
  };

  /**
   * Handles image click
   *
   * @param image clickedS
   */
  const handleClick = (image: string) => {
    try {
      setSelectedImage(image);
    } catch (error) {
      setSelectedImage("/default.png");
    }
  };

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        if (router.query.id) {
          console.log(router.query.id);
          AuctionsService.getAuction(router.query.id as string).then(
            (auctionData) => {
              setAuction([auctionData]);
              console.log(auctionData);
              try {
                UploadService.getImages(auctionData.auctionImages).then(
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
    fetchAuction();
  }, [router.query.id]);

  useEffect(() => {
    if (auction && auction.length > 0) {
      const firstAuction = auction[0];
      const timerKey = firstAuction[".id"];
      if (!countdownTimers[auction[0][".id"]]) {
        updateCountdownTimer(
          firstAuction.auctionStartDate.toString(),
          firstAuction.auctionEndDate.toString(),
          timerKey
        );
      }
    }
    // Cleanup
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(countdownTimers).forEach((timerId) =>
        clearInterval(timerId)
      );
    };
  }, [auction, countdownTimers]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
          <div>
            <div className="col-span-1 flex justify-center items-center">
              <img
                className="w-[500px] h-[400px] max-w-screen-xl mx-auto p-2 border border-gray-500 border-2 rounded-lg flex justify-center items-center"
                src={`${selectedImage}`}
                alt="Product title"
                width="400"
                height="340"
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
                      alt={`Auction image ${index + 1}`}
                      width="500"
                      height="500"
                    />
                  </Link>
                ))}
              </div>
            )}
            <aside className="items-center pt-3">
              <h2 className="font-bold text-2xl mb-4 text-black text-center">
                Collectable Information
              </h2>
              <div className="flex flex-col items-center">
                <ul className="mb-5 ">
                  <li className="mb-1 flex items-center">
                    <b className="font-medium w-36 inline-block text-black">
                      Collection:
                    </b>
                    <b className="text-zinc-600 ml-[-10px]">
                      {auction && auction[0]?.collectionName}
                    </b>
                  </li>
                  <li className="mb-1 flex items-center">
                    <b className="font-medium w-36 inline-block text-black">
                      Rarity:
                    </b>
                    <b className="text-zinc-600 ml-[-10px]">
                      {auction && auction[0]?.auctionProductRarity}
                    </b>
                  </li>
                  <li className="mb-1 flex items-center">
                    <b className="font-medium w-36 inline-block text-black">
                      State:
                    </b>
                    <b className="text-zinc-600 ml-[-10px]">
                      {auction && auction[0]?.auctionProductState}
                    </b>
                  </li>
                  <li className="mb-1 flex items-center">
                    <b className="font-medium w-36 inline-block text-black">
                      Edition:
                    </b>
                    <b className="text-zinc-600 ml-[-10px]">
                      {auction && auction[0]?.auctionProductEdition}
                    </b>
                  </li>
                  <li className="mb-1 flex items-center">
                    <b className="font-medium w-36 inline-block text-black">
                      Estimated Value:
                    </b>
                    <b className="text-zinc-600 ml-[-10px]">
                      {auction && auction[0]?.auctionProductEstimatedValue} €
                    </b>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
          <main>
            <h2 className="font-bold text-3xl text-black">
              {auction && auction[0]?.auctionName}
            </h2>
            <p className="mb-7 font-semibold text-zinc-600 text-justify text-sm">
              {auction && auction[0]?.auctionDescription}
            </p>
            <div className="flex flex-col">
              <ul className="mb-5 ">
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black ">
                    Started at:
                  </b>
                  <b className="text-zinc-500 ml-[-45px]">
                    {auction && auction[0]?.auctionStartDate && (
                      <p>
                        {formatDate(auction[0].auctionStartDate.toString())}
                      </p>
                    )}
                  </b>
                </li>
                <li className="mb-5 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    Ends at:
                  </b>
                  <b className="text-zinc-500 ml-[-45px]">
                    {auction && auction[0]?.auctionEndDate && (
                      <p>{formatDate(auction[0].auctionEndDate.toString())}</p>
                    )}
                  </b>
                </li>
                <li className="mb-3 flex items-center">
                  <span className="text-zinc-500">
                    {auction &&
                      auction[0]?.auctionEndDate &&
                      formatRemainingTime(
                        auction[0].auctionStartDate.toString(),
                        auction[0].auctionEndDate.toString()
                      )}
                  </span>
                </li>
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    Minimum Bid:
                  </b>
                  <b className="text-zinc-600 ml-[-10px]">
                    {auction && auction[0]?.auctionMinimumBid} €
                  </b>
                </li>
                <li className="mb-1 flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    Highest Bid:
                  </b>
                  <b className="text-zinc-600 ml-[-10px]">
                    {auction && auction[0]?.auctionHighestBid} €
                  </b>
                </li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
