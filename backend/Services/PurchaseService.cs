using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISequenceService _sequenceService;

        public PurchaseService(IUnitOfWork unitOfWork, ISequenceService sequenceService)
        {
            _unitOfWork = unitOfWork;
            _sequenceService = sequenceService;
        }

        public async Task<ApiResponse<PagedResponse<PurchaseInvoiceDto>>> GetPagedPurchasesAsync(InvoiceQueryParams @params)
        {
            var (invoices, totalCount) = await _unitOfWork.Invoices.GetPagedInvoicesAsync(
                @params.PageNumber, 
                @params.PageSize, 
                @params.Search, 
                InvoiceType.Purchase,
                @params.StartDate,
                @params.EndDate,
                @params.Status);

            var dtos = invoices.Select(i => new PurchaseInvoiceDto
            {
                Id = i.Id,
                InvoiceNumber = i.InvoiceNumber,
                VendorId = i.VendorId ?? Guid.Empty,
                VendorName = i.Vendor?.CompanyName ?? "Unknown",
                EmployeeId = i.EmployeeId,
                EmployeeName = i.Employee?.FullName ?? "Unknown",
                Date = i.Date,
                TotalAmount = i.TotalAmount,
                PaymentStatus = i.PaymentStatus,
                ItemCount = i.Items.Count
            });

            var response = new PagedResponse<PurchaseInvoiceDto>(dtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<PurchaseInvoiceDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<PurchaseInvoiceDto>> GetPurchaseByIdAsync(Guid id)
        {
            var invoice = await _unitOfWork.Invoices.GetByIdWithItemsAsync(id);
            if (invoice == null || invoice.Type != InvoiceType.Purchase)
                return ApiResponse<PurchaseInvoiceDto>.FailureResponse("Purchase invoice not found");

            var dto = new PurchaseInvoiceDto
            {
                Id = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                VendorId = invoice.VendorId ?? Guid.Empty,
                VendorName = invoice.Vendor?.CompanyName ?? "Unknown",
                EmployeeId = invoice.EmployeeId,
                EmployeeName = invoice.Employee?.FullName ?? "Unknown",
                Date = invoice.Date,
                TotalAmount = invoice.TotalAmount,
                PaymentStatus = invoice.PaymentStatus,
                Items = invoice.Items.Select(it => new PurchaseItemDto
                {
                    PartId = it.PartId,
                    PartName = it.Part?.Name ?? "Unknown",
                    SKU = it.Part?.SKU ?? "N/A",
                    Quantity = it.Quantity,
                    UnitPrice = it.UnitPrice
                }).ToList()
            };

            return ApiResponse<PurchaseInvoiceDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<PurchaseInvoiceDto>> CreatePurchaseAsync(Guid userId, CreatePurchaseRequest request)
        {
            var user = await _unitOfWork.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            var employee = await _unitOfWork.Employees.Find(s => s.UserId == userId).FirstOrDefaultAsync();
            
            if (employee == null)
                return ApiResponse<PurchaseInvoiceDto>.FailureResponse("Only Employees can create purchases");

            var invoiceNumber = await _sequenceService.GetNextCodeAsync(SequenceType.PurchaseInvoice);

            var invoice = new Invoice
            {
                InvoiceNumber = invoiceNumber,
                Type = InvoiceType.Purchase,
                VendorId = request.VendorId,
                EmployeeId = employee.Id,
                Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc),
                PaymentStatus = request.PaymentStatus,
                Items = new List<InvoiceItem>()
            };

            decimal totalAmount = 0;

            foreach (var itemRequest in request.Items)
            {
                var part = await _unitOfWork.Parts.GetByIdAsync(itemRequest.PartId);
                if (part == null) return ApiResponse<PurchaseInvoiceDto>.FailureResponse($"Part with ID {itemRequest.PartId} not found");

                // Update Stock
                part.StockQuantity += itemRequest.Quantity;
                _unitOfWork.Parts.Update(part);

                var invoiceItem = new InvoiceItem
                {
                    PartId = itemRequest.PartId,
                    Quantity = itemRequest.Quantity,
                    UnitPrice = itemRequest.UnitPrice
                };

                invoice.Items.Add(invoiceItem);
                totalAmount += (itemRequest.Quantity * itemRequest.UnitPrice);

                // Create Stock Movement 
                var stockMovement = new StockMovement
                {
                    PartId = itemRequest.PartId,
                    Type = MovementType.Purchase,
                    Quantity = itemRequest.Quantity,
                    UnitCost = itemRequest.UnitPrice,
                    ReferenceType = ReferenceType.Invoice,
                    ReferenceId = invoice.Id,
                    CreatedBy = employee.Id
                };
                await _unitOfWork.StockMovements.AddAsync(stockMovement);
            }

            invoice.TotalAmount = totalAmount;
            invoice.SubTotal = totalAmount;
            invoice.IsPaid = invoice.PaymentStatus == PaymentStatus.Paid;

            await _unitOfWork.Invoices.AddAsync(invoice);
            await _unitOfWork.CompleteAsync();

            return await GetPurchaseByIdAsync(invoice.Id);
        }
        public async Task<ApiResponse<PurchaseInvoiceDto>> UpdatePurchaseStatusAsync(Guid id, PaymentStatus status)
        {
            var invoice = await _unitOfWork.Invoices.GetByIdAsync(id);
            if (invoice == null || invoice.Type != InvoiceType.Purchase)
                return ApiResponse<PurchaseInvoiceDto>.FailureResponse("Purchase invoice not found");

            invoice.PaymentStatus = status;
            invoice.IsPaid = status == PaymentStatus.Paid;
            
            _unitOfWork.Invoices.Update(invoice);
            await _unitOfWork.CompleteAsync();

            return await GetPurchaseByIdAsync(id);
        }
    }
}



