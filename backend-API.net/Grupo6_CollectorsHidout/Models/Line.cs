using System.ComponentModel.DataAnnotations;

namespace Grupo6_CollectorsHidout.Models
{
    public class Line
    {
        [StringLength(50)]
        public required string CollectableId { get; set; }

        public required int Quantity { get; set; }

        public required double Discount { get; set; }

    }
}
