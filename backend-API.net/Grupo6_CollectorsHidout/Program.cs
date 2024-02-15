using Microsoft.EntityFrameworkCore;
using EFCoreMongoConect;
using Grupo6_CollectorsHidout.Controllers;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Controllers;

var builder = WebApplication.CreateBuilder(args);

//Creates connection to database
builder.Services.AddDbContextFactory<MongoDbContext>(options =>
{
    options.UseMongoDB("mongodb+srv://lds-grupo6:admin@clusterlds.upzmm0m.mongodb.net/", "CollectorsHideoutDB");
});

//Allows backoffice and frontoffice origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("*")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Collectors Hideout API",
        Version = "v1",
        Description = "An API to manage the Collectors Hideout website",
    });
});



//Builds and allows cors for origins
var app = builder.Build();
app.UseCors("AllowSpecificOrigin");

app.UseSwagger();
app.UseSwaggerUI();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<IDbContextFactory<MongoDbContext>>();

//Controllers for api
var controllerO = new OrdersController(dbContext.CreateDbContext());
var controllerP = new PublicationsController(dbContext.CreateDbContext());
var controllerUs = new UserController(dbContext.CreateDbContext());
var controllerAu = new AuctionController(dbContext.CreateDbContext());
var controllerCe = new CollectableController(dbContext.CreateDbContext());
var controllerCn = new CollectionsController(dbContext.CreateDbContext());

var controllerIm = new ImagesController(builder.Environment.ContentRootPath);

//Images Routes
app.MapPost("api/images/upload", controllerIm.UploadFile);
app.MapGet("api/images/load", controllerIm.GetFile);

//Order Routes
app.MapPost("api/orders", controllerO.CreateOrder);
app.MapGet("api/orders", controllerO.GetOrders);
app.MapGet("api/orders/{id}", controllerO.GetOrder);
app.MapPut("api/orders/{id}", controllerO.UpdateOrder);
app.MapDelete("api/orders/{id}", controllerO.DeleteOrder);

//Publication Routes
app.MapPost("api/publications", controllerP.CreatePublication);
app.MapGet("api/publications", controllerP.GetPublications);
app.MapGet("api/publications/{id}", controllerP.GetPublication);
app.MapPut("api/publications/{id}", controllerP.UpdatePublication);
app.MapDelete("api/publications/{id}", controllerP.DeletePublication);

//User Routes
app.MapPost("api/users", controllerUs.CreateUser);
app.MapGet("api/users", controllerUs.GetUsers);
app.MapGet("api/users/{id}", controllerUs.GetUser);
app.MapPut("api/users/{id}", controllerUs.UpdateUser);
app.MapDelete("api/users/{id}", controllerUs.DeleteUser);
app.MapPost("api/users/addToCart/{id}", controllerUs.AddItemToCart);
app.MapPut("api/users/updateCart/{id}", controllerUs.UpdateCartItem);
app.MapGet("api/users/getCart/{id}", controllerUs.GetUserCartItems);
app.MapDelete("api/users/removeFromCart/{id}/{cartItemId}", controllerUs.DeleteUserCartItem);
app.MapPost("api/users/authenticate", controllerUs.AuthenticateUser);

//Auctions Routes
app.MapPost("api/auctions", controllerAu.CreateAuction);
app.MapGet("api/auctions", controllerAu.GetAuctions);
app.MapGet("api/auctions/{id}", controllerAu.GetAuction);
app.MapPut("api/auctions/{id}", controllerAu.UpdateAuction);
app.MapDelete("api/auctions/{id}", controllerAu.DeleteAuction);

//Collectables Routes
app.MapPost("api/collectables", controllerCe.CreateCollectable);
app.MapGet("api/collectables", controllerCe.GetCollectables);
app.MapGet("api/collectables/{id}", controllerCe.GetCollectable);
app.MapGet("api/collectables/collection/{collectionName}", controllerCe.GetCollectablesByCollectionName);
app.MapPut("api/collectables/{id}", controllerCe.UpdateCollectable);
app.MapDelete("api/collectables/{id}", controllerCe.DeleteCollectable);

//Publication Routes
app.MapPost("api/collections", controllerCn.CreateCollection);
app.MapGet("api/collections", controllerCn.GetCollections);
app.MapGet("api/collections/{id}", controllerCn.GetCollection);
app.MapPut("api/collections/{id}", controllerCn.UpdateCollection);
app.MapDelete("api/collections/{id}", controllerCn.DeleteCollection);

app.UseStaticFiles();

app.Run();
