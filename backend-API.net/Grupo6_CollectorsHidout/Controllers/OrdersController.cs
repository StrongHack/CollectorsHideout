using Grupo6_CollectorsHidout.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using EFCoreMongoConect;

namespace Grupo6_CollectorsHidout.Controllers;

public class OrdersController
{
    private readonly MongoDbContext _orders;

    /// <summary>
    /// Constructor of OrdersController
    /// </summary>
    /// <param name="collections">Connects to orders database</param>
    public OrdersController(MongoDbContext orders)
    {
        _orders = orders;
    }

    /// <summary>
    /// Creates order with given data
    /// </summary>
    /// <param name="order">Data of order to create</param>
    /// <returns>Request status. Ok if successfull, else bad request.</returns>
    public async Task<IResult> CreateOrder(Order order)
    {
        if (order.TrackingNumber <= 0)
        {
            return Results.BadRequest("Tracking Number cannot be bellow zero!");
        }

        if (order.Total <= 0)
        {
            return Results.BadRequest("Price cannot be zero or bellow!");
        }

        if (string.IsNullOrEmpty(order.UserId))
        {
            return Results.BadRequest("User id cannot be null or empty!");
        }

        if (order.IVA <= 0)
        {
            return Results.BadRequest("IVA cannot be zero or bellow!");
        }

        if (string.IsNullOrEmpty(order.Status))
        {
            return Results.BadRequest("Status cannot be null or empty!");
        }

        if (order.MobileNumber < 900000000 || order.MobileNumber > 999999999)
        {
            return Results.BadRequest("Mobile number is invalid!");
        }

        if (order.NIF < 100000000 || order.NIF > 999999999)
        {
            return Results.BadRequest("Order NIF is invalid!");
        }

        if (string.IsNullOrEmpty(order.BillingAddress))
        {
            return Results.BadRequest("Billidng address cannot be null or empty!");
        }

        if (string.IsNullOrEmpty(order.ShippingAddress))
        {
            return Results.BadRequest("Shipping address cannot be null or empty!");
        }

        if (order.Lines == null || order.Lines.Count == 0)
        {
            return Results.BadRequest("Lines cannot be null or empty!");
        }

        try
        {
            order.OrderDate = DateTime.Now;

            order.Id = ObjectId.GenerateNewId();

            await _orders.Orders.AddAsync(order);
            await _orders.SaveChangesAsync();
            return Results.Ok($"Order {order.Id} created successfully");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error creating order: {ex.Message}");

            return Results.BadRequest($"Error creating order: {ex.Message}");
        }
    }

    /// <summary>
    /// Gets all orders from database
    /// </summary>
    /// <returns>All orders in database</returns>
    public async Task<IResult> GetOrders()
    {
        try
        {
            var orders = await _orders.Orders.ToListAsync();
            var modifiedOrders = orders.Select(c => new
            {
                Id = c.Id.ToString(),
                c.TrackingNumber,
                c.Total,
                c.UserId,
                c.IVA,
                c.Status,
                c.OrderDate,
                c.MobileNumber,
                c.NIF,
                c.BillingAddress,
                c.ShippingAddress,
                c.Lines,
            });

            return Results.Ok(modifiedOrders);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error retrieving orders: {ex.Message}");

            return Results.BadRequest($"Error retrieving orders: {ex.Message}");
        }
    }

    /// <summary>
    /// Gets order by id
    /// </summary>
    /// <param name="id">Id of order to get</param>
    /// <returns>Order by id</returns>
    public async Task<IResult> GetOrder(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return Results.BadRequest("Id of order cannot be null or empty!");
        }

