import { toast } from "react-hot-toast";
import { AuctionType } from "../types";
import { defaultProposal } from "../constants/proposals";
import { getCookie } from "../utils/cookies";
import { UserService } from "./userService";

export class ProposalsService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/auctions`;

  /**
   * Gets all proposals in database
   *
   * @returns all proposals in database
   */
  static async getProposals(): Promise<AuctionType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        throw new Error("Error fetching proposals!");
      }

      const auctionsRes = await res.json();

      const proposals = auctionsRes
        .filter((item: any) => item.auctionState !== "Accepted")
        .map((item: any) => ({
          ...item,
          ".id": item.id, // Map the 'id' property to '.id'
        }));

      proposals.forEach((proposal: any) => {
        delete proposal.id;
      });

      return proposals;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  /**
   * Gets proposal by id
   *
   * @param id of proposal to retrieve
   * @returns proposal by id
   */
  static async getProposal(id: string): Promise<AuctionType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        throw new Error("Error fetching proposal");
      }

      const proposal = await res.json();
      const modifiedProposal = {
        ...proposal,
        ".id": proposal.id !== undefined ? proposal.id : null,
      };

      delete modifiedProposal.id; // Remove the 'id' property

      return modifiedProposal;
    } catch (error) {
      console.error(error);

      return defaultProposal;
    }
  }

  /**
   * Creates proposal with given data
   *
   * @param proposal data of proposal to create
   * @returns true if proposal was created successfully, false otherwise
   */
  static async createProposal(proposal: AuctionType): Promise<boolean> {
    const userId = getCookie("userId");

    try {
      if (proposal.auctionState !== "Pending") {
        throw new Error("Proposal isn't pending at creation time!");
      }

      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposal),
      });

      if (!response.ok) {
        throw new Error("Error creating proposal");
      }

      toast.success("Proposal Submited with success!");
      return true;
    } catch (error) {
      toast.error("Error creating auction proposal. Try again later.");
      console.error(error);

      return false;
    }
  }

  /**
   * Updates proposal with given data
   *
   * @param updatedProposal data of proposal to update
   * @returns true if update was successful, else false
   */
  static async updateProposal(updatedProposal: AuctionType): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.basePath}/${updatedProposal[".id"]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProposal),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating proposal");
      }

      toast.success("Proposal updated successfully!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error updating proposal. Try again later.");

      return false;
    }
  }

  /**
   * Deletes proposal by id
   *
   * @param proposalId id of proposal to delete
   * @returns true if success, false otherwise
   */
  static async deleteProposal(proposalId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${proposalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting proposal");
      }

      toast.success("Proposal deleted successfully!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error deleting proposal. Try again later!");

      return false;
    }
  }
}
