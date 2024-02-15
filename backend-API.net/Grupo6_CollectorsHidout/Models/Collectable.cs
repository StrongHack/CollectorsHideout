using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class Collectable
    {
        [Key]
        public ObjectId Id { get; set; }

        [StringLength(15)]
        public required string CollectableName { get; set; }

        [StringLength(50)]
        public required string CollectableDescription { get; set; }

        public required double CollectablePrice { get; set; }

        [StringLength(50)]
        public required string CollectionId { get; set; }

        [StringLength(15)]
        public required string CollectableState { get; set; }

        [StringLength(20)]
        public required string CollectableEdition { get; set; }

        [Range(0, 10000)]
        public required int CollectableStock { get; set; }

        [StringLength(15)]
        public required string CollectableRarity { get; set; }

        public string[]? CollectableImages { get; set; }
    }
}
