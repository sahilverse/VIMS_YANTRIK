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

            return sequence.LastNumber.ToString();
        }

        private int GetInitialDefault(SequenceType type)
        {
            return type switch
            {
                SequenceType.Customer => 5000,
                SequenceType.Staff => 1000,
                SequenceType.Invoice => 20000,
                _ => 1
            };
        }

        private async Task<int> GetMaxFromDbAsync(SequenceType type)
        {
            try
            {
                System.Collections.Generic.List<string> codes = type switch
                {
                    SequenceType.Staff => await _context.StaffProfiles.Select(s => s.EmployeeCode).ToListAsync(),
                    SequenceType.Customer => await _context.Customers.Select(c => c.CustomerCode).ToListAsync(),
                    SequenceType.Invoice => await _context.Invoices.Select(i => i.InvoiceNumber).ToListAsync(),
                    _ => new System.Collections.Generic.List<string>()
                };

                if (codes == null || codes.Count == 0) return GetInitialDefault(type);

                return codes
                    .Select(c => int.TryParse(c, out int val) ? val : 0)
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
