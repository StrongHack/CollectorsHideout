import toast from "react-hot-toast";

export class UploadService {
  private static basePath = `${process.env.NEXT_PUBLIC_API_DOMAIN}api/images/upload`;

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

        const response = await fetch(this.basePath, {
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
      if (error instanceof Error) {
        toast.error(`Error uploading images: ${error.message}`);
      } else {
        toast.error(`Unexpected error uploading images: ${error}`);
      }

      return false;
    }
  }
}
