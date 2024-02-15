import { defaultAuction } from "../constants/auctions";
import { AuctionType } from "../types";
import toast from "react-hot-toast";

export class AuctionsService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/auctions`;

  /**
   * Gets all auctions
   *
   * @returns all auctions in database
   */
  static async getAuctions(): Promise<AuctionType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
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
      if (error instanceof Error) {
        toast.error(`Error getting auctions: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting auctions: ${error}`);
      }

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
        toast.error(errorMessage);

        return defaultAuction;
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
      if (error instanceof Error) {
        toast.error(`Error getting auction: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting auction: ${error}`);
      }

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
        toast("A auction must be accepted at creation!");

        return false;
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
        toast.error(errorMessage);

        return false;
      }

      toast.success("Auction created with success!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating auction: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating auction: ${error}`);
      }

      return false;
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
        toast.error(errorMessage);

        return false;
      }

      toast.success("Auction updated successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating auction: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating auction: ${error}`);
      }

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
        toast.error(errorMessage);

        return false;
      }

      toast.success("Auction deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting auction: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting auction: ${error}`);
      }

      return false;
    }
  }
}
