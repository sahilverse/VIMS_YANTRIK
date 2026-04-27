using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface ISequenceService
    {
        Task<string> GetNextCodeAsync(SequenceType type);
    }
}
