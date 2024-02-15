import Router from "next/router";
import { defaultAuction } from "../constants/auctions";
import { AuctionType, BidStatus, BidType } from "../types";
import { toast } from "react-hot-toast";

export class AuctionsService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/auctions`;

  /**
   * Gets all accepted auctions
   *
   * @returns all auctions in database
   */
  static async getAuctions(): Promise<AuctionType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        const errorMessage = await res.text();

        throw new Error(errorMessage);
      }

      const auctionsRes = await res.json();

      // Filters accepted auctions and maps id to .id
      const auctions = auctionsRes
        .filter((item: any) => item.auctionState === "Accepted")
        .map((item: any) => ({
          ...item,
          ".id": item.id, // Map the 'id' property to '.id'
        }));

      auctions.forEach((auction: any) => {
        delete auction.id;
      });

      return auctions;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Gets all accepted auctions
   *
   * @returns all auctions in database
   */
  static async getAllAuctions(): Promise<AuctionType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        const errorMessage = await res.text();

        throw new Error(errorMessage);
      }

      const auctionsRes = await res.json();

      // Filters accepted auctions and maps id to .id
      const auctions = auctionsRes
        .map((item: any) => ({
          ...item,
          ".id": item.id, // Map the 'id' property to '.id'
        }));

      auctions.forEach((auction: any) => {
        delete auction.id;
      });

      return auctions;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Gets auction by id
   *
   * @param id of auction to fetch
   * @returns auction by given id
   */
  static async getAuction(id: string): Promise<AuctionType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        const errorMessage = await res.text();

        throw new Error(errorMessage);
      }

      const auction = await res.json();

      //Modifies auction according to auctionType
      const modifiedAuction = {
        ...auction,
        ".id": auction.id,
      };

      delete modifiedAuction.id; // Remove the 'id' property

      return modifiedAuction;
    } catch (error) {
      console.error(error);

      return defaultAuction;
    }
  }

  /**
   * Creates a new auction with given data
   *
   * @param auction data of auction to create
   * @returns true if auction is created successfully, else false
   */
  static async createAuction(auction: AuctionType): Promise<boolean> {
    try {
      if (auction.auctionState !== "Accepted") {
        throw new Error("Auction state is not accepted.");
      }

      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auction),
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Creates a new bid with given data
   *
   * @param auctionId id of auction to create bid
   * @param newBid data of bid to create
   * @returns alert
   */
  static async updateAuctionNewBid(auctionId: string, newBid: BidType) {
    try {
      const auction = await AuctionsService.getAuction(auctionId);
      //const lastBid = auction.bids[auction.bids.length - 1];

      if (!auction) {
        throw new Error("Error fetching auction to bid.");
      }

      if (!auction.bids) {
        auction.bids = [];
      }

      auction.bids.push(newBid);

      auction.auctionHighestBid = newBid.bidAmount;

      auction.auctionMinimumBid =
        newBid.bidAmount + (auction.auctionBidIncrement ?? 0);

      /*
      if (auction.bids.length >= 2) {
        lastBid.bidStatus = BidStatus.Outbidded;
        console.error(lastBid);
      }
*/
      const response = await AuctionsService.updateAuction(auction);

      if (response) {
        toast.success("Bid created with success!");
      } else {
        throw new Error("Error updating auction!");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error creating a bid.");
    }
  }

  /**
   * Updates auction with given data
   *
   * @param updatedAuction data of auction to update
   * @returns true if update was successful, else false
   */
  static async updateAuction(updatedAuction: AuctionType): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.basePath}/${updatedAuction[".id"]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAuction),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Deletes auction by id
   *
   * @param auctionId id of auction to delete
   * @returns true if success, false otherwise
   */
  static async deleteAuction(auctionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${auctionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Updates auction state to closed
   *
   * @param auctionId id of auction to update state
   * @returns an alert
   */
  static async updateAuctionState(auctionId: string): Promise<boolean> {
    try {
      const auction = await AuctionsService.getAuction(auctionId);

      auction.bids.forEach((bid: BidType) => {
        //winner bid is the last bid
        if (bid === auction.bids[auction.bids.length - 1]) {
          bid.bidStatus = BidStatus.WinningBid;
          return;
        }
      });

      const response = await AuctionsService.updateAuction(auction);

      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
