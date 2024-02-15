import { defaultPublication } from "../constants/publications";
import { PublicationType } from "../types";
import toast from "react-hot-toast";

export class PublicationsService {
  //private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/publications`;
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
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return [];
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
      if (error instanceof Error) {
        toast.error(`Error getting publications: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting publications: ${error}`);
      }

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
        const errorMessage = await res.text();
        toast.error(errorMessage);

        return defaultPublication;
      }

      const publication = await res.json();

      const modifiedPublication = {
        ...publication,
        ".id": publication.id !== undefined ? publication.id : null,
      };

      delete modifiedPublication.id;

      return modifiedPublication;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error getting publication: ${error.message}`);
      } else {
        toast.error(`Unexpected error getting publication: ${error}`);
      }

      return defaultPublication;
    }
  }

  /**
   * Creates publication with data
   *
   * @param publication data of publication to create
   * @returns true if publication was created successfully, false otherwise
   */
  static async createPublication(proposal: PublicationType): Promise<boolean> {
    try {
      const response = await fetch(this.basePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposal),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Publication created with success!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating publication: ${error.message}`);
      } else {
        toast.error(`Unexpected error creating publication: ${error}`);
      }

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
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Publication updated successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error updating publication: ${error.message}`);
      } else {
        toast.error(`Unexpected error updating publication: ${error}`);
      }

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
        const errorMessage = await response.text();
        toast.error(errorMessage);

        return false;
      }

      toast.success("Publication deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error deleting publication: ${error.message}`);
      } else {
        toast.error(`Unexpected error deleting publication: ${error}`);
      }

      return false;
    }
  }
}
