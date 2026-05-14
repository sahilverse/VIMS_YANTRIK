using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.DTOs;
using Yantrik.Interfaces.Services;

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

        public async Task SendInvoiceEmailAsync(string to, string customerName, string invoiceNumber, decimal subTotal, decimal discount, decimal total, string date, List<SaleItemDto> items)
        {
            var itemsHtml = string.Join("", items.Select(item => $@"
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>
                        <div style='font-size: 14px; font-weight: 700; color: #111;'>{item.PartName}</div>
                        <div style='font-size: 11px; color: #999; text-transform: uppercase;'>SKU: {item.SKU}</div>
                    </td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; text-align: center; font-size: 14px; color: #555;'>{item.Quantity}</td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; font-weight: 700; color: #111;'>Rs. {item.Total.ToString("N2")}</td>
                </tr>
            "));

            var discountRow = discount > 0 ? $@"
                <tr>
                    <td colspan='2' style='padding-top: 10px; font-size: 13px; font-weight: 600; color: #27ae60;'>Loyalty Discount (10%)</td>
                    <td style='padding-top: 10px; text-align: right; font-size: 13px; font-weight: 600; color: #27ae60;'>- Rs. {discount.ToString("N2")}</td>
                </tr>" : "";

            var subject = $"Invoice {invoiceNumber} from Yantrik VIMS";
            var body = $@"
                <div style='font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
                    <div style='background-color: #000; padding: 30px; text-align: center; color: #fff;'>
                        <h1 style='margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em;'>YANTRIK VIMS</h1>
                        <p style='margin: 5px 0 0 0; font-size: 12px; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em;'>Invoice Confirmation</p>
                    </div>
                    <div style='padding: 40px;'>
                        <h2 style='margin: 0 0 20px 0; font-size: 20px; font-weight: 800; color: #111;'>Hello {customerName},</h2>
                        <p style='margin: 0 0 30px 0; font-size: 15px; color: #555; line-height: 1.6;'>Thank you for choosing Yantrik VIMS. Your service invoice is now ready for review. Please find the transaction summary below.</p>
                        
                        <div style='background-color: #f8f9fa; border-radius: 12px; padding: 25px; border: 1px solid #eee; margin-bottom: 30px;'>
                            <table style='width: 100%; border-collapse: collapse;'>
                                <tr>
                                    <td style='padding-bottom: 10px; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.05em;'>Invoice Number</td>
                                    <td style='padding-bottom: 10px; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;'>Date</td>
                                </tr>
                                <tr>
                                    <td style='font-size: 16px; font-weight: 700; color: #111;'>{invoiceNumber}</td>
                                    <td style='font-size: 16px; font-weight: 700; color: #111; text-align: right;'>{date}</td>
                                </tr>
                            </table>
                        </div>

                        <div style='margin-bottom: 30px;'>
                            <h3 style='font-size: 12px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 8px; display: inline-block;'>Itemized Summary</h3>
                            <table style='width: 100%; border-collapse: collapse;'>
                                <thead>
                                    <tr>
                                        <th style='text-align: left; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; padding-bottom: 10px;'>Description</th>
                                        <th style='text-align: center; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; padding-bottom: 10px;'>Qty</th>
                                        <th style='text-align: right; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; padding-bottom: 10px;'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan='2' style='padding-top: 20px; font-size: 13px; font-weight: 600; color: #777;'>Subtotal</td>
                                        <td style='padding-top: 20px; text-align: right; font-size: 13px; font-weight: 600; color: #777;'>Rs. {subTotal.ToString("N2")}</td>
                                    </tr>
                                    {discountRow}
                                    <tr>
                                        <td colspan='2' style='padding-top: 10px; font-size: 14px; font-weight: 700; color: #111;'>Total Amount</td>
                                        <td style='padding-top: 10px; text-align: right; font-size: 20px; font-weight: 900; color: #000;'>Rs. {total.ToString("N2")}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <div style='margin-top: 40px; text-align: center;'>
                            <p style='margin-bottom: 20px; font-size: 13px; color: #777;'>Need help with this invoice? Contact our support team.</p>
                            <a href='http://localhost:3000' style='display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>View Full Dashboard</a>
                        </div>
                    </div>
                    <div style='background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;'>
                        <p style='margin: 0; font-size: 11px; color: #aaa; font-weight: 600;'>&copy; 2026 Yantrik VIMS. All rights reserved.</p>
                    </div>
                </div>
            ";

            await SendEmailAsync(to, subject, body);
        }
        public async Task SendOverdueReminderEmailAsync(string to, string customerName, string invoiceNumber, decimal totalAmount, string dueDate)
        {
            var subject = $"Payment Reminder: Invoice {invoiceNumber} is Overdue";
            var body = $@"
                <div style='font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
                    <div style='background-color: #000; padding: 30px; text-align: center; color: #fff;'>
                        <h1 style='margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em;'>YANTRIK VIMS</h1>
                        <p style='margin: 5px 0 0 0; font-size: 12px; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em;'>Payment Reminder</p>
                    </div>
                    <div style='padding: 40px;'>
                        <h2 style='margin: 0 0 20px 0; font-size: 20px; font-weight: 800; color: #111;'>Hello {customerName},</h2>
                        <p style='margin: 0 0 30px 0; font-size: 15px; color: #555; line-height: 1.6;'>This is a friendly reminder that invoice <strong>{invoiceNumber}</strong> is currently overdue. We would appreciate it if you could settle the outstanding balance at your earliest convenience.</p>
                        
                        <div style='background-color: #fff9f9; border-radius: 12px; padding: 25px; border: 1px solid #fee2e2; margin-bottom: 30px;'>
                            <table style='width: 100%; border-collapse: collapse;'>
                                <tr>
                                    <td style='padding-bottom: 10px; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.05em;'>Invoice Number</td>
                                    <td style='padding-bottom: 10px; font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;'>Due Date</td>
                                </tr>
                                <tr>
                                    <td style='font-size: 16px; font-weight: 700; color: #111;'>{invoiceNumber}</td>
                                    <td style='font-size: 16px; font-weight: 700; color: #b91c1c; text-align: right;'>{dueDate}</td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='padding-top: 20px; border-top: 1px solid #fee2e2; margin-top: 20px;'>
                                        <div style='font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;'>Amount Due</div>
                                        <div style='font-size: 24px; font-weight: 900; color: #000;'>Rs. {totalAmount.ToString("N2")}</div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style='margin-top: 40px; text-align: center;'>
                            <p style='margin-bottom: 20px; font-size: 13px; color: #777;'>You can view and pay your invoice through our online portal.</p>
                            <a href='http://localhost:3000' style='display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>Open Dashboard</a>
                        </div>
                    </div>
                    <div style='background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;'>
                        <p style='margin: 0; font-size: 11px; color: #aaa; font-weight: 600;'>&copy; 2026 Yantrik VIMS. All rights reserved.</p>
                    </div>
                </div>
            ";

            await SendEmailAsync(to, subject, body);
        }
    }
}
