using Grupo6_CollectorsHidout.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;

namespace EFCoreMongoConect
{
    public class MongoDbContext : DbContext
    {
        public MongoDbContext(DbContextOptions<MongoDbContext> options) : base(options)
        {
        }

        //create empty constructor for testing
        public MongoDbContext()
        {
        }


        /// <summary>
        /// Creates models to use in database
        /// </summary>
        /// <param name="modelBuilder">Model  builder to create each model</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .ToCollection("Orders")
                .HasIndex(o => o.TrackingNumber).IsUnique();

            modelBuilder.Entity<Publication>()
                .ToCollection("Publications");

            modelBuilder.Entity<User>()
                .ToCollection("Users")
                .HasIndex(u => new { u.UserUsername, u.UserEmail }).IsUnique();

            modelBuilder.Entity<Auction>()
                .ToCollection("Auctions");

            modelBuilder.Entity<Collectable>()
                .ToCollection("Collectables");

            modelBuilder.Entity<Collection>()
                .ToCollection("Collections")
                .HasIndex(c => c.CollectionName).IsUnique();

        }
        
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Publication> Publications { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Auction> Auctions { get; set; }
        public virtual DbSet<Collectable> Collectables { get; set; }
        public virtual DbSet<Collection> Collections { get; set; }
    }
}
