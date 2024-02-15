import toast from "react-hot-toast";
import { defaultUser } from "../constants/users";
import { UserType } from "../types";

export class UserService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/users`;

  /**
   * Gets all users
   *
   * @returns all users
   */
  static async getUsers(): Promise<UserType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
      }

      const usersRes = await res.json();

      const users = usersRes.map((item: any) => ({
        ...item,
        ".id": item.id, // Map the 'id' property to '.id'
      }));

      users.forEach((user: any) => {
        delete user.id;
      });

      return users;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting users: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting users: ${error}`);
      }

      return [];
    }
  }

  /**
   * Gets user by id
   *
   * @param id of user to retrieve
   * @returns user by id
   */
  static async getUser(id: string): Promise<UserType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return defaultUser;
      }

      const user = await res.json();

      const modifiedUser = {
        ...user,
        ".id": user.id !== undefined ? user.id : null,
      };

      delete modifiedUser.id; // Remove the 'id' property

      return modifiedUser;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting user: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting user: ${error}`);
      }

      return defaultUser;
    }
  }

  /**
   * Creates user with given data
   *
   * @param user data of user to create
   * @returns true if user was created successfully, false otherwise
   */
  static async createUser(user: UserType): Promise<boolean> {
    try {
      if (user.userAuctionsIds.length !== 0) {
        toast.error("A user must be created without auctions!");
        return false;
      }

      if (user.userOrdersIds.length !== 0) {
        toast.error("A user must be created without orders!");
        return false;
      }

      if (user.userPublicationsIds.length !== 0) {
        toast.error("A user must be created without publications!");
        return false;
      }

      if (user.userCollectablesIds.length !== 0) {
        toast.error("A user must be created without collectables!");
        return false;
      }

      if (user.cartProducts?.length !== 0) {
        toast.error("A user must be created without items in cart!");
        return false;
      }

      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("User created with success!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating user: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating user: ${error}`);
      }

      return false;
    }
  }

  /**
   * Updates user with data
   *
   * @param updatedUser data of user to update
   * @returns true if user was updated successfully, false otherwise
   */
  static async updateUser(updatedUser: UserType): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${updatedUser[".id"]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("User updated successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating user: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating user: ${error}`);
      }

      return false;
    }
  }

  /**
   * Deletes user by id
   *
   * @param userId id of the user to delete
   * @returns true if user was successfully deleted, false otherwise
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting user: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting user: ${error}`);
      }

      return false;
    }
  }
}
