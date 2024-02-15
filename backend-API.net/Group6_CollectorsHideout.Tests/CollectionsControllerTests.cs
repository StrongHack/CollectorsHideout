using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Group6_CollectorsHideout.Tests
{
    public class CollectionsControllerTests
    {
        private readonly CollectionsController _controller;
        private readonly Mock<MongoDbContext> _dbContextMock;

        public CollectionsControllerTests()
        {
            _dbContextMock = new Mock<MongoDbContext>();
            var mockDbSet = new Mock<DbSet<Collection>>();

            _controller = new CollectionsController(_dbContextMock.Object);

            _dbContextMock.Setup(db => db.Collections).Returns(mockDbSet.Object);
        }

        // Test to ensure that valid collection data leads to a successful creation and an Ok result
        [Fact]
        public async Task CreateCollections_ValidData_ReturnsOk()
        {
            var Collection = new Collection
            {
                CollectionCategory = "Example Collection Category",
                CollectionDescription = "Example Collection Description",
                CollectionName = "Example Collection Name",
            };

            var result = await _controller.CreateCollection(Collection);

            // Assert
            Assert.IsType<Ok<string>>(result);
        }

        // Test to ensure that invalid collection data leads to a BadRequest result
        [Fact]
        public async Task CreateCollections_InvalidData_ReturnsBadRequest()
        {
            var Collection = new Collection
            {
                CollectionCategory = "",
                CollectionDescription = "",
                CollectionName = "",
            };

            var result = await _controller.CreateCollection(Collection);

            // Assert
            Assert.IsType<BadRequest<string>>(result);
        }
    }
}
