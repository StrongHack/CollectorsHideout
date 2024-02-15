/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { AuctionType } from "../../types";
import { AuctionsService } from "../../services/auctionService";
import AuctionCard from "../../components/auctionsCard";
import AuctionsFilter from "../../components/auctionsFilter";
import { Link } from "@nextui-org/react";

export default function Auctions() {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(isLoading) {
    return (<div className="min-h-screen bg-white"></div>);
  }

  if (!auctions || auctions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <img
            src="/images/refresh.png"
            alt="Refresh Icon"
            className="mx-auto mb-"
          />
          <Link href="/" className="text-blue-500 underline block mb-4">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-full min-h-screen bg-gray-200">
      {/* AuctionsFilter component */}
      <div className="flex-1 w-[25%] mb-6">
        <AuctionsFilter />
      </div>

      {/* List of auctions */}

      <div className="w-[75%] bg-gray-200">
        {/* Title Section */}
        <div className="py-2">
          <h2 className="mx-2 text-black text-bold text-3xl">Auctions</h2>
        </div>

        {/* Auction Cards Section */}
        <div className="flex flex-wrap">
          {auctions.map((auction: AuctionType) => (
            // eslint-disable-next-line react/jsx-key
            <AuctionCard auction={auction} />
          ))}
        </div>
      </div>
    </main>
  );
}
