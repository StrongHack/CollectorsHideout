import { defaultPublication } from "../constants/publications";
import { PublicationsService } from "../services/publicationsService";
import { PublicationType, PublicationsStates } from "../types";

const start = new Date(2000, 0, 1); // Start date (e.g., January 1, 2000)
const end = new Date(); // End date (current date)

//test if getPublication returns false when id doesn't exist
test("getPublication should return defaultProposal if order does not exist", async () => {
  const publictationId = "randomNonExistingId";

  const success = await PublicationsService.getPublication(publictationId);

  expect(success).toBe(defaultPublication);
});

//test if createPublication returns false when publication doest not exist
test("createPublication should return false when order does not exist", async () => {
  let publication: PublicationType = {
    ".id": "",
  title: "",
  images: [],
  description: "",
  userId: "",
  type: "",
  date: new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ),
  editDate: new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ),
  price: 0,
  state: PublicationsStates.NotSold,
  };

  const success = await PublicationsService.createPublication(publication);

  expect(success).toBeFalsy();
});

//test if updatePublication returns false when publication to update doesn't exist
test("updatePublication should return false if publication does not exist", async () => {
    const success = await PublicationsService.updatePublication(defaultPublication);

    expect(success).toBeFalsy();
});

//test if deletePublication returns false when id doesn't exist
test("deletePublication should return false if publication does not exist", async () => {
    const publicationId = "randomNonExistingId";

    const success = await PublicationsService.deletePublication(publicationId);

    expect(success).toBeFalsy();
});