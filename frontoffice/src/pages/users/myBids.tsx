/* eslint-disable react-hooks/rules-of-hooks */

import { ModalActionType, AuctionType } from "../../../types";
import MyBidCard from "../../../components/myBidCard";
import { useEffect, useState } from "react";
import ProfileNavbar from "../../../components/profileNavbar";
import { useDisclosure } from "@nextui-org/react";
import { AuctionsService } from "../../../services/auctionService";
import { getCookie } from "../../../utils/cookies";
import toast from "react-hot-toast";

export default function myBids() {
  const [auction, setAuction] = useState<AuctionType[]>([]);
  const [auctionId, setAuctionId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * Fetches auctions
   */
  const fetchAuctions = async () => {
    try {
      const auctions = await AuctionsService.getAuctions();

      setAuction(auctions);
    } catch (err) {
      console.error(err);
      setAuction([]);
    }
  };

  /**
   * Opens modal to create a new auctions
   */
  const handleCreate = () => {
    const userId = getCookie('userId');

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }
    
    setAction("create");
    setAuctionId("");

    onOpen();
  };

  useEffect(() => {
    const userId = getCookie('userId');

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }
    
    fetchAuctions();
  }, []);

  return (
    <main className="flex h-full bg-gray-200 ">
      {/* Profile Navbar */}
      <div className="bg-black w-[25%] h-[90%] bg-gray-200 mx-auto p-4">
        <ProfileNavbar />
      </div>

      {/* List of auctions */}
      <div className="bg-black w-[80%] bg-gray-200 mx-auto p-4">
        <div className="w-full pr-8 flex flex-row justify-between">
          <h1 className="text-3xl text-black text-bold font-bold text-center my-4">
            My Bids
          </h1>
        </div>
        <div className="flex flex-wrap justify-start pl-4">
          {auction.filter(auction => auction.bids.some(bid => bid.bidderId === "a")).map((auction) => (
            <div key={auction[".id"]} className=" bg-gray-200 p-4 mb-4 mr-4">
              <div className="mx-auto">
                <MyBidCard onChange={fetchAuctions} auction={auction} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
