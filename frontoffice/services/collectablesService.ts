import { defaultCollectable } from "../constants/collectables";
import { CollectableType } from "../types";

export class CollectablesService {
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
        throw new Error("Error fetching collectables.");
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
      console.error(error);
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
        throw new Error("Error fetching collectable");
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
      return defaultCollectable;
    }
  }
}
