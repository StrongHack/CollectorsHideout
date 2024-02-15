using EFCoreMongoConect;
using Grupo6_CollectorsHidout.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Grupo6_CollectorsHidout.Controllers
{
    public class CollectionsController
    {
        private readonly MongoDbContext _collections;

        /// <summary>
        /// Constructor of CollectionsController
        /// </summary>
        /// <param name="collections">Connects to collections database</param>
        public CollectionsController(MongoDbContext collections)
        {
            _collections = collections;
        }

        /// <summary>
        /// Creates a new collection in database
        /// </summary>
        /// <param name="collection">Data of collection to create</param>
        /// <returns></returns>
        public async Task<IResult> CreateCollection(Collection collection)
        {
            if (string.IsNullOrEmpty(collection.CollectionName))
            {
                return Results.BadRequest("Collection Name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collection.CollectionDescription))
            {
                return Results.BadRequest("Collection Description cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collection.CollectionCategory))
            {
                return Results.BadRequest("Collection Category cannot be null or empty!");
            }

            try
            {
                collection.Id = ObjectId.GenerateNewId();

                await _collections.Collections.AddAsync(collection);
                await _collections.SaveChangesAsync();

                return Results.Ok($"Collection {collection.CollectionName} created!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error creating collection in database: {ex.Message}");

                return Results.BadRequest($"Error creating collection in database: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets collections in database
        /// </summary>
        /// <returns>All collections in database</returns>
        public async Task<IResult> GetCollections()
        {
            try
            {
                var collections = await _collections.Collections.ToListAsync();
                var modifiedCollections = collections.Select(c => new
                {
                    Id = c.Id.ToString(),
                    c.CollectionName,
                    c.CollectionDescription,
                    c.CollectionCategory
                });

                return Results.Ok(modifiedCollections);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving collections from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving collections from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets collection by given id
        /// </summary>
        /// <param name="id">Id of collection to retrieve</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> GetCollection(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of collection to retrieve cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var collection = await _collections.Collections.FindAsync(objectId);

                if (collection == null)
                {
                    return Results.NotFound("Collection not found!");
                }

                var modifiedCollection = new
                {
                    Id = collection.Id.ToString(),
                    collection.CollectionName,
                    collection.CollectionDescription,
                    collection.CollectionCategory
                };
                return Results.Ok(modifiedCollection);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving collection from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving collection from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates collection by id with given data
        /// </summary>
        /// <param name="id">Id of collection to update</param>
        /// <param name="collection">Data to update collection</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> UpdateCollection(string id, Collection collection)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of collection to update cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collection.CollectionName))
            {
                return Results.BadRequest("Collection Name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collection.CollectionDescription))
            {
                return Results.BadRequest("Collection Description cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(collection.CollectionCategory))
            {
                return Results.BadRequest("Collection Category cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var collectionToUpdate = await _collections.Collections.FindAsync(objectId);

                if (collectionToUpdate == null)
                {
                    return Results.NotFound("Collection to update not found!");
                }

                collectionToUpdate.CollectionName = collection.CollectionName;
                collectionToUpdate.CollectionDescription = collection.CollectionDescription;
                collectionToUpdate.CollectionCategory = collection.CollectionCategory;

                await _collections.SaveChangesAsync();

                return Results.Ok($"Collection {collection.CollectionName} updated!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating collection in database: {ex.Message}");

                return Results.BadRequest($"Error updating collection in database: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes collection by id
        /// </summary>
        /// <param name="id">Id of collection to delete</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> DeleteCollection(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of collection to delete cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var collection = await _collections.Collections.FindAsync(objectId);

                if (collection == null)
                {
                    return Results.NotFound("Collection not found!");
                }

                _collections.Collections.Remove(collection);
                await _collections.SaveChangesAsync();

                return Results.Ok("Collection deleted!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error deleting collection from database: {ex.Message}");

                return Results.BadRequest($"Error deleting collection from database: {ex.Message}");
            }
        }
    }
}