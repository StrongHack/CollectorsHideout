using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace Group6_CollectorsHideout.Tests
{
    public class OrdersControllerTests
    {
        private readonly OrdersController _controller;
        private readonly Mock<MongoDbContext> _dbContextMock;

        public OrdersControllerTests()
        {
            _dbContextMock = new Mock<MongoDbContext>();
            var mockDbSet = new Mock<DbSet<Order>>();

            _controller = new OrdersController(_dbContextMock.Object);

            _dbContextMock.Setup(db => db.Orders).Returns(mockDbSet.Object);
        }

        // Test to ensure that valid order data leads to a successful creation and an Ok result
        [Fact]
        public async Task CreateOrders_ValidData_ReturnsOk()
        {
            var Order = new Order
            {
                UserId = "Example User Id",
                OrderDate = DateTime.Now,
                BillingAddress = "Example Billing Address",
                ShippingAddress = "Example Shipping Address",
                NIF = 263255268,
                TrackingNumber = 1111111,
                MobileNumber = 915596615,
                Status = "Example Status",
                Total= 100.00,
                IVA = 23,
                Lines = new List<Line>()
                {
                 new Line
                 {
                    Quantity = 1,
                    CollectableId = "Example Collectable Id",
                    Discount = 0,
                    }
                 }  

            };

            var result = await _controller.CreateOrder(Order);

            // Assert
            Assert.IsType<Ok<string>>(result);
        }

        // Test to ensure that invalid order data leads to a BadRequest result
        [Fact]
        public async Task CreateOrders_InvalidData_ReturnsBadRequest()
        {
            var Order = new Order
            {
                UserId = "",
                OrderDate = DateTime.Now,
                BillingAddress = "",
                ShippingAddress = "",
                NIF = 0,
                TrackingNumber = 0,
                MobileNumber = 0,
                Status = "",
                Total = 0,
                IVA = 0,
                Lines = new List<Line>()
                {
                 new Line
                 {
                    Quantity = 0,
                    CollectableId = "",
                    Discount = 0,
                    }
                 }

            };

            var result = await _controller.CreateOrder(Order);

            // Assert
            Assert.IsType<BadRequest<string>>(result);
        }
    }
}

