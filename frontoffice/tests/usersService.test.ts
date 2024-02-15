import { defaultUser } from "../constants/users";
import { UserService } from "../services/userService";
import { UserType } from "../types";

//test if getUser returns false when id doesn't exist
test("getUser should return defaultUser if order does not exist", async () => {
  const userId = "randomNonExistingId";

  const success = await UserService.getUser(userId);

  expect(success).toBe(defaultUser);
});

//test if createUser returns false when user doest not exist
test("createUser should return false when user does not exist", async () => {
  let user: UserType = {
    ".id": "",
    userPersonalName: "",
    userUsername: "",
    userEmail: "",
    userPassword: "",
    userProfilePicture: "",
    userAuctionsIds: [],
    userOrdersIds: [],
    userCollectablesIds: [],
    userPublicationsIds: [],
    cartProducts: [],
  };

  const success = await UserService.createUser(user);

  expect(success).toBeFalsy();
});

//test if updateUser returns false when user to update doesn't exist
test("updateUser should return false if user does not exist", async () => {
    const success = await UserService.updateUser(defaultUser);

    expect(success).toBeFalsy();
});

//test if deleteuser returns false when id doesn't exist
test("deleteuser should return false if user does not exist", async () => {
    const userId = "randomNonExistingId";

    const success = await UserService.deleteUser(userId);

    expect(success).toBeFalsy();
});