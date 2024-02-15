using EFCoreMongoConect;
using Grupo6_CollectorsHidout.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Grupo6_CollectorsHidout.Controllers
{
    public class AuctionController
    {
        private readonly MongoDbContext _auctions;

        /// <summary>
        /// Auctions Controller Constructor
        /// </summary>
        /// <param name="auctions">Connects to auctions in database</param>
        public AuctionController(MongoDbContext auctions)
        {
            _auctions = auctions;
        }

        /// <summary>
        /// Creates a Auction in database
        /// </summary>
        /// <param name="auction">Data of auction to create</param>
        /// <returns></returns>
        public async Task<IResult> CreateAuction(Auction auction)
        {
            auction.Id = ObjectId.GenerateNewId();

            if (string.IsNullOrEmpty(auction.AuctionName))
            {
                return Results.BadRequest("Auction name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(auction.AuctionState))
            {
                return Results.BadRequest("Auction state cannot be null or empty!");
            }

            if (auction.AuctionImages == null)
            {
                return Results.BadRequest("Auction images cannot be null!");
            }
            if (auction.AuctionProductEstimatedValue <= 0)
            {
                return Results.BadRequest("Auction product estimated value cannot be zero or bellow!");
            }
            if (string.IsNullOrEmpty(auction.CollectionName))
            {
                return Results.BadRequest("Collection id cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionProductState))
            {
                return Results.BadRequest("Auction product state cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionProductEdition))
            {
                return Results.BadRequest("Auction product edition cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionProductRarity))
            {
                return Results.BadRequest("Auction product rarity cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionDescription))
            {
                return Results.BadRequest("Auction description cannot be null or empty!");
            }

            if (auction.AuctionMinimumBid <= 0)
            {
                return Results.BadRequest("Auction minimum bid cannot be zero or bellow!");
            }

            if (auction.AuctionHighestBid < 0)
            {
                return Results.BadRequest("Auction highest bid cannot be bellow zero!");
            }

            if (auction.AuctionBidIncrement <= 0)
            {
                return Results.BadRequest("Auction bid increment cannot be zero or bellow!");
            }

            if (auction.AuctionStartDate == default || auction.AuctionStartDate <= DateTime.Now)
            {
                return Results.BadRequest("Auction start time cannot be null or earlier than or equal to the current time.");
            }

            if (auction.AuctionEndDate == default || auction.AuctionEndDate <= DateTime.Now)
            {
                return Results.BadRequest("Auction end time cannot be null or earlier than or equal to the current time.");
            }

            if (auction.AuctionEndDate < auction.AuctionStartDate)
            {
                return Results.BadRequest("Auction end time cannot be before auction start time.");
            }

            if (string.IsNullOrEmpty(auction.UserId))
            {
                return Results.BadRequest("UserId cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(auction.AuctionState))
            {
                return Results.BadRequest("Auction state cannot be null or empty!");
            }

            auction.AuctionHighestBid = auction.AuctionMinimumBid;

            if (auction.AuctionHighestBid < auction.AuctionMinimumBid)
            {
                return Results.BadRequest("Auction highest bid cannot be bellow minimum bid!");
            }

            try
            {

                await _auctions.Auctions.AddAsync(auction);
                await _auctions.SaveChangesAsync();

                return Results.Ok($"Auction {auction.AuctionName} created!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error adding auction to database: {ex.Message}");

                return Results.BadRequest($"Error adding auction to database: {ex.Message}");
            }

        }

        /// <summary>
        /// Gets all auctions in database
        /// </summary>
        /// <returns>All auctions in database</returns>
        public async Task<IResult> GetAuctions()
        {
            try
            {
                var auctions = await _auctions.Auctions.ToListAsync();
                var modifiedAuctions = auctions.Select(a => new
                {
                    Id = a.Id.ToString(),
                    a.AuctionName,
                    a.AuctionImages,
                    a.AuctionProductEstimatedValue,
                    a.CollectionName,
                    a.AuctionProductState,
                    a.AuctionProductEdition,
                    a.AuctionProductRarity,
                    a.AuctionDescription,
                    a.AuctionMinimumBid,
                    a.AuctionHighestBid,
                    a.AuctionBidIncrement,
                    a.AuctionStartDate,
                    a.AuctionEndDate,
                    a.UserId,
                    a.AuctionState,
                    Bids = a.Bids ?? new List<Bid>(),
                });
                return Results.Ok(modifiedAuctions);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving auctions from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving auctions from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets auction by id
        /// </summary>
        /// <param name="id">Id of auction to retrieve</param>
        /// <returns>Auction by given id</returns>
        public async Task<IResult> GetAuction(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of auction to retrieve cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var auction = await _auctions.Auctions.FindAsync(objectId);

                if (auction == null)
                {
                    return Results.NotFound("Auction not found!");
                }

                var modifiedAuction = new
                {
                    Id = auction.Id.ToString(),
                    auction.AuctionName,
                    auction.AuctionState,
                    auction.AuctionImages,
                    auction.AuctionProductEstimatedValue,
                    auction.CollectionName,
                    auction.AuctionProductState,
                    auction.AuctionProductEdition,
                    auction.AuctionProductRarity,
                    auction.AuctionDescription,
                    auction.AuctionMinimumBid,
                    auction.AuctionHighestBid,
                    auction.AuctionBidIncrement,
                    auction.AuctionStartDate,
                    auction.AuctionEndDate,
                    auction.UserId,
                    auction.Bids,
                };

                return Results.Ok(modifiedAuction);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving auction from database: {ex.Message}");

                return Results.BadRequest($"Error retrieving auction from database: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates auction by id with given data
        /// </summary>
        /// <param name="id">Id of auction to update</param>
        /// <param name="auction">Data to update auction</param>
        /// <returns>Status of request. Ok if successfull, else bad request</returns>
        public async Task<IResult> UpdateAuction(string id, Auction auction)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of auction to update cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(auction.AuctionName))
            {
                return Results.BadRequest("Auction name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(auction.AuctionState))
            {
                return Results.BadRequest("Auction state cannot be null or empty!");
            }

            if (auction.AuctionImages == null)
            {
                return Results.BadRequest("Auction images cannot be null!");
            }
            if (auction.AuctionProductEstimatedValue <= 0)
            {
                return Results.BadRequest("Auction product estimated value cannot be zero or bellow!");
            }
            if (string.IsNullOrEmpty(auction.CollectionName))
            {
                return Results.BadRequest("Collection id cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionProductState))
            {
                return Results.BadRequest("Auction product state cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionProductEdition))
            {
                return Results.BadRequest("Auction product edition cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionProductRarity))
            {
                return Results.BadRequest("Auction product rarity cannot be null or empty!");
            }
            if (string.IsNullOrEmpty(auction.AuctionDescription))
            {
                return Results.BadRequest("Auction description cannot be null or empty!");
            }

            if (auction.AuctionMinimumBid <= 0)
            {
                return Results.BadRequest("Auction minimum bid cannot be zero or bellow!");
            }

            if (auction.AuctionHighestBid < 0)
            {
                return Results.BadRequest("Auction highest bid cannot be bellow zero!");
            }

            if (auction.AuctionBidIncrement <= 0)
            {
                return Results.BadRequest("Auction bid increment cannot be zero or bellow!");
            }

            if (auction.AuctionEndDate < auction.AuctionStartDate)
            {
                return Results.BadRequest("Auction end time cannot be before auction start time.");
            }

            if (string.IsNullOrEmpty(auction.UserId))
            {
                return Results.BadRequest("UserId cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(auction.AuctionState))
            {
                return Results.BadRequest("Auction state cannot be null or empty!");
            }


            try
            {
                var objectId = new ObjectId(id);
                var auctionToUpdate = await _auctions.Auctions.FindAsync(objectId);

                if (auctionToUpdate == null)
                {
                    return Results.NotFound("Auction to update not found!");
                }

                auctionToUpdate.AuctionName = auction.AuctionName;
                auctionToUpdate.AuctionState = auction.AuctionState;
                auctionToUpdate.AuctionImages = auction.AuctionImages;
                auctionToUpdate.AuctionProductEstimatedValue = auction.AuctionProductEstimatedValue;
                auctionToUpdate.CollectionName = auction.CollectionName;
                auctionToUpdate.AuctionProductState = auction.AuctionProductState;
                auctionToUpdate.AuctionProductEdition = auction.AuctionProductEdition;
                auctionToUpdate.AuctionProductRarity = auction.AuctionProductRarity;
                auctionToUpdate.AuctionDescription = auction.AuctionDescription;
                auctionToUpdate.AuctionMinimumBid = auction.AuctionMinimumBid;
                auctionToUpdate.AuctionHighestBid = auction.AuctionHighestBid;
                auctionToUpdate.AuctionBidIncrement = auction.AuctionBidIncrement;
                auctionToUpdate.AuctionStartDate = auction.AuctionStartDate;
                auctionToUpdate.AuctionEndDate = auction.AuctionEndDate;
                auctionToUpdate.UserId = auction.UserId;
                auctionToUpdate.Bids = auction.Bids;

                await _auctions.SaveChangesAsync();
                return Results.Ok($"Auction {auction.AuctionName} updated!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating auction in database: {ex.Message}");

                return Results.BadRequest($"Error updating auction in database: {ex.Message}");
            }
        }


        /// <summary>
        /// Deletes auction by id
        /// </summary>
        /// <param name="id">Id of auction to delete</param>
        /// <returns>Status of request. Ok if successfull, else bad request.</returns>
        public async Task<IResult> DeleteAuction(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of auction to delete cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var auction = await _auctions.Auctions.FindAsync(objectId);

                if (auction == null)
                {
                    return Results.NotFound("Auction to delete not found!");
                }

                _auctions.Auctions.Remove(auction);
                await _auctions.SaveChangesAsync();

                return Results.Ok($"Auction {auction.AuctionName} deleted!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error deleting auction from database: {ex.Message}");

                return Results.BadRequest($"Error deleting auction from database: {ex.Message}");
            }
        }
    }
}