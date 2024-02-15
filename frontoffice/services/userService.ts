import toast from "react-hot-toast";
import { defaultUser } from "../constants/users";
import { LineType, UserType } from "../types";

export class UserService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/users`;

  /**
   * Adds a collectable to the user's cart
   *
   * @param userId user id
   * @param cartProducts cart products
   */
  static async addToCart(userId: string, cartProducts: LineType): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/addToCart/${userId}`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartProducts),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);

      return false;
    }
  }

  /**
   * Updates cart products
   *
   * @param userId user id
   * @param cartProducts cart products
   */
  static async updateCart(userId: string, cartProducts: LineType) {
    const response = await fetch(`${this.basePath}/updateCart/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartProducts),
    });

    if (!response.ok) {
      throw new Error(`Error updating cart: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Gets cart products
   *
   * @param userId user id
   * @returns cart products
   */
  static async getCartProducts(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.basePath}/getCart/${userId}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting cart products:", error);

      return [];
    }
  }

  /**
   * Removes a collectable from the user's cart
   *
   * @param userId user id
   * @param collectableId collectable id
   */
  static async removeFromCart(userId: string, collectableId: string) {
      const response = await fetch(
        `${this.basePath}/removeFromCart/${userId}/${collectableId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
  }

  /**
   * Gets all users
   *
   * @returns all users
   */
  static async getUsers(): Promise<UserType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        throw new Error("Error fetching users")
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
      console.error(error);

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
        throw new Error("Error fetching user");
      }

      const user = await res.json();

      const modifiedUser = {
        ...user,
        ".id": user.id !== undefined ? user.id : null,
      };

      delete modifiedUser.id; // Remove the 'id' property

      return modifiedUser;
    } catch (error) {
      console.error(error);

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
        throw new Error("A user must be created without auctions!");
      }

      if (user.userOrdersIds.length !== 0) {
        throw new Error("A user must be created without orders!");
      }

      if (user.userPublicationsIds.length !== 0) {
        throw new Error("A user must be created without publications!");
      }

      if (user.userCollectablesIds.length !== 0) {
        throw new Error("A user must be created without collectables!");
      }

      if (user.cartProducts?.length !== 0) {
        throw new Error("A user must be created without items in cart!");
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

        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error(error);

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
        throw new Error("Error updating user");
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  /**
   * Deletes user by id
   *
   * @param userId id of the user to delete
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error deleting user.`);
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  static async authenticateUser(
    email: string,
    password: string
  ): Promise<string> {
    try {
      const response = await fetch(`${this.basePath}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Error authenticating user");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);

      return "";
    }
  }
}
