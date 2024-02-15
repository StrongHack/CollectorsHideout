import { useEffect, useState } from "react";
import { BidLogicProps, BidStatus, BidType, UserType } from "../types";
import { defaultBid } from "../constants/auctions";
import { AuctionsService } from "../services/auctionService";
import { Input, user } from "@nextui-org/react";
import { getCookie } from "../utils/cookies";
import toast from "react-hot-toast";
import { UserService } from "../services/userService";

export default function BidLogic(props: BidLogicProps) {
  const [bidData, setBidData] = useState<BidType>(defaultBid);
  const [disableBid, setDisableBid] = useState<boolean>(true);
  const [alert, setAlert] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>([]);

  /**
   * Handles the bid submission
   *
   * @param event submit event
   */
  const handleBidSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      let highestBidAmount = props.auction?.auctionHighestBid || 0;
      let minimumBidAmount = props.auction?.auctionMinimumBid;
      highestBidAmount = minimumBidAmount ?? 0;

      if (bidData.bidAmount < props.auction!.auctionMinimumBid) {
        return toast.error(
          "Bid amount must be " + minimumBidAmount + "€ or higher"
        );
      }

      minimumBidAmount =
        highestBidAmount + (props.auction?.auctionBidIncrement ?? 0);

      const bidderId = getCookie("userId");

      if (!bidderId) {
        return toast.error("Log in to bid in auction");
      }

      // Create new bid object
      const newBid: BidType = {
        bidderId: bidderId,
        bidAmount: bidData.bidAmount,
        bidTime: new Date(),
        bidStatus: BidStatus.HighestBid,
      };

      await AuctionsService.updateAuctionNewBid(
        props.auction?.[".id"] || "",
        newBid
      );
      await props.updateBid();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles the bid amount change
   *
   * @param event change event
   */
  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { value } = event.target;

      setBidData((prevBidData) => ({
        ...prevBidData,
        bidAmount: parseFloat(value),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * fetches users
   */
  const fetchUsers = async () => {
    try {
      const users = await UserService.getUsers();

      setUsers(users);
    } catch (error) {
      toast.error("Error fetching users");

      setUsers([]);
    }
  };

  useEffect(() => {
    try {
      if (props.auction) {
        const dateNow = Date.now();
        const endDate = new Date(props.auction.auctionEndDate);
        const startDate = new Date(props.auction.auctionStartDate);

        if (startDate.getTime() > dateNow) {
          setAlert("Auction has not started yet");
          return setDisableBid(true);
        } else if (endDate.getTime() < dateNow) {
          const lastBid =
            props.auction.bids && props.auction.bids.length > 0
              ? props.auction.bids[props.auction.bids.length - 1]
              : null;

          const winnerBidderId = lastBid ? lastBid.bidderId : null;

          if (winnerBidderId) {
            fetchUsers();
            const winner = users.find((user) => user[".id"] === winnerBidderId);

            setAlert(
              winner
                ? `Auction has ended!\nWinner is: ${winner.userUsername}\nPlease contact the support to arrange delivery of the item.`
                : "Auction has ended!"
            );
          }
          return setDisableBid(true);
        } else {
          return setDisableBid(false);
        }
      }
    } catch (error) {
      console.error(error);

      setDisableBid(true);
    }
  }, [props]);

  return (
    <form onSubmit={handleBidSubmit}>
      {!disableBid && (
        <label>
          Bid Amount:
          <Input
            type="number"
            label="Enter your bid amount"
            onChange={handleBidChange}
          />
        </label>
      )}
      <div className="pt-4">
        {!disableBid ? (
          <button
            type="submit"
            className="px-1 py-2 inline-block border border-transparent rounded-md bg-teal-700 text-white hover:bg-teal-600 w-full"
          >
            <i className="fa fa-shopping-cart mr-2"></i>
            Place Bid
          </button>
        ) : (
          <p className="text-red-500 text-md font-bold mt-2">{alert}</p>
        )}
      </div>
    </form>
  );
}
