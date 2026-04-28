using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class SequenceService : ISequenceService
    {
        private readonly AppDbContext _context;

        public SequenceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> GetNextCodeAsync(SequenceType type)
        {
            var sequence = await _context.Sequences.FirstOrDefaultAsync(s => s.Type == type);
            
            if (sequence == null)
            {
                sequence = new Sequence { Type = type, LastNumber = GetInitialDefault(type) };
                _context.Sequences.Add(sequence);
            }

            int actualMax = await GetMaxFromDbAsync(type);
            if (sequence.LastNumber < actualMax)
            {
                sequence.LastNumber = actualMax;
            }

            sequence.LastNumber++;
            await _context.SaveChangesAsync();

            return GetPrefix(type) + sequence.LastNumber.ToString();
        }

        private string GetPrefix(SequenceType type)
        {
            return type switch
            {
                SequenceType.Customer => "CUST-",
                SequenceType.Employee => "EMP-",
                SequenceType.SalesInvoice => "SINV-",
                SequenceType.PurchaseInvoice => "PINV-",
                _ => ""
            };
        }

        private int GetInitialDefault(SequenceType type)
        {
            return type switch
            {
                SequenceType.Customer => 5000,
                SequenceType.Employee => 1000,
                SequenceType.SalesInvoice => 20000,
                SequenceType.PurchaseInvoice => 30000,
                _ => 1
            };
        }

        private async Task<int> GetMaxFromDbAsync(SequenceType type)
        {
            try
            {
                var codes = type switch
                {
                    SequenceType.Employee => await _context.Employees.Select(s => (string?)s.EmployeeCode).ToListAsync(),
                    SequenceType.Customer => await _context.Customers.Select(c => (string?)c.CustomerCode).ToListAsync(),
                    SequenceType.SalesInvoice => await _context.Invoices.Where(i => i.Type == InvoiceType.Sale).Select(i => (string?)i.InvoiceNumber).ToListAsync(),
                    SequenceType.PurchaseInvoice => await _context.Invoices.Where(i => i.Type == InvoiceType.Purchase).Select(i => (string?)i.InvoiceNumber).ToListAsync(),
                    _ => new List<string?>()
                };

                if (codes == null || codes.Count == 0) return GetInitialDefault(type);

                string prefix = GetPrefix(type);
                return codes
                    .Where(c => !string.IsNullOrEmpty(c))
                    .Select(c => 
                    {
                        var numericPart = c!.Replace(prefix, "");
                        return int.TryParse(numericPart, out int val) ? val : 0;
                    })
                    .DefaultIfEmpty(GetInitialDefault(type))
                    .Max();
            }
            catch
            {
                return GetInitialDefault(type);
            }
        }
    }
}



