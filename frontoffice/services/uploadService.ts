import { toast } from "react-hot-toast";

export class UploadService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/images`;

  /**
   * Get images
   *
   * @param files files to upload
   */
  static async getImages(imagesNames: string[]): Promise<string[]> {
    try {
      let images: string[] = [];
      for (let index = 0; index < imagesNames.length; index++) {
        const response = await fetch(
          `${this.basePath}/load?image=${encodeURIComponent(
            imagesNames[index]
          )}`,
          {
            method: "GET",
          }
        );

        if (!response.ok || response.body === null) {
          //throw new Error("Error loading image from server");

          break;
        }

        const imagePath = await response.json();
        images.push(`${process.env.NEXT_PUBLIC_API_DOMAIN}${imagePath}`);
      }

      return images;
    } catch (err) {
      console.error(err);

      return [];
    }
  }

  /**
   * Gets a single image
   *
   * @param imageName the name of the image to retrieve
   */
  static async getImage(imageName: string): Promise<string> {
    try {
      let image: string = "";

      const response = await fetch(
        `${this.basePath}/load?image=${encodeURIComponent(imageName)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok || response.body === null) {
        throw new Error("Error loading image from server");
      }

      const imagePath = await response.json();
      image = `${process.env.NEXT_PUBLIC_API_DOMAIN}${imagePath}`;

      return image;
    } catch (error) {
      console.error(error);

      return "default.png";
    }
  }

  /**
   * Uploads images
   *
   * @param files files to upload
   * @return true if successful, false otherwise
   */
  static async uploadImages(files: File[]): Promise<boolean> {
    try {
      let countError = 0;

      for (let index = 0; index < files.length; index++) {
        const body = new FormData();
        body.append("FormFile", files[index]);

        const response = await fetch(`${this.basePath}/upload`, {
          method: "POST",
          body: body,
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          toast.error(`Error uploading image ${index}: ${errorMessage}`);
          countError++;
        }
      }

      return files.length === countError ? false : true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Uploads a single image and returns the path or URL of the uploaded image.
   *
   * @param file The file to upload.
   * @returns A promise that resolves to the path or URL of the uploaded image.
   */
  static async uploadImage(file: File): Promise<boolean> {
    try {
      const body = new FormData();
      body.append("FormFile", file);

      const response = await fetch(`${this.basePath}/upload`, {
        method: "POST",
        body: body,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`Error uploading image: ${errorMessage}`);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
