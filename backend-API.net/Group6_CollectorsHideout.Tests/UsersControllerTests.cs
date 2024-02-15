using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Group6_CollectorsHideout.Tests
{
    public class UsersControllerTests
    {
        private readonly UserController _controller;
        private readonly Mock<MongoDbContext> _dbContextMock;

        public UsersControllerTests()
        {
            _dbContextMock = new Mock<MongoDbContext>();
            var mockDbSet = new Mock<DbSet<User>>();

            _controller = new UserController(_dbContextMock.Object);

            _dbContextMock.Setup(db => db.Users).Returns(mockDbSet.Object);
        }

        // Test to ensure that valid user data leads to a successful creation and an Ok result
        [Fact]
        public async Task CreateUsers_ValidData_ReturnsOk()
        {
            var User = new User
            {
                UserUsername = "Example User Username",
                UserPassword = "Example User Password",
                UserEmail = "Example User Email",
                UserAuctionsIds = new string[] { "Example Auction Id 1", "Example Auction Id 2" },
                UserCollectablesIds = new string[] { "Example Collectable Id 1", "Example Collectable Id 2" },
                UserOrdersIds = new string[] { "Example Order Id 1", "Example Order Id 2" },
                UserPersonalName = "Example User Personal Name",
                UserProfilePicture = "Example User Profile Picture",
                UserPublicationsIds = new string[] { "Example Publication Id 1", "Example Publication Id 2" },
                CartProducts= new List<Line>()
                {
                 new Line
                 {
                    Quantity = 1,
                    CollectableId = "Example Collectable Id",
                    Discount = 0,
                    }
                 }
            };

            var result = await _controller.CreateUser(User);

            // Assert
            Assert.IsType<Ok<string>>(result);
        }

        // Test to ensure that invalid user data leads to a BadRequest result
        [Fact]
        public async Task CreateUsers_InvalidData_ReturnsBadRequest()
        {
            var User = new User
            {
                UserUsername = "",
                UserPassword = "",
                UserEmail = "",
                UserAuctionsIds = new string[] { "" },
                UserCollectablesIds = new string[] { "" },
                UserOrdersIds = new string[] {""},
                UserPersonalName = "",
                UserProfilePicture = "",
                UserPublicationsIds = new string[] {""},
                CartProducts = new List<Line>()
                {
                 new Line
                 {
                    Quantity = 0,
                    CollectableId = "",
                    Discount = 0,
                    }
                 }
            };

            var result = await _controller.CreateUser(User);

            // Assert
            Assert.IsType<BadRequest<string>>(result);
        }
    }
}
