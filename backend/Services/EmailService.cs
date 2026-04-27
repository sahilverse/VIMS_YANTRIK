using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;
using System.Threading.Tasks;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var host = _config["EmailSettings:Host"]!;
            var port = int.Parse(_config["EmailSettings:Port"]!);
            var username = _config["EmailSettings:Username"]!;
            var password = _config["EmailSettings:Password"]!;
            var fromEmail = _config["EmailSettings:FromEmail"]!;
            var fromName = _config["EmailSettings:FromName"]!;

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(fromName, fromEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = body };

            try
            {
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(username, password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                
                _logger.LogInformation("Email successfully sent to {To}", to);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To}", to);
                throw;
            }
        }

        public async Task SendWelcomeEmailAsync(string to, string fullName, string temporaryPassword)
        {
            var subject = "Welcome to Yantrik VIMS - Your Account is Ready";
            var body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;'>
                    <h2 style='color: #2c3e50;'>Welcome to VIMS, {fullName}!</h2>
                    <p>Your account has been created by our management team.</p>
                    <div style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 5px solid #3498db;'>
                        <p style='margin: 0;'><strong>Email/Username:</strong> {to}</p>
                        <p style='margin: 5px 0 0 0;'><strong>Temporary Password:</strong> <span style='color: #e74c3c;'>{temporaryPassword}</span></p>
                    </div>
                    <p style='margin-top: 20px;'>For security reasons, you will be required to change your password upon your first login.</p>
                    <p><a href='http://localhost:3000' style='display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Login to Dashboard</a></p>
                    <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                    <p style='font-size: 0.8em; color: #7f8c8d;'>This is an automated message. Please do not reply to this email.</p>
                </div>
            ";

            await SendEmailAsync(to, subject, body);
        }
    }
}
