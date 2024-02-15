using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    [BsonIgnoreExtraElements]
    public class Collection
    {
        [Key]
        public ObjectId Id { get; set; }

        [StringLength(15)]
        public required string CollectionName { get; set; }

        [StringLength(50)]
        public required string CollectionDescription { get; set; }

        [StringLength(15)]
        public required string CollectionCategory { get; set; }
    }
}