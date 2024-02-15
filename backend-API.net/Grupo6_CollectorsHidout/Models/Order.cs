
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class Order
    {
        [Key]
        public ObjectId Id { get; set; }

        public required int TrackingNumber { get; set; }

        public required double Total { get; set; }

        [StringLength(50)]
        public required string UserId { get; set; }

        public required int IVA { get; set; }

        [StringLength(15)]
        public required string Status { get; set; }

        public required DateTime OrderDate { get; set; }

        public required int MobileNumber { get; set; }

        public required int NIF { get; set; }

        [StringLength(20)]
        public required string BillingAddress { get; set; }

        [StringLength(20)]
        public required string ShippingAddress { get; set; }

        public List<Line>? Lines { get; set; }
    }
}
