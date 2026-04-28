using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;
using Yantrik.Interfaces.Services;

namespace Yantrik.Services
{
    public class SalesService : ISalesService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISequenceService _sequenceService;

        public SalesService(IUnitOfWork unitOfWork, ISequenceService sequenceService)
        {
            _unitOfWork = unitOfWork;
            _sequenceService = sequenceService;
        }

        public async Task<ApiResponse<PagedResponse<SaleInvoiceDto>>> GetPagedSalesAsync(InvoiceQueryParams @params)
        {
            var (invoices, totalCount) = await _unitOfWork.Invoices.GetPagedInvoicesAsync(
                @params.PageNumber, 
                @params.PageSize, 
                @params.Search, 
                InvoiceType.Sale,
                @params.StartDate,
                @params.EndDate,
                @params.Status);

            var dtos = invoices.Select(i => new SaleInvoiceDto
            {
                Id = i.Id,
                InvoiceNumber = i.InvoiceNumber,
                CustomerId = i.CustomerId ?? Guid.Empty,
                CustomerName = i.Customer?.FullName ?? "Unknown",
                EmployeeId = i.EmployeeId,
                EmployeeName = i.Employee?.FullName ?? "Unknown",
                Date = i.Date,
                TotalAmount = i.TotalAmount,
                PaymentStatus = i.PaymentStatus,
                ItemCount = i.Items.Count
            });

            var response = new PagedResponse<SaleInvoiceDto>(dtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<SaleInvoiceDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<SaleInvoiceDto>> GetSaleByIdAsync(Guid id)
        {
            var invoice = await _unitOfWork.Invoices.GetByIdWithItemsAsync(id);
            if (invoice == null || invoice.Type != InvoiceType.Sale)
                return ApiResponse<SaleInvoiceDto>.FailureResponse("Sale invoice not found");

            var dto = new SaleInvoiceDto
            {
                Id = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                CustomerId = invoice.CustomerId ?? Guid.Empty,
                CustomerName = invoice.Customer?.FullName ?? "Unknown",
                EmployeeId = invoice.EmployeeId,
                EmployeeName = invoice.Employee?.FullName ?? "Unknown",
                Date = invoice.Date,
                TotalAmount = invoice.TotalAmount,
                PaymentStatus = invoice.PaymentStatus,
                Items = invoice.Items.Select(item => new SaleItemDto
                {
                    PartId = item.PartId,
                    PartName = item.Part?.Name ?? "Unknown",
                    SKU = item.Part?.SKU ?? "N/A",
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                }).ToList()
            };

            return ApiResponse<SaleInvoiceDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<SaleInvoiceDto>> CreateSaleAsync(Guid staffUserId, CreateSaleRequest request)
        {
            var employee = await _unitOfWork.Employees.Find(e => e.UserId == staffUserId).FirstOrDefaultAsync();
            if (employee == null)
                return ApiResponse<SaleInvoiceDto>.FailureResponse("Only employees/staff can create sales");

            var customer = await _unitOfWork.Customers.GetByIdAsync(request.CustomerId);
            if (customer == null)
                return ApiResponse<SaleInvoiceDto>.FailureResponse("Customer not found");

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var invoiceNumber = await _sequenceService.GetNextCodeAsync(SequenceType.SalesInvoice);

                var invoice = new Invoice
                {
                    InvoiceNumber = invoiceNumber,
                    Type = InvoiceType.Sale,
                    CustomerId = request.CustomerId,
                    EmployeeId = employee.Id,
                    Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc),
                    PaymentStatus = request.PaymentStatus,
                    Items = new List<InvoiceItem>()
                };

                decimal totalAmount = 0;

                foreach (var itemRequest in request.Items)
                {
                    var part = await _unitOfWork.Parts.GetByIdAsync(itemRequest.PartId);
                    if (part == null)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        return ApiResponse<SaleInvoiceDto>.FailureResponse($"Part with ID {itemRequest.PartId} not found");
                    }

                    if (part.StockQuantity < itemRequest.Quantity)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        return ApiResponse<SaleInvoiceDto>.FailureResponse($"Insufficient stock for {part.Name}. Available: {part.StockQuantity}");
                    }

                    // Reduce Stock
                    part.StockQuantity -= itemRequest.Quantity;
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
                        Type = MovementType.Sale,
                        Quantity = itemRequest.Quantity,
                        UnitCost = part.CostPrice,
                        ReferenceType = ReferenceType.Invoice,
                        ReferenceId = invoice.Id,
                        CreatedBy = employee.Id
                    };
                    await _unitOfWork.StockMovements.AddAsync(stockMovement);
                }

                invoice.TotalAmount = totalAmount;
                invoice.SubTotal = totalAmount;

                await _unitOfWork.Invoices.AddAsync(invoice);
                
                // Update Customer Total Spend
                customer.TotalSpend += totalAmount;
                _unitOfWork.Customers.Update(customer);

                await _unitOfWork.CompleteAsync();
                await _unitOfWork.CommitTransactionAsync();

                return await GetSaleByIdAsync(invoice.Id);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<SaleInvoiceDto>.FailureResponse($"Failed to create sale: {ex.Message}");
            }
        }

        public async Task<ApiResponse<SaleInvoiceDto>> UpdateSaleStatusAsync(Guid id, PaymentStatus status)
        {
            var invoice = await _unitOfWork.Invoices.GetByIdAsync(id);
            if (invoice == null || invoice.Type != InvoiceType.Sale)
                return ApiResponse<SaleInvoiceDto>.FailureResponse("Sale invoice not found");

            invoice.PaymentStatus = status;
            
            _unitOfWork.Invoices.Update(invoice);
            await _unitOfWork.CompleteAsync();

            return await GetSaleByIdAsync(id);
        }
    }
}
