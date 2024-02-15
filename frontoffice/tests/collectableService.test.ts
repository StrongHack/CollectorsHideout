import { defaultCollectable } from "../constants/collectables";
import { CollectablesService } from "../services/collectablesService";
import { CollectableType } from "../types";

//test if getCollectable returns false when id doesn't exist
test("getCollectable should return defaultCollectable if collectable does not exist", async () => {
  const collectableId = "randomNonExistingId";

  const success = await CollectablesService.getCollectable(collectableId);

  expect(success).toBe(defaultCollectable);
});

