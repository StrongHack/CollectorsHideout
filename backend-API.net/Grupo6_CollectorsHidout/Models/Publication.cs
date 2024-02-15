using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class Publication
    {
        [Key]
        public ObjectId Id { get; set; }

        [StringLength(20)]
        public required string Title { get; set; }

        public required string[]? Images { get; set; }

        [StringLength(50)]
        public required string Description { get; set; }

        [StringLength(50)]
        public required string UserId { get; set; }

        [StringLength(15)]
        public required string Type { get; set; }

        public required DateTime Date { get; set; }

        public DateTime? EditDate { get; set; }

        public double? Price { get; set; }

        [StringLength(15)]
        public required string State { get; set; }
    }
}
