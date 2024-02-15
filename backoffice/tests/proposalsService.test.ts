import { defaultProposal } from "../constants/proposals";
import { ProposalsService } from "../services/proposalsService";
import { AuctionType } from "../types";

//test if getProposal returns false when id doesn't exist
test("getProposal should return defaultProposal if order does not exist", async () => {
  const proposalId = "randomNonExistingId";

  const success = await ProposalsService.getProposal(proposalId);

  expect(success).toBe(defaultProposal);
});

//test if createProposal returns false when proposal doest not exist
test("createProposal should return false when proposal does not exist", async () => {
  let proposal: AuctionType = {
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
    auctionStartDate: new Date(),
    auctionEndDate: new Date(),
    auctionState: "Pending",
    auctionBidIncrement: 0.0,
    userId: "",
    bids: [],
  };

  const success = await ProposalsService.createProposal(proposal);

  expect(success).toBeFalsy();
});

//test if updateProposal returns false when proposal to update doesn't exist
test("updateOrder should return false if order does not exist", async () => {
    const success = await ProposalsService.updateProposal(defaultProposal);

    expect(success).toBeFalsy();
});

//test if deleteProposal returns false when id doesn't exist
test("deleteProposal should return false if proposal does not exist", async () => {
    const proposalId = "randomNonExistingId";

    const success = await ProposalsService.deleteProposal(proposalId);

    expect(success).toBeFalsy();
});