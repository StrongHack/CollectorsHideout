using EFCoreMongoConect;
using Grupo6_CollectorsHidout.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;

namespace Grupo6_CollectorsHidout.Controllers
{
    public class UserController
    {
        private readonly MongoDbContext _users;

        /// <summary>
        /// Constructor of UserController
        /// </summary>
        /// <param name="collections">Connects to users database</param>
        public UserController(MongoDbContext users)
        {
            _users = users;
        }

        /// <summary>
        /// Creates user with given data
        /// </summary>
        /// <param name="user">Data of user to create</param>
        /// <returns>Status request. Ok if successfull, else bad request</returns>
        public async Task<IResult> CreateUser(User user)
        {
            user.Id = ObjectId.GenerateNewId();

            if (string.IsNullOrEmpty(user.UserPersonalName))
            {
                return Results.BadRequest("User personal name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(user.UserUsername))
            {
                return Results.BadRequest("User username cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(user.UserEmail))
            {
                return Results.BadRequest("User email cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(user.UserPassword))
            {
                Results.BadRequest("User password cannot be null or empty!");
            }

            if (user.UserAuctionsIds == null)
            {
                return Results.BadRequest("User auctions ids cannot be null!");
            }

            if (user.UserOrdersIds == null)
            {
                return Results.BadRequest("User orders ids cannot be null!");
            }

            if (user.UserCollectablesIds == null)
            {
                return Results.BadRequest("User collectables ids cannot be null!");
            }

            if (user.UserPublicationsIds == null)
            {
                return Results.BadRequest("User publications ids cannot be null!");
            }

            if (user.CartProducts == null)
            {
                return Results.BadRequest("User cart products cannot be null!");
            }

            try
            {
                // Hash the user's password before saving it to the database
                user.UserPassword = BCrypt.Net.BCrypt.HashPassword(user.UserPassword);

                await _users.Users.AddAsync(user);
                await _users.SaveChangesAsync();
                return Results.Ok($"User {user.UserUsername} created!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error creating user: {ex.Message}");

                return Results.BadRequest($"Error creating user: {ex.Message}");
            }
        }

        /// <summary>
        /// Authenticates user
        /// </summary>
        /// <param name="request">Data for user to authenticate</param>
        /// <returns>Status request. User id if successfull, else bad request</returns>
        public async Task<IResult> AuthenticateUser([FromBody] AuthenticationRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return Results.BadRequest("Email cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                return Results.BadRequest("Password cannot be null or empty!");
            }

            try
            {
                User? user = await _users.Users.FirstOrDefaultAsync(u => u.UserEmail == request.Email);

                if (user == null)
                {
                    return Results.BadRequest("Invalid email!");
                }

                // Verify the hashed password using BCrypt
                if (BCrypt.Net.BCrypt.Verify(request.Password, user.UserPassword))
                {
                    return Results.Ok(user.Id.ToString());
                }
                else
                {
                    return Results.BadRequest("Invalid password!");
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error authenticating user: {ex.Message}");

                return Results.BadRequest($"Error authenticating user: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets all users from database
        /// </summary>
        /// <returns>All users in database</returns>
        public async Task<IResult> GetUsers()
        {
            try
            {
                var users = await _users.Users.ToListAsync();
                var modifiedUsers = users.Select(u => new
                {
                    Id = u.Id.ToString(),
                    u.UserPersonalName,
                    u.UserUsername,
                    u.UserEmail,
                    u.UserPassword,
                    u.UserProfilePicture,
                    u.UserAuctionsIds,
                    u.UserOrdersIds,
                    u.UserCollectablesIds,
                    u.UserPublicationsIds,
                    u.CartProducts
                });

                return Results.Ok(modifiedUsers);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving users: {ex.Message}");

                return Results.BadRequest($"Error retrieving users: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets user by id
        /// </summary>
        /// <param name="id">Id of user to retrieve</param>
        /// <returns>User by id</returns>
        public async Task<IResult> GetUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user to retrieve cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var user = await _users.Users.FindAsync(objectId);

                if (user == null)
                {
                    return Results.NotFound("User not found!");
                }

                var modifiedUser = new
                {
                    Id = user.Id.ToString(),
                    user.UserPersonalName,
                    user.UserUsername,
                    user.UserEmail,
                    user.UserPassword,
                    user.UserProfilePicture,
                    user.UserAuctionsIds,
                    user.UserOrdersIds,
                    user.UserCollectablesIds,
                    user.UserPublicationsIds,
                    user.CartProducts
                };

                return Results.Ok(modifiedUser);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving user: {ex.Message}");

                return Results.BadRequest($"Error retrieving user: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates user by id and with given data
        /// </summary>
        /// <param name="id">Id of user to update</param>
        /// <param name="user">Data to update user</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> UpdateUser(string id, User user)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user cannot be empty or null!");
            }

            if (string.IsNullOrEmpty(user.UserPersonalName))
            {
                return Results.BadRequest("User personal name cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(user.UserUsername))
            {
                return Results.BadRequest("User username cannot be null or empty!");
            }

            if (string.IsNullOrEmpty(user.UserEmail))
            {
                return Results.BadRequest("User email cannot be null or empty!");
            }

            if (user.UserAuctionsIds == null)
            {
                return Results.BadRequest("User auctions ids cannot be null!");
            }

            if (user.UserOrdersIds == null)
            {
                return Results.BadRequest("User orders ids cannot be null!");
            }

            if (user.UserCollectablesIds == null)
            {
                return Results.BadRequest("User collectables ids cannot be null!");
            }

            if (user.UserPublicationsIds == null)
            {
                return Results.BadRequest("User publications ids cannot be null!");
            }

            if (user.CartProducts == null)
            {
                return Results.BadRequest("User cart products cannot be null!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var userToUpdate = await _users.Users.FindAsync(objectId);

                if (userToUpdate == null)
                {
                    return Results.NotFound("User not found!");
                }

                userToUpdate.UserPersonalName = user.UserPersonalName;
                userToUpdate.UserUsername = user.UserUsername;
                userToUpdate.UserEmail = user.UserEmail;
                userToUpdate.UserProfilePicture = user.UserProfilePicture;
                userToUpdate.UserAuctionsIds = user.UserAuctionsIds;
                userToUpdate.UserOrdersIds = user.UserOrdersIds;
                userToUpdate.UserCollectablesIds = user.UserCollectablesIds;
                userToUpdate.UserPublicationsIds = user.UserPublicationsIds;
                userToUpdate.CartProducts = user.CartProducts;
                userToUpdate.UserPassword = BCrypt.Net.BCrypt.HashPassword(user.UserPassword);

                await _users.SaveChangesAsync();
                return Results.Ok($"User {user.UserUsername} updated!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating user: {ex.Message}");

                return Results.BadRequest($"Error updating user: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes user by id
        /// </summary>
        /// <param name="id">Id of user to delete</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user to deleted cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var user = await _users.Users.FindAsync(objectId);

                if (user == null)
                {
                    return Results.NotFound("User to delete not found!");
                }

                _users.Users.Remove(user);
                await _users.SaveChangesAsync();

                return Results.Ok("User deleted successfully!");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error deleting user: {ex.Message}");

                return Results.BadRequest($"Error deleting user: {ex.Message}");
            }
        }

        /// <summary>
        /// Controller for user cart items
        /// </summary>
        /// <param name="userId">Id of user to add cart item to</param>
        /// <param name="cartItem">Cart item to add to user</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> AddItemToCart(string id, Line cartItem)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user cannot be null or empty!");
            }

            if (cartItem == null)
            {
                return Results.BadRequest("Item to add to cart cannot be null!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var user = await _users.Users.FindAsync(objectId);

                if (user == null)
                {
                    return Results.NotFound("User not found!");
                }

                user.CartProducts.Add(cartItem);

                await _users.SaveChangesAsync();
                return Results.Ok($"Cart item added to user {user.UserUsername}'s cart.");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error adding item to user cart: {ex.Message}");

                return Results.BadRequest($"Error adding item to user cart: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates user cart
        /// </summary>
        /// <param name="userId">Id of user to update cart item to</param>
        /// <param name="cartItem">Cart item to update</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> UpdateCartItem(string id, Line cartItem)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user cannot be null or empty!");
            }

            if (cartItem == null)
            {
                return Results.BadRequest("Item do update in cart cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var user = await _users.Users.FindAsync(objectId);

                if (user == null)
                {
                    return Results.NotFound("User not found!");
                }

                var cartItemToUpdate = user.CartProducts.FirstOrDefault(c => c.CollectableId == cartItem.CollectableId);

                if (cartItemToUpdate == null)
                {
                    return Results.NotFound($"Cart item to update not found.");
                }

                cartItemToUpdate.Quantity = cartItem.Quantity;
                cartItemToUpdate.Discount = cartItem.Discount;

                await _users.SaveChangesAsync();
                return Results.Ok($"Cart item updated to user {user.UserUsername}'s cart.");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating item in user cart: {ex.Message}");

                return Results.BadRequest($"Error updating item in user cart: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets items in user cart
        /// </summary>
        /// <param name="userId">Id of user to get cart items from</param>
        /// <returns>Items in user cart</returns>
        public async Task<IResult> GetUserCartItems(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var user = await _users.Users.FindAsync(objectId);

                if (user == null)
                {
                    return Results.NotFound($"User not found.");
                }

                return Results.Ok(user.CartProducts);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error retrieving user cart items: {ex.Message}");

                return Results.BadRequest($"Error retrieving user cart items: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes item in user cart
        /// </summary>
        /// <param name="userId">Id of user to delete item from cart</param>
        /// <param name="cartItemId">Id of cart item to delete</param>
        /// <returns>Request status. Ok if successfull, else bad request.</returns>
        public async Task<IResult> DeleteUserCartItem(string id, string cartItemId)
        {
            if (string.IsNullOrEmpty(id))
            {
                return Results.BadRequest("Id of user cannot be null or empty!");
            }

            if(string.IsNullOrEmpty(cartItemId)) {
                return Results.BadRequest("Id of item in cart cannot be null or empty!");
            }

            try
            {
                var objectId = new ObjectId(id);
                var user = await _users.Users.FindAsync(objectId);

                if (user == null)
                {
                    return Results.NotFound($"User not found.");
                }

                var cartItem = user.CartProducts.FirstOrDefault(c => c.CollectableId == cartItemId);

                if (cartItem == null)
                {
                    return Results.NotFound($"Cart item not found.");
                }

                user.CartProducts.Remove(cartItem);

                await _users.SaveChangesAsync();
                return Results.Ok($"Cart item with ID {cartItemId} deleted.");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error deleting item from user cart: {ex.Message}");

                return Results.BadRequest($"Error deleting item from user cart: {ex.Message}");
            }
        }
    }
}