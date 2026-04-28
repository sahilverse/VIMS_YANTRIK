using System;
using Yantrik.Common;

namespace Yantrik.DTOs
{
    public class InventoryPaginationParams : PaginationParams
    {
        public Guid? CategoryId { get; set; }
    }
}



