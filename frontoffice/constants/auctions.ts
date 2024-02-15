import { AuctionType, BidStatus, BidType } from "../types";

export const defaultAuction: AuctionType = {
    ".id": "",
    auctionName: "",
    auctionImages: [],
    auctionProductEstimatedValue: 0.0,
    collectionName: "",
    auctionProductState: "",
    auctionProductEdition: "",
    auctionProductRarity: "",
    auctionDescription: "",
    auctionMinimumBid: 0.0,
    auctionHighestBid: 0.0,
    auctionBidIncrement: 0.0,
    auctionStartDate: new Date(),
    auctionEndDate: new Date(),
    auctionState: "Accepted",
    userId: "",
    bids: [],
}

export const defaultBid: BidType = {
  bidAmount: 0.0,
  bidTime: new Date(),
  bidderId: "",
  bidStatus: BidStatus.HighestBid,
};
