using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendWelcomeEmailAsync(string to, string fullName, string temporaryPassword);
        Task SendInvoiceEmailAsync(string to, string customerName, string invoiceNumber, decimal subTotal, decimal discount, decimal total, string date, List<SaleItemDto> items);
    }
}



