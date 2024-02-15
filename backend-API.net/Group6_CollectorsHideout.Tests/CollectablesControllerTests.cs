using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Group6_CollectorsHideout.Tests
{
    public class CollectablesControllerTests
    {
        private readonly CollectableController _controller;
        private readonly Mock<MongoDbContext> _dbContextMock;

        public CollectablesControllerTests()
        {
            _dbContextMock = new Mock<MongoDbContext>();
            var mockDbSet = new Mock<DbSet<Collectable>>();

            _controller = new CollectableController(_dbContextMock.Object);

            _dbContextMock.Setup(db => db.Collectables).Returns(mockDbSet.Object);
        }

        // Test to ensure that valid collectable data leads to a successful creation and an Ok result
        [Fact]
        public async Task CreateCollectable_ValidData_ReturnsOk()
        {
            var Collectable = new Collectable
            {
                CollectableDescription = "Example Collectable Description",
                CollectableName = "Example Collectable Name",
                CollectableImages = new string[] { "image1.jpg", "image2.jpg" },
                CollectablePrice= 100.00,
                CollectionId = "Example Collection Id",
                CollectableState = "Example Collectable State",
                CollectableEdition = "Example Collectable Edition",
                CollectableStock = 100,
                CollectableRarity = "Example Collectable Rarity"
            };

            var result = await _controller.CreateCollectable(Collectable);

            // Assert
            Assert.IsType<Ok<string>>(result);
        }

        // Test to ensure that invalid collectable data leads to a BadRequest result
        [Fact]
        public async Task CreateCollectable_InvalidData_ReturnsBadRequest()
        {
            var Collectable = new Collectable
            {
                CollectableDescription = "",
                CollectableName = "",
                CollectableImages = new string[] { "" },
                CollectablePrice = 0,
                CollectionId = "",
                CollectableState = "",
                CollectableEdition = "",
                CollectableStock = 100,
                CollectableRarity = ""
            };

            var result = await _controller.CreateCollectable(Collectable);

            // Assert
            Assert.IsType<BadRequest<string>>(result);
        }
    }
}
