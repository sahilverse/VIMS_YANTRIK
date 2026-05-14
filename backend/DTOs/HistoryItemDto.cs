using System;

namespace Yantrik.DTOs
{
    public class HistoryItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Invoice, Service, etc.
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public decimal? SubTotal { get; set; }
        public decimal? TaxAmount { get; set; }
        public string? PlateNumber { get; set; }
        public string? VehicleModel { get; set; }
        public string? VehicleBrand { get; set; }
        public List<HistoryLineItemDto> LineItems { get; set; } = new();
    }

    public class HistoryLineItemDto
    {
        public string PartName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total => Quantity * UnitPrice;
    }
}
