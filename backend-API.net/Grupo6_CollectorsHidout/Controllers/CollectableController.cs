using EFCoreMongoConect;
using Grupo6_CollectorsHidout.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Grupo6_CollectorsHidout.Controllers
{
    public class CollectableController : ControllerBase
    {
        private readonly MongoDbContext _collectables;

        /// <summary>
        /// Constructor of CollectableController
        /// </summary>
        /// <param name="collectables">Connects to collectables database</param>
        public CollectableController(MongoDbContext collectables)
        {
            _collectables = collectables;
        }

        /// <summary>
        /// Creates a new collectable
        /// </summary>
        /// <param name="collectable">Data of collectable to create</param>
        /// <returns></returns>
        public async Task<IResult> CreateCollectable(Collectable collectable)
        {
            if (string.IsNullOrEmpty(collectable.CollectableName))
            {
                return Results.BadRequest("Collectable Name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableDescription))
            {
                return Results.BadRequest("Collectable Description cannot be null or empty!");
            }

            if (collectable.CollectablePrice <= 0)
            {
                return Results.BadRequest("Collectable Price cannot be zero or bellow!");
            }

            if (string.IsNullOrEmpty(collectable.CollectionId))
            {
                return Results.BadRequest("Collection Id cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableState))
            {
                return Results.BadRequest("Collectable State cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableEdition))
            {
                return Results.BadRequest("Collectable Edition cannot be null or empty!");
            }

            if (collectable.CollectableStock < 0)
            {
                return Results.BadRequest("Collectable Stock cannot be zero or bellow!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableRarity))
            {
                return Results.BadRequest("Collectable Rarity cannot be null or empty!");
            }

            if (collectable.CollectableImages == null)
            {
                return Results.BadRequest("Collectable images cannot be null!");
            }

            try
            {
                collectable.Id = ObjectId.GenerateNewId();

                await _collectables.Collectables.AddAsync(collectable);
                await _collectables.SaveChangesAsync();

                return Results.Ok($"Collectable {collectable.CollectableName} created!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error adding collectable to database: {ex.Message}");

                return Results.BadRequest($"Error adding collectable to database: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets all collectables in database
        /// </summary>
        /// <returns>All collectables in database</returns>
        public async Task<IResult> GetCollectables()
        {
            try
            {
                var collectables = await _collectables.Collectables.ToListAsync();
                var modifiedCollectables = collectables.Select(c => new
                {
                    Id = c.Id.ToString(),
                    c.CollectableName,
                    c.CollectableDescription,
                    c.CollectablePrice,
                    c.CollectionId,
                    c.CollectableState,
                    c.CollectableEdition,
                    c.CollectableStock,
                    c.CollectableRarity,
                    c.CollectableImages,
                });

                return Results.Ok(modifiedCollectables);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving collectable from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving collectable from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets collectable by id
        /// </summary>
        /// <param name="id">Id of collectable to retrieve</param>
        /// <returns>Collectable by id</returns>
        public async Task<IResult> GetCollectable(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of collectable to retrieve cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var collectable = await _collectables.Collectables.FindAsync(objectId);

                if (collectable == null)
                {
                    return Results.NotFound("Colloctable not found!");
                }

                var modifiedCollectable = new
                {
                    Id = collectable.Id.ToString(),
                    collectable.CollectableName,
                    collectable.CollectableDescription,
                    collectable.CollectablePrice,
                    collectable.CollectionId,
                    collectable.CollectableState,
                    collectable.CollectableEdition,
                    collectable.CollectableStock,
                    collectable.CollectableRarity,
                    collectable.CollectableImages
                };

                return Results.Ok(modifiedCollectable);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving collectable from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving collectable from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets collectables by collection name
        /// </summary>
        /// <param name="collectionName"> Name of collection to retrieve collectables</param>
        /// <returns>Collectables by given collection name</returns>
        public async Task<IResult> GetCollectablesByCollectionName(string collectionName)
        {
            if (string.IsNullOrEmpty(collectionName))
            {
                return Results.NotFound("Collection name cannot be null or empty!");
            }

            try
            {
                var collectables = await _collectables.Collectables
                    .Where(c => c.CollectionId == collectionName)
                    .ToListAsync();

                var modifiedCollectables = collectables.Select(c => new
                {
                    Id = c.Id.ToString(),
                    c.CollectableName,
                    c.CollectableDescription,
                    c.CollectablePrice,
                    c.CollectionId,
                    c.CollectableState,
                    c.CollectableEdition,
                    c.CollectableStock,
                    c.CollectableRarity,
                    c.CollectableImages,
                });

                return Results.Ok(modifiedCollectables);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving collectables by collection from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving collectables by collection from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates collectable by id with given data
        /// </summary>
        /// <param name="id">Id of collectable to update</param>
        /// <param name="collectable">Data to update collectable</param>
        /// <returns>Status of request. Ok if successfull, else bad request</returns>
        public async Task<IResult> UpdateCollectable(string id, Collectable collectable)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of collectable to update cannot be empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableName))
            {
                return Results.BadRequest("Collectable Name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableDescription))
            {
                return Results.BadRequest("Collectable Description cannot be null or empty!");
            }

            if (collectable.CollectablePrice <= 0)
            {
                return Results.BadRequest("Collectable Price cannot be zero or bellow!");
            }

            if (string.IsNullOrEmpty(collectable.CollectionId))
            {
                return Results.BadRequest("Collection Id cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableState))
            {
                return Results.BadRequest("Collectable State cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableEdition))
            {
                return Results.BadRequest("Collectable Edition cannot be null or empty!");
            }

            if (collectable.CollectableStock < 0)
            {
                return Results.BadRequest("Collectable Stock cannot be zero or bellow!");
            }

            if (string.IsNullOrEmpty(collectable.CollectableRarity))
            {
                return Results.BadRequest("Collectable Rarity cannot be null or empty!");
            }

            if (collectable.CollectableImages == null)
            {
                return Results.BadRequest("Collectable images cannot be null!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var collectableToUpdate = await _collectables.Collectables.FindAsync(objectId);

                if (collectableToUpdate == null)
                {
                    return Results.NotFound("Collectable to update not found!");
                }

                collectableToUpdate.CollectableName = collectable.CollectableName;
                collectableToUpdate.CollectableDescription = collectable.CollectableDescription;
                collectableToUpdate.CollectablePrice = collectable.CollectablePrice;
                collectableToUpdate.CollectionId = collectable.CollectionId;
                collectableToUpdate.CollectableState = collectable.CollectableState;
                collectableToUpdate.CollectableEdition = collectable.CollectableEdition;
                collectableToUpdate.CollectableStock = collectable.CollectableStock;
                collectableToUpdate.CollectableRarity = collectable.CollectableRarity;
                collectableToUpdate.CollectableImages = collectable.CollectableImages;

                await _collectables.SaveChangesAsync();
                return Results.Ok($"Collectable {collectable.CollectableName} updated!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating collectable in database: {ex.Message}");

                return Results.BadRequest($"Error updating collectable in database: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes collectable by id
        /// </summary>
        /// <param name="id">Id of collectable to remove</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> DeleteCollectable(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of collectable to delete cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var collectable = await _collectables.Collectables.FindAsync(objectId);

                if (collectable == null)
                {
                    return Results.NotFound("Collectable to update not found!");
                }

                _collectables.Collectables.Remove(collectable);
                await _collectables.SaveChangesAsync();

                return Results.Ok("Collectable deleted successfully!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error deleting collectable from database: {ex.Message}");

                return Results.BadRequest($"Error deleting collectable from database: {ex.Message}");
            }
        }

    }

}