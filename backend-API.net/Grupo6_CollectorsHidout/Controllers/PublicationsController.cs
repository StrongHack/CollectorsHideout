using EFCoreMongoConect;
using Grupo6_CollectorsHidout.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Grupo6_CollectorsHidout.Controllers;
public class PublicationsController
{
    private readonly MongoDbContext _publications;

    /// <summary>
    /// Constructor of PublicationController
    /// </summary>
    /// <param name="collections">Connects to publications database</param>
    public PublicationsController(MongoDbContext publications)
    {
        _publications = publications;
    }

    /// <summary>
    /// Creates publication with given data
    /// </summary>
    /// <param name="publication">Data of publication to create</param>
    /// <returns>Request status. Ok if successfull, else bad request.</returns>
    public async Task<IResult> CreatePublication(Publication publication)
    {
        if (string.IsNullOrEmpty(publication.Title))
        {
            return Results.BadRequest("Title cannot be null or empty!");
        }

        if (publication.Images == null)
        {
            return Results.BadRequest("Images cannot be null!");
        }

        if (string.IsNullOrEmpty(publication.Description))
        {
            return Results.BadRequest("Description cannot be null or empty!");
        }

        if (string.IsNullOrEmpty(publication.UserId))
        {
            return Results.BadRequest("UserId cannot be null null or empty!");
        }

        if (string.IsNullOrEmpty(publication.Type))
        {
            return Results.BadRequest("Type cannot be empty or null!");
        }

        if (publication.Price < 0)
        {
            return Results.BadRequest("Price is cannot be zero or bellow!");
        }

        if (string.IsNullOrEmpty(publication.State))
        {
            return Results.BadRequest("Sate is cannot be null or empty!");
        }

        try
        {
            publication.Date = DateTime.Now;

            publication.EditDate = null;

            publication.Id = ObjectId.GenerateNewId();

            await _publications.Publications.AddAsync(publication);
            await _publications.SaveChangesAsync();
            return Results.Ok($"Publication {publication.Title} created successfully");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error creating publication: {ex.Message}");

            return Results.BadRequest($"Error creating publication: {ex.Message}");
        }
    }

    /// <summary>
    /// Gets all publications in database
    /// </summary>
    /// <returns>All publications in database</returns>
    public async Task<IResult> GetPublications()
    {
        try
        {
            var publications = await _publications.Publications.ToListAsync();
            var modifiedPublications = publications.Select(c => new
            {
                Id = c.Id.ToString(),
                c.Title,
                c.Images,
                c.Description,
                c.UserId,
                c.Type,
                c.Date,
                c.EditDate,
                c.Price,
                c.State,
            });

            return Results.Ok(modifiedPublications);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error retrieving all publications: {ex.Message}");

            return Results.BadRequest($"Error retrieving all publications: {ex.Message}");
        }
    }

    /// <summary>
    /// Gets publication by id
    /// </summary>
    /// <param name="id">Id of publication to get</param>
    /// <returns>Publication by id</returns>
    public async Task<IResult> GetPublication(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return Results.BadRequest("Id of publications cannot be null or empty!");
        }

        try
        {
            var objectId = new ObjectId(id);
            var publication = await _publications.Publications.FindAsync(objectId);

            if (publication == null)
            {
                return Results.NotFound("Publication not found!");
            }

            var modifiedPublication = new
            {
                Id = publication.Id.ToString(),
                publication.Title,
                publication.Images,
                publication.Description,
                publication.Type,
                publication.Date,
                publication.EditDate,
                publication.UserId,
                publication.Price,
                publication.State,
            };
            return Results.Ok(modifiedPublication);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error retrieving publication: {ex.Message}");

            return Results.BadRequest($"Error retrieving publication: {ex.Message}");
        }
    }

    /// <summary>
    /// Updates publication by id and with given data
    /// </summary>
    /// <param name="id">Id of publication to update</param>
    /// <param name="publication">Data to update publication</param>
    /// <returns>Request status. Ok if successfull, else bad request.</returns>
    public async Task<IResult> UpdatePublication(string id, Publication publication)
    {
        if (string.IsNullOrEmpty(id))
        {
            return Results.BadRequest("Id of publication cannot be null or empty!");
        }

        if (string.IsNullOrEmpty(publication.Title))
        {
            return Results.BadRequest("Title cannot be null or empty!");
        }

        if (publication.Images == null)
        {
            return Results.BadRequest("Images cannot be null!");
        }

        if (string.IsNullOrEmpty(publication.Description))
        {
            return Results.BadRequest("Description cannot be null or empty!");
        }

        if (string.IsNullOrEmpty(publication.UserId))
        {
            return Results.BadRequest("UserId cannot be null null or empty!");
        }

        if (string.IsNullOrEmpty(publication.Type))
        {
            return Results.BadRequest("Type cannot be empty or null!");
        }

        if (publication.Price < 0)
        {
            return Results.BadRequest("Price is cannot be zero or bellow!");
        }

        if (string.IsNullOrEmpty(publication.State))
        {
            return Results.BadRequest("Sate is cannot be null or empty!");
        }

        try
        {
            publication.EditDate = DateTime.Now;

            var objectId = new ObjectId(id);
            var existingPublication = await _publications.Publications.FindAsync(objectId);

            if (existingPublication == null)
            {
                return Results.NotFound("Publication to update not found!");
            }

            existingPublication.Title = publication.Title;
            existingPublication.Images = publication.Images;
            existingPublication.Description = publication.Description;
            existingPublication.Type = publication.Type;
            existingPublication.Date = publication.Date;
            existingPublication.EditDate = publication.EditDate;
            existingPublication.UserId = publication.UserId;
            existingPublication.Price = publication.Price;
            existingPublication.State = publication.State;

            await _publications.SaveChangesAsync();
            return Results.Ok($"Publication {publication.Title} updated successfully");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error updating publication: {ex.Message}");

            return Results.BadRequest($"Error updating publication: {ex.Message}");
        }
    }

    /// <summary>
    /// Deletes publication by id
    /// </summary>
    /// <param name="id">Id of publication to delete</param>
    /// <returns>Status request. Ok if successfull, else bad request.</returns>
    public async Task<IResult> DeletePublication(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return Results.BadRequest("Id of publication to delete cannot be null or empty.");
        }

        try
        {
            var objectId = new ObjectId(id);
            var publication = await _publications.Publications.FindAsync(objectId);

            if (publication == null)
            {
                return Results.NotFound("Publication to delete not found!");
            }

            _publications.Publications.Remove(publication);
            await _publications.SaveChangesAsync();
            return Results.Ok("Publication deleted successfully");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error deleting publication: {ex.Message}");

            return Results.BadRequest($"Error deleting publication: {ex.Message}");
        }
    }
}
