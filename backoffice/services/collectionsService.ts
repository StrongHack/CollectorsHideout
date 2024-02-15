import { defaultCollection } from "../constants/collections";
import { CollectionType } from "../types";
import toast from "react-hot-toast";

export class CollectionsService {
  //private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/collections`;
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/collections`;

  /**
   * Gets all collections
   *
   * @returns all collections
   */
  static async getCollections(): Promise<CollectionType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
      }

      const collectionsRes = await res.json();

      const collections = collectionsRes.map((item: any) => ({
        ...item,
        ".id": item.id, // Map the 'id' property to '.id'
      }));

      collections.forEach((collection: any) => {
        delete collection.id;
      });

      return collections;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting collections: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting collections: ${error}`);
      }

      return [];
    }
  }

  /**
   * Gets collection by id
   *
   * @param id of collection to fetch
   * @returns collection by id
   */
  static async getCollection(id: string): Promise<CollectionType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return defaultCollection;
      }

      const collection = await res.json();

      //Modifies collectable according to collectableType
      const modifiedCollection = {
        ...collection,
        ".id": collection.id,
      };

      delete modifiedCollection.id;

      return modifiedCollection;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting collections: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting collections: ${error}`);
      }

      return defaultCollection;
    }
  }

  /**
   * Creates a new collection
   *
   * @param collection to be created
   * @return true if collection was created successfully, false otherwise
   */
  static async createCollection(collection: CollectionType): Promise<boolean> {
    try {
      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collection),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Collection created successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating collection: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating collection: ${error}`);
      }

      return false;
    }
  }

  /**
   * Fetch to update a collection
   *
   * @param updatedCollectable collection to update
   * @return true if collection was updated successfully, false otherwise
   */
  static async updateCollection(
    updatedCollection: CollectionType
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.basePath}/${updatedCollection[".id"]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCollection),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Collection updated successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating collection: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating collection: ${error}`);
      }

      return false;
    }
  }

  /**
   * Deletes collection by id
   *
   * @param collectionId id of collection to delete
   * @return true if collection was successfully deleted, false otherwise
   */
  static async deleteCollection(collectionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${collectionId}`, {
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

      toast.success("Collection deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting collection: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting collection: ${error}`);
      }

      return false;
    }
  }
}
