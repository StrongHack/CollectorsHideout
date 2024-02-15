import { toast } from "react-hot-toast";
import { defaultPublication } from "../constants/publications";
import { PublicationType } from "../types";

export class PublicationsService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/publications`;

  /**
   * Gets all publications
   *
   * @returns all publications
   */
  static async getPublications(): Promise<PublicationType[]> {
    try {
      const res = await fetch(this.basePath);

      if (!res.ok) {
        throw new Error("Error fetching publications");
      }

      const publicationsRes = await res.json();

      const publications = publicationsRes.map((item: any) => ({
        ...item,
        ".id": item.id, // Map the 'id' property to '.id'
      }));

      publications.forEach((publication: any) => {
        delete publication.id;
      });

      return publications;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  /**
   * Gets publication by id
   *
   * @param id of publication to retrieve
   * @returns publication by id
   */
  static async getPublication(id: string): Promise<PublicationType> {
    try {
      const res = await fetch(`${this.basePath}/${id}`);

      if (!res.ok) {
        throw new Error("Error fetching publication");
      }

      const publication = await res.json();

      const modifiedPublication = {
        ...publication,
        ".id": publication.id !== undefined ? publication.id : null,
      };

      delete modifiedPublication.id;

      return modifiedPublication;
    } catch (error) {
      console.error(error);
      
      return defaultPublication;
    }
  }

  /**
   * Creates publication with data
   *
   * @param publication data of publication to create
   * @returns true if publication was created successfully, false otherwise
   */
  static async createPublication(publication: PublicationType): Promise<boolean> {
    try {
      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publication),
      });

      if (!response.ok) {
        throw new Error("Error creating publication");
      }

      toast.success("Publication created with success!");
      return true;
    } catch (error) {
      console.error(error)
      toast.error("Error creating publication! Please try again later!");

      return false;
    }
  }

  /**
   * Updates publication with data
   *
   * @param updatedPublication data of publication to update
   * @returns true if update was successful, false otherwise
   */
  static async updatePublication(
    updatedPublication: PublicationType
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.basePath}/${updatedPublication[".id"]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPublication),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating publication.");
      }

      toast.success("Publication updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error updating publication! Please try again later.");

      return false;
    }
  }

  /**
   * Deletes publication by id
   *
   * @param publicationId id of the publication to delete
   * @returns true if the publication was deleted successfully, false otherwise
   */
  static async deletePublication(publicationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${publicationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting publication");
      }

      toast.success("Publication deleted successfully");
      return true;
    } catch (error) {
      console.error(error)
      toast.error("Error deleting publication. Please try again later.");

      return false;
    }
  }
}
