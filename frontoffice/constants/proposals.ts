import { AuctionType } from "../types";

/* Default Auction */
export const defaultProposal: AuctionType = {
  ".id": "",
  auctionName: "",
  auctionImages: [],
  auctionProductEstimatedValue: 0.0,
  collectionName: "",
  auctionProductState: "",
  auctionProductEdition: "",
  auctionProductRarity: "",
  auctionDescription: "",
  auctionBidIncrement: 0.0,
  auctionMinimumBid: 0.0,
  auctionHighestBid: 0.0,
  auctionStartDate: new Date(),
  auctionEndDate: new Date(),
  auctionState: "Pending",
  userId: "",
  bids: [],
};
