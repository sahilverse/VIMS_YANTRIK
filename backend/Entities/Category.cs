using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        public ICollection<Part> Parts { get; set; } = new List<Part>();
    }
}