        try
        {
            var objectId = new ObjectId(id);
            var order = await _orders.Orders.FindAsync(objectId);

            if (order == null)
            {
                return Results.NotFound("Order not found!");
            }

            var modifiedOrders = new
            {
                Id = order.Id.ToString(),
                order.TrackingNumber,
                order.Total,
                order.UserId,
                order.IVA,
                order.Status,
                order.OrderDate,
                order.MobileNumber,
                order.NIF,
                order.BillingAddress,
                order.ShippingAddress,
                order.Lines,
            };

            return Results.Ok(modifiedOrders);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error retrieving order: {ex.Message}");

            return Results.BadRequest($"Error retrieving order: {ex.Message}");
        }
    }

    /// <summary>
    /// Updates order by id and with given data
    /// </summary>
    /// <param name="id">Id of order to update</param>
    /// <param name="order">Data to update order</param>
    /// <returns>Request status. Ok if successfull, else bad request.</returns>
    public async Task<IResult> UpdateOrder(string id, Order order)
    {
        if (string.IsNullOrEmpty(id))
        {
            return Results.BadRequest("Id of order cannot be null or empty!");
        }

        if (order.TrackingNumber <= 0)
        {
            return Results.BadRequest("Tracking Number cannot be bellow zero!");
        }

        if (order.Total <= 0)
        {
            return Results.BadRequest("Price cannot be zero or bellow!");
        }

        if (string.IsNullOrEmpty(order.UserId))
        {
            return Results.BadRequest("User id cannot be null or empty!");
        }

        if (order.IVA <= 0)
        {
            return Results.BadRequest("IVA cannot be zero or bellow!");
        }

        if (string.IsNullOrEmpty(order.Status))
        {
            return Results.BadRequest("Status cannot be null or empty!");
        }

        if (order.MobileNumber < 900000000 || order.MobileNumber > 999999999)
        {
            return Results.BadRequest("Mobile number is invalid!");
        }

        if (order.NIF < 100000000 || order.NIF > 999999999)
        {
            return Results.BadRequest("Order NIF is invalid!");
        }

        if (string.IsNullOrEmpty(order.BillingAddress))
        {
            return Results.BadRequest("Billidng address cannot be null or empty!");
        }

        if (string.IsNullOrEmpty(order.ShippingAddress))
        {
            return Results.BadRequest("Shipping address cannot be null or empty!");
        }

        if (order.Lines == null || order.Lines.Count == 0)
        {
            return Results.BadRequest("Lines cannot be null or empty!");
        }

        try
        {
            var objectId = new ObjectId(id);
            var existingOrder = await _orders.Orders.FindAsync(objectId);

            if (existingOrder == null)
            {
                return Results.NotFound("Order to update Not Found");
            }

            existingOrder.TrackingNumber = order.TrackingNumber;
            existingOrder.Total = order.Total;
            existingOrder.UserId = order.UserId;
            existingOrder.IVA = order.IVA;
            existingOrder.Status = order.Status;
            existingOrder.MobileNumber = order.MobileNumber;
            existingOrder.NIF = order.NIF;
            existingOrder.BillingAddress = order.BillingAddress;
            existingOrder.ShippingAddress = order.ShippingAddress;
            existingOrder.Lines = order.Lines;

            await _orders.SaveChangesAsync();

            return Results.Ok($"Order {order.TrackingNumber} updated successfully");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error update order: {ex.Message}");

            return Results.BadRequest($"Error update order: {ex.Message}");
        }
    }

    /// <summary>
    /// Deletes order by id
    /// </summary>
    /// <param name="id">Id of order to delete</param>
    /// <returns>Status request. Ok if successfull, else bad request.</returns>
    public async Task<IResult> DeleteOrder(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return Results.BadRequest("Id of order to delete cannot be empty!");
        }

        try
        {
            var objectId = new ObjectId(id);
            var order = await _orders.Orders.FindAsync(objectId);

            if (order == null)
            {
                return Results.NotFound("Order to delete not found.");
            }

            _orders.Orders.Remove(order);
            await _orders.SaveChangesAsync();
            return Results.Ok($"Order {order.Id} deleted successfully");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error deleting order: {ex.Message}");

            return Results.BadRequest($"Error deleting order: {ex.Message}");
        }
    }
}