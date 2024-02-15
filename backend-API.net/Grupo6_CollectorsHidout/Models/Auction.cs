using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class Auction
    {
        [Key]
        public ObjectId Id { get; set; }

        [StringLength(20)]
        public required string AuctionName { get; set; }

        public required string[] AuctionImages { get; set; }

        public required double AuctionProductEstimatedValue { get; set; }

        public required string CollectionName { get; set; }

        [StringLength(15)]
        public required string AuctionProductState { get; set; }

        [StringLength(20)]
        public required string AuctionProductEdition { get; set; }

        [StringLength(15)]
        public required string AuctionProductRarity { get; set; }

        [StringLength(50)]
        public required string AuctionDescription { get; set; }

        public required double AuctionMinimumBid { get; set; }

        public required double AuctionHighestBid { get; set; }

        public required double AuctionBidIncrement{ get; set; }

        public required DateTime AuctionStartDate { get; set; }

        public required DateTime AuctionEndDate { get; set; }

        [StringLength(20)]
        public required string AuctionState { get; set; }

        public required string UserId { get; set; }

        public List<Bid>? Bids { get; set; }
    }
}