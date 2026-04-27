using System.Threading.Tasks;

namespace Yantrik.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendWelcomeEmailAsync(string to, string fullName, string temporaryPassword);
    }
}
