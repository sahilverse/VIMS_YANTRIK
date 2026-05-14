using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CustomersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [Authorize(Roles = "Admin, Staff")]
        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            var (items, totalCount) = await _unitOfWork.Customers.GetPagedCustomersAsync(pageNumber, pageSize, search);

            var dtos = items.Select(c => new CustomerDto
            {
                Id = c.Id,
                CustomerCode = c.CustomerCode,
                FullName = c.FullName,
                Phone = c.Phone,
                Address = c.Address,
                LoyaltyPoints = c.LoyaltyPoints,
                TotalSpend = c.TotalSpend,
                Email = c.User?.Email,
                Vehicles = c.Vehicles.Select(v => new VehicleDto
                {
                    Id = v.Id,
                    PlateNumber = v.PlateNumber,
                    Brand = v.Brand,
                    Model = v.Model,
                    Year = v.Year,
                    VIN = v.VIN
                }).ToList()
            });

            var response = new Yantrik.Common.PagedResponse<CustomerDto>(dtos, totalCount, pageNumber, pageSize);
            return Ok(response);
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(Guid id)
        {
            var customer = await _unitOfWork.Customers.GetCustomerWithDetailsAsync(id);
            if (customer == null) return NotFound();

            var dto = new CustomerDto
            {
                Id = customer.Id,
                CustomerCode = customer.CustomerCode,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Address = customer.Address,
                LoyaltyPoints = customer.LoyaltyPoints,
                TotalSpend = customer.TotalSpend,
                Email = customer.User?.Email,
                Vehicles = customer.Vehicles.Select(v => new VehicleDto
                {
                    Id = v.Id,
                    PlateNumber = v.PlateNumber,
                    Brand = v.Brand,
                    Model = v.Model,
                    Year = v.Year,
                    VIN = v.VIN
                }).ToList(),
                SalesHistory = customer.Invoices
                    .Where(i => i.Type == InvoiceType.Sale)
                    .OrderByDescending(i => i.Date)
                    .Select(i => new SaleInvoiceDto
                    {
                        Id = i.Id,
                        InvoiceNumber = i.InvoiceNumber,
                        CustomerId = i.CustomerId ?? Guid.Empty,
                        CustomerName = customer.FullName,
                        EmployeeId = i.EmployeeId,
                        EmployeeName = i.Employee?.FullName ?? "Unknown",
                        Date = i.Date,
                        TotalAmount = i.TotalAmount,
                        PaymentStatus = i.PaymentStatus,
                        ItemCount = i.Items.Count
                    }).ToList(),
                Appointments = customer.Appointments
                    .Where(a => a.Status != AppointmentStatus.Cancelled)
                    .OrderByDescending(a => a.AppointmentDate)
                    .Select(a => new AppointmentDto
                    {
                        Id = a.Id,
                        VehicleId = a.VehicleId,
                        PlateNumber = a.Vehicle?.PlateNumber ?? "N/A",
                        VehicleName = $"{a.Vehicle?.Brand} {a.Vehicle?.Model}".Trim(),
                        ServiceType = a.ServiceType,
                        AppointmentDate = a.AppointmentDate,
                        Status = a.Status.ToString()
                    }).ToList()
            };

            return Ok(dto);
        }
    }
}

