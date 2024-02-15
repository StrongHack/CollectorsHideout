using Microsoft.AspNetCore.Mvc;

namespace Grupo6_CollectorsHidout.Controllers
{

    public class ImagesController : Controller
    {
        private readonly String _imagesPath;

        /// <summary>
        /// Constructor of ImagesController
        /// </summary>
        /// <param name="iamgesPath">Path to image</param>
        public ImagesController(String imagesPath)
        {
            _imagesPath = imagesPath;
        }

        /// <summary>
        ///  Gets image by path
        /// </summary>
        /// <param name="path">path to image</param>
        /// <returns>Image in path</returns>
        public async Task<IResult> GetFile(String image)
        {
            if (string.IsNullOrEmpty(image))
            {
                return Results.BadRequest("Path of image cannot be null or empty");
            }

            String uniqueFilePath = Path.Combine(_imagesPath, "wwwroot/images", image);

            if (!System.IO.File.Exists(uniqueFilePath))
            {
                return Results.NotFound("Image not found!");
            }

            return Results.Ok("images/" + image);
        }

        /// <summary>
        /// Upload images to the server folder
        /// </summary>
        /// <param name="FormFile">Form with images</param>
        /// <returns>Status Request. Ok if successfull, else bad request</returns>
        public async Task<IResult> UploadFile(IFormFile FormFile)
        {
            if (FormFile.Length == 0)
            {
                return Results.BadRequest("No images recived!");
            }

            try
            {
                var originalFileName = Path.GetFileName(FormFile.FileName);

                var uniqueFilePath = Path.Combine(_imagesPath, "wwwroot/images", originalFileName);

                using (var stream = System.IO.File.Create(uniqueFilePath))
                {
                    await FormFile.CopyToAsync(stream);
                }

                return Results.Ok("Images saved successfully!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error uploading images: {ex.Message}");

                return Results.BadRequest($"Error uploading images: {ex.Message}");
            }
        }
    }
}
