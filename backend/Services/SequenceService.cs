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
                // Initialize default sequences if they don't exist
                sequence = type switch
                {
                    SequenceType.Customer => new Sequence { Type = SequenceType.Customer, LastNumber = 5000 },
                    SequenceType.Staff => new Sequence { Type = SequenceType.Staff, LastNumber = 2600 },
                    SequenceType.Invoice => new Sequence { Type = SequenceType.Invoice, LastNumber = 20000 },
                    _ => new Sequence { Type = type, LastNumber = 1 }
                };
                _context.Sequences.Add(sequence);
            }

            sequence.LastNumber++;
            await _context.SaveChangesAsync();

            return sequence.LastNumber.ToString();
        }
    }
}
