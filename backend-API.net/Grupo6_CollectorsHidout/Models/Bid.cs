using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class Bid
    {
        public required double BidAmount { get; set; }

        public required DateTime BidTime { get; set; }

        [StringLength(50)]
        public required string BidderId { get; set; }

        [StringLength(20)]
        public required string BidStatus { get; set; }
    }
}