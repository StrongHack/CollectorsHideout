using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Group6_CollectorsHideout.Tests
{
    public class PublicationsControllerTests
    {
        private readonly PublicationsController _controller;
        private readonly Mock<MongoDbContext> _dbContextMock;

        public PublicationsControllerTests()
        {
            _dbContextMock = new Mock<MongoDbContext>();
            var mockDbSet = new Mock<DbSet<Publication>>();

            _controller = new PublicationsController(_dbContextMock.Object);

            _dbContextMock.Setup(db => db.Publications).Returns(mockDbSet.Object);
        }

        // Test to ensure that valid publication data leads to a successful creation and an Ok result
        [Fact]
        public async Task CreatePublications_ValidData_ReturnsOk()
        {
            var Publication = new Publication
            {
                Title = "Example Publication Title",
                Description = "Example Publication Description",
                State = "Example Publication State",
                EditDate = DateTime.Now,
                Date = DateTime.Now,
                Images = new string[] { "image1.jpg", "image2.jpg" },
                Type = "Example Publication Type",
                UserId = "Example User Id",
                Price = 100.00,
            };

            var result = await _controller.CreatePublication(Publication);

            // Assert
            Assert.IsType<Ok<string>>(result);
        }

        // Test to ensure that invalid publication data leads to a BadRequest result
        [Fact]
        public async Task CreatePublications_InvalidData_ReturnsBadRequest()
        {
            var Publication = new Publication
            {
                Title = "",
                Description = "",
                State = "",
                EditDate = DateTime.Now,
                Date = DateTime.Now,
                Images = new string[] { "", "" },
                Type = "",
                UserId = "",
                Price = 100.00,
            };

            var result = await _controller.CreatePublication(Publication);

            // Assert
            Assert.IsType<BadRequest<string>>(result);
        }
    }
}
