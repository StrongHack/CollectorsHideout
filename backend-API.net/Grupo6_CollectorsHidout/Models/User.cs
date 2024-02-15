using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class User
    {
        [Key]
        public ObjectId Id { get; set; }

        [StringLength(15)]
        public required string UserPersonalName { get; set; }

        [StringLength(15)]
        public required string UserUsername { get; set; }

        [StringLength(20)]
        [EmailAddress]
        public required string UserEmail { get; set; }

        [StringLength(20, MinimumLength = 6)]
        public required string UserPassword { get; set; }

        [StringLength(50)]
        public required string UserProfilePicture { get; set; }

        public required string[]? UserAuctionsIds { get; set; }

        public required string[]? UserOrdersIds { get; set; }

        public required string[]? UserCollectablesIds { get; set; }

        public required string[]? UserPublicationsIds { get; set; }

        public List<Line> CartProducts { get; set; } = new List<Line>();
    }
}
