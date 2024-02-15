import { defaultCollectable } from "../constants/collectables";
import { CollectableType } from "../types";
import toast from "react-hot-toast";

export class CollectablesService {
  //private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/collectables`;
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/collectables`;

  /**
   * Gets all collectables
   *
   * @returns all collectables
   */
  static async getCollectables(): Promise<CollectableType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
      }

      const collectablesRes = await res.json();

      const collectables = collectablesRes.map((item: any) => ({
        ...item,
        ".id": item.id, // Map the 'id' property to '.id'
      }));

      collectables.forEach((collectable: any) => {
        delete collectable.id;
      });

      return collectables;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting collectables: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting collectables: ${error}`);
      }

      return [];
    }
  }

  /**
   * Gets collectable by id
   *
   * @param id of collectable to fetch
   * @returns collectable by id
   */
  static async getCollectable(id: string): Promise<CollectableType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return defaultCollectable;
      }

      const collectable = await res.json();

      //Modifies collectable according to collectableType
      const modifiedCollectable = {
        ...collectable,
        ".id": collectable.id,
      };

      delete modifiedCollectable.id;

      return modifiedCollectable;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting collectables: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting collectable: ${error}`);
      }

      return defaultCollectable;
    }
  }

  /**
   * Creates a new collectable
   *
   * @param collectable to be created
   * @return true if collectable was created successfully, false otherwise
   */
  static async createCollectable(
    collectable: CollectableType
  ): Promise<boolean> {
    try {
      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectable),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Collectable created successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating collectable: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating collectable: ${error}`);
      }

      return false;
    }
  }

  /**
   * Fetch to update a collectable
   *
   * @param updatedCollectable collectable to update
   * @return true if collectable was updated successfully, false otherwise
   */
  static async updateCollectable(
    updatedCollectable: CollectableType
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.basePath}/${updatedCollectable[".id"]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCollectable),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Collectable updated successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating collectable: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating collectable: ${error}`);
      }

      return false;
    }
  }

  /**
   * Deletes collectable by id
   *
   * @param collectableId id of collectable to delete
   * @return true if collectable was successfully deleted, false otherwise
   */
  static async deleteCollectable(collectableId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${collectableId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Collectable deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting collectable: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting collectable: ${error}`);
      }

      return false;
    }
  }
}
