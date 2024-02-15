import { defaultCollectable } from "../constants/collectables";
import { CollectablesService } from "../services/collectablesService";
import { CollectableType } from "../types";

//test if getCollectable returns false when id doesn't exist
test("getCollectable should return defaultCollectable if collectable does not exist", async () => {
  const collectableId = "randomNonExistingId";

  const success = await CollectablesService.getCollectable(collectableId);

  expect(success).toBe(defaultCollectable);
});

//test if createCollectable returns false when auctionId doesn't exist
test("createCollectable should return false when collectable does not exist", async () => {
  let collectable: CollectableType = {
    ".id": "",
    collectableName: "",
    collectableDescription: "",
    collectableEdition: "",
    collectablePrice: 0.0,
    collectableRarity: "",
    collectableState: "",
    collectableStock: 0.0,
    collectionId: "",
    collectableImages: [],
  };

  const success = await CollectablesService.createCollectable(collectable);

  expect(success).toBeFalsy();
});

//test if updateCollectable returns false when auction to update doesn't exist
test("updateCollectable should return false if collectable does not exist", async () => {
    const success = await CollectablesService.updateCollectable(defaultCollectable);

    expect(success).toBeFalsy();
});

//test if deleteCollectable returns false when id doesn't exist
test("deleteCollectable should return false if collectable does not exist", async () => {
    const collectableId = "randomNonExistingId";

    const success = await CollectablesService.deleteCollectable(collectableId);

    expect(success).toBeFalsy();
});