using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Group6_CollectorsHideout.Tests
{
    public class AuctionsControllerTests
    {
        private readonly AuctionController _controller;
        private readonly Mock<MongoDbContext> _dbContextMock;

        public AuctionsControllerTests()
        {
            _dbContextMock = new Mock<MongoDbContext>();
            var mockDbSet = new Mock<DbSet<Auction>>();

            _controller = new AuctionController(_dbContextMock.Object);

            _dbContextMock.Setup(db => db.Auctions).Returns(mockDbSet.Object);
        }

        // Test to ensure that valid auction data leads to a successful creation and an Ok result
        [Fact]
        public async Task CreateAuction_ValidData_ReturnsOk()
        {
            var auction = new Auction
            {
                AuctionName = "Example Auction Name",
                AuctionImages = new string[] { "image1.jpg", "image2.jpg" },
                AuctionProductEstimatedValue = 1500.00,
                CollectionName = "Example Collection",
                AuctionProductState = "New",
                AuctionProductEdition = "First Edition",
                AuctionProductRarity = "Rare",
                AuctionDescription = "This is a detailed description of the auction item.",
                AuctionMinimumBid = 22,
                AuctionHighestBid = 200.00,
                AuctionStartDate = DateTime.Now.AddDays(1), 
                AuctionEndDate = DateTime.Now.AddDays(10), 
                UserId = "admin",
                AuctionBidIncrement = 5,
                AuctionState = "Active",
                Bids = new List<Bid>()
                {
                 new Bid
                    {
                    BidAmount = 100.00,
                    BidTime = DateTime.Now,
                    BidderId = "Example Bidder",
                    BidStatus = "Outbidded"
                    }
                 }
            };

            var result = await _controller.CreateAuction(auction);

            // Assert
            Assert.IsType<Ok<string>>(result);
        }

        // Test to ensure that invalid auction data leads to a BadRequest result
        [Fact]
        public async Task CreateAuction_InvalidData_ReturnsBadRequest()
        {
            var auction = new Auction
            {
                AuctionName = "",
                AuctionImages = new string[] { "" },
                AuctionProductEstimatedValue = 0,
                CollectionName = "",
                AuctionProductState = "",
                AuctionProductEdition = "",
                AuctionProductRarity = "",
                AuctionDescription = "",
                AuctionMinimumBid = 0,
                AuctionHighestBid = 0.00,
                AuctionStartDate = DateTime.Now,
                AuctionEndDate = DateTime.Now,
                UserId = "",
                AuctionBidIncrement = 0.0,
                AuctionState = "",
                Bids = new List<Bid>()
                {
                 new Bid
                 {
                    BidAmount = 0.00,
                    BidTime = DateTime.Now,
                    BidderId = "",
                    BidStatus = ""
                    }
                 }
            };

            var result = await _controller.CreateAuction(auction);

            // Assert
            Assert.IsType<BadRequest<string>>(result);
        }  
    }
}