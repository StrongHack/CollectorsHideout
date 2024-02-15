import { defaultCollection } from "../constants/collections";
import { CollectionsService } from "../services/collectionsService";
import { CollectionType } from "../types";

//test if getCollection returns false when id doesn't exist
test("getCollection should return defaultCollection if collection does not exist", async () => {
  const collectionId = "randomNonExistingId";

  const success = await CollectionsService.getCollection(collectionId);

  expect(success).toBe(defaultCollection);
});

//test if createCollection returns false when collection doesn't exist
test("createCollection should return false when collectable does not exist", async () => {
  let collection: CollectionType = {
    ".id": "",
    collectionName: "",
    collectionDescription: "",
    collectionCategory: ""
  };

  const success = await CollectionsService.createCollection(collection);

  expect(success).toBeFalsy();
});

//test if updateCollection returns false when collection to update doesn't exist
test("updateCollection should return false if collection does not exist", async () => {
    const success = await CollectionsService.updateCollection(defaultCollection);

    expect(success).toBeFalsy();
});

//test if deleteCollection returns false when id doesn't exist
test("deleteCollection should return false if collection does not exist", async () => {
    const collectionId = "randomNonExistingId";

    const success = await CollectionsService.deleteCollection(collectionId);

    expect(success).toBeFalsy();
});