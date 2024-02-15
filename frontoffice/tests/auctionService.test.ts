import { defaultAuction } from "../constants/auctions";
import { AuctionsService } from "../services/auctionService";
import { AuctionType } from "../types";

//test if getAuction returns false when id doesn't exist
test("getAuction should return false when auction doesn't exist", async () => {
    const auctionId = "randomNonExistingId";


    const success = await AuctionsService.getAuction(auctionId);

    expect(success).toBe(defaultAuction)
});

//test if createAuction returns false when auctionId doesn't exist
test("createAuction should return false when auctionId doesn't exist", async () => {
    let auction: AuctionType = {
        ".id": "",
        auctionName: "",
        auctionImages: [],
        auctionProductEstimatedValue: 0.0,
        collectionName: "",
        auctionBidIncrement: 0.0,
        auctionProductState: "",
        auctionProductEdition: "",
        auctionProductRarity: "",
        auctionDescription: "",
        auctionMinimumBid: 0.0,
        auctionHighestBid: 0.0,
        auctionStartDate: new Date(),
        auctionEndDate: new Date(),
        auctionState: "Pending",
        userId: "",
        bids: [],
    }

    const success = await AuctionsService.createAuction(auction);

    expect(success).toBeFalsy();
});

//test if updateAuctions returns false when auction to update doesn't exist
test("updateAuction should return false when state isn't Pending", async () => {
    const success = await AuctionsService.updateAuction(defaultAuction);

    expect(success).toBeFalsy();
});

//test if deleteAuction returns false when id doesn't exist
test("deleteAuction should return false when state isn't Pending", async () => {
    const auctionId = "randomNonExistingId";

    const success = await AuctionsService.deleteAuction(auctionId);

    expect(success).toBeFalsy();
});