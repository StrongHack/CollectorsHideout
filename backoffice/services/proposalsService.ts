import toast from "react-hot-toast";
import { AuctionType } from "../types";
import { defaultProposal } from "../constants/proposals";

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
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
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
      if (error instanceof Error) {
        toast.error(`Error getting proposals: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting proposals: ${error}`);
      }

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
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return defaultProposal;
      }

      const proposal = await res.json();
      const modifiedProposal = {
        ...proposal,
        ".id": proposal.id !== undefined ? proposal.id : null,
      };

      delete modifiedProposal.id; // Remove the 'id' property

      return modifiedProposal;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting proposal: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting proposal: ${error}`);
      }

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
    try {
      if (proposal.auctionState !== "Pending") {
        toast.error("A proposal must be pending at creation!");

        return false;
      }

      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposal),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Proposal created with success!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating proposal: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating proposals: ${error}`);
      }

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
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Proposal updated successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating proposal: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating proposal: ${error}`);
      }

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
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Proposal deleted successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting proposal: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting proposal: ${error}`);
      }

      return false;
    }
  }
}
