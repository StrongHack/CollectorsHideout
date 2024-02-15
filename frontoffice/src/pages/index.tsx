/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import { AuctionType, CollectableType, HomePageProps } from "../../types";
import { AuctionsService } from "../../services/auctionService";
import { CollectablesService } from "../../services/collectablesService";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import AuctionCard from "../../components/auctionsCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import {
  faMedal,
  faRotateLeft,
  faShieldHalved,
  faStar,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import CollectableCard from "../../components/collectableCard";
import { UploadService } from "../../services/uploadService";
import { DateTimeUtils } from "../../utils/dateTimeUtils";

export default function Homepage(props: HomePageProps) {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [collectables, setCollectables] = useState<CollectableType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const bannerImages = Array.from(
    { length: 5 },
    (_, i) => `/images/banners/banner${i + 1}.png`
  );
  const auctionSliderRef = useRef<HTMLDivElement>(null);
  const collectableSliderRef = useRef<HTMLDivElement>(null);

  /**
   * Fetches Auctions to display
   */
  const fetchAuctions = async () => {
    try {
      const auctions = await AuctionsService.getAuctions();
      setAuctions(auctions);
    } catch (error) {
      console.error(error);
      setAuctions([]);
    }
  };

  /**
   * Fetches collectables and filters collections for collectables
   */
  const fetchCollectables = async () => {
    try {
      const collectables = await CollectablesService.getCollectables();
      setCollectables(collectables);
    } catch (error) {
      console.error(error);
      setCollectables([]);
    }
  };

  useEffect(() => {
    fetchAuctions();
    fetchCollectables();
  }, []);

  // arrow functions to slide left the carousels
  const slideLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollLeft -= 235;
    }
  };

  // arrow functions to slide right the carousels
  const slideRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollLeft += 235;
    }
  };

  // find the auction with the minimum remaining time compare all active auctions using reduce and return the auction with the minimum remaining time
  const auctionWithMinRemainingTime = auctions
    .filter(
      (auction) =>
        DateTimeUtils.calculateTimeRemaining(
          auction.auctionEndDate.toString()
        ) > 0
    )
    .reduce((minAuction, currentAuction) => {
      if (!minAuction) {
        return currentAuction;
      }

      const minRemainingTime = DateTimeUtils.calculateTimeRemaining(
        minAuction.auctionEndDate.toString()
      );
      const currentRemainingTime = DateTimeUtils.calculateTimeRemaining(
        currentAuction.auctionEndDate.toString()
      );
      return currentRemainingTime < minRemainingTime
        ? currentAuction
        : minAuction;
    }, undefined as AuctionType | undefined);

  // Se o leilão mais recente foi encontrado, obtenha as informações
  useEffect(() => {
    if (auctionWithMinRemainingTime) {
      UploadService.getImages(auctionWithMinRemainingTime.auctionImages).then(
        (images) => {
          setImagesPaths(images);
          setSelectedImage(images[0]);
        }
      );
    } else {
      setSelectedImage("/default.png");
    }
  }, [auctionWithMinRemainingTime?.auctionImages]);

  // Boolean to check if there is any auction active
  const isAnyAuctionActive = Boolean(auctionWithMinRemainingTime);

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
      return (
        <span className="text-red-600 font-bold">
          Unknown
        </span>
      );
    }
  };

  return (
    <main>
      <div className="relative">
        <div className="flex flex-col bg-gray-200">
          {/* Banner Carrossel */}
          <div className="w-full">
            <Carousel showThumbs={false} autoPlay infiniteLoop>
              {bannerImages.map((image, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={index} src={image} alt={`Banner ${index + 1}`} />
              ))}
            </Carousel>
          </div>

          <div className="w-full bg-gray-200 h-20 flex items-center justify-center">
            <div className="flex justify-center space-x-5 text-xl">
              <div className="text-black font-semibold">
                <FontAwesomeIcon icon={faTruckFast} /> Fast Delivery
              </div>
              <div className="text-black font-semibold">
                <FontAwesomeIcon icon={faMedal} /> Authenticity
              </div>
              <div className="text-black font-semibold">
                <FontAwesomeIcon icon={faStar} /> Selected Products
              </div>
              <div className="text-black font-semibold">
                <FontAwesomeIcon icon={faRotateLeft} /> Easy Returns
              </div>
              <div className="text-black font-semibold">
                <FontAwesomeIcon icon={faShieldHalved} /> Secure Payment
              </div>
            </div>
          </div>

          <br></br>

          <div className="w-full bg-gray-200 h-60 flex items-center justify-center relative">
            {/* Barra horizontal laranja */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-full h-50 p-7 flex items-center"
              style={{
                background: "linear-gradient(to right, #008080, #39505d)",
              }}
            >
              <div className="w-60 h-60 mx-auto">
                <img src="/images/homeimage2.png" alt="Image 2" />
              </div>

              <div className="text-center w-1/3">
                {isAnyAuctionActive ? (
                  <div className="text-center">
                    {selectedImage && (
                      <Link href={`/auctions`} passHref>
                      <img
                        alt="Collectable image"
                        src={selectedImage ? selectedImage : "/default.png"}
                        className="w-[200px] h-[200px] object-cover object-center p-2 rounded-full mx-auto"
                      />
                      </Link>
                    )}
                    <p className="text-xl font-bold">
                      You don't want to miss this opportunity!
                    </p>
                    <p className="text-white">
                      Remaining Time:{" "}
                      {formatTime(
                        DateTimeUtils.calculateTimeRemaining(
                          auctionWithMinRemainingTime?.auctionEndDate.toString() ||
                          ""
                        )
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl font-bold">More coming soon!</p>
                )}
              </div>

              <div className="w-60 h-60 mx-auto">
                <img src="/images/homeimage1.png" alt="Image 1" />
              </div>
            </div>
          </div>

          <br></br>
          <br></br>

          <div className=" bg-gray-200 w-60 h-30 flex mb-6">
            <img className="pl-10" src="/images/c.png" />
          </div>

          {/* Collectables Carrossel */}
          <div className="trending bg-gray-200 mb-6">
            <div
              className="flex items-center mx-auto overflow-x-hidden"
              style={{ maxWidth: "1690px" }}
            >
              <button
                title="scroll left"
                onClick={() => slideLeft(collectableSliderRef)}
                className="mr-2 pl-3 text-black"
              >
                <AiOutlineArrowLeft />
              </button>
              <div
                className="flex overflow-x-auto whitespace-nowrap overflow-x-hidden"
                ref={collectableSliderRef}
              >
                {collectables.map((collectable) => (
                  <div key={collectable[".id"]} className="inline-block mr-2">
                      <CollectableCard collectable={collectable} />
                  </div>
                ))}
              </div>
              <button
                title="scroll right"
                onClick={() => slideRight(collectableSliderRef)}
                className="ml-2 pr-3 text-black"
              >
                <AiOutlineArrowRight />
              </button>
            </div>
          </div>

          <div
            className="w-full h-[80%] bg-red-500 p-7 flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(to right, #155542, #39505d)",
            }}
          >
            <div className="w-full h-full flex justify-evenly items-center space-x-4">
              {/* Collections List*/}
              <Link className="h-full w-1/5 bg-white" href="/collections">
                <div>
                  <img src="/images/banners/col1.png" />
                </div>
              </Link>

              <Link className="h-full w-1/5 bg-white" href="/collections">
                <div>
                  <img src="/images/banners/col2.png" />
                </div>
              </Link>

              <Link className="h-full w-1/5 bg-white" href="/collections">
                <div>
                  <img src="/images/banners/col3.png" />
                </div>
              </Link>

              <Link className="h-full w-1/5 bg-white" href="/collections">
                <div>
                  <img src="/images/banners/col4.png" />
                </div>
              </Link>

              <Link className="h-full w-1/5 bg-white" href="/collections">
                <div className="">
                  <img src="/images/banners/col5.png" />
                </div>
              </Link>
            </div>
          </div>

          <div className=" bg-gray-200 w-60 h-30 flex mb-6">
            <img className="pl-10" src="/images/a.png" />
          </div>

          {/* Auctions Carrossel */}
          <div className="trending bg-gray-200">
            <div
              className="flex items-center mx-auto overflow-x-hidden"
              style={{ maxWidth: "1690px" }}
            >
              <button
                title="scroll left"
                onClick={() => slideLeft(auctionSliderRef)}
                className="mr-2 pl-3 text-black"
              >
                <AiOutlineArrowLeft />
              </button>
              <div
                className="flex overflow-x-auto whitespace-nowrap overflow-x-hidden"
                ref={auctionSliderRef}
              >
                {auctions.map((auction) => (
                  <div key={auction[".id"]} className="inline-block mr-2">
                    <Link href={`/auction/${auction[".id"]}`} passHref>
                      <AuctionCard auction={auction} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                title="scroll right"
                onClick={() => slideRight(auctionSliderRef)}
                className="ml-2 pr-3 text-black"
              >
                <AiOutlineArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}