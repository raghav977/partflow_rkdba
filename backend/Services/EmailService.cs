namespace backend.Services;

using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;

/// <summary>
/// Email service interface for sending emails
/// </summary>
public interface IEmailService
{
    Task SendInvoiceEmailAsync(string toEmail, string customerName, string invoiceId, decimal totalAmount);
    Task SendEmailAsync(string to, string subject, string body);
}

/// <summary>
/// Email service implementation using MailKit/MimeKit
/// </summary>
public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly EmailSettings _emailSettings;

    public EmailService(ILogger<EmailService> logger, IOptions<EmailSettings> emailSettings)
    {
        _logger = logger;
        _emailSettings = emailSettings.Value;
    }

    /// <summary>
    /// Send invoice email to customer
    /// </summary>
    public async Task SendInvoiceEmailAsync(string toEmail, string customerName, string invoiceId, decimal totalAmount)
    {
        try
        {
            var subject = $"Invoice #{invoiceId} from PartFlow";
            var body = GenerateInvoiceEmailBody(customerName, invoiceId, totalAmount);
            
            await SendEmailAsync(toEmail, subject, body);
            _logger.LogInformation($"Invoice email sent to {toEmail} for invoice {invoiceId}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to send invoice email to {toEmail}: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Send generic email using SMTP
    /// </summary>
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_emailSettings.Email));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = body };
            email.Body = builder.ToMessageBody();

            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailSettings.Email, _emailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }

            _logger.LogInformation($"Email sent successfully to {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error sending email to {to}: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Generate HTML invoice email body
    /// </summary>
    private string GenerateInvoiceEmailBody(string customerName, string invoiceId, decimal totalAmount)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }}
        .header h1 {{ margin: 0; color: #2c3e50; }}
        .content {{ margin-bottom: 20px; }}
        .footer {{ font-size: 12px; color: #666; margin-top: 30px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th {{ background-color: #f8f9fa; padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6; }}
        td {{ padding: 10px; border-bottom: 1px solid #dee2e6; }}
        .amount {{ text-align: right; font-weight: bold; }}
        .button {{ display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>PartFlow - Invoice Notification</h1>
        </div>
        
        <div class=""content"">
            <p>Dear {customerName},</p>
            
            <p>Your invoice has been created and is ready for viewing.</p>
            
            <table>
                <tr>
                    <th>Invoice Number</th>
                    <td>{invoiceId}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td class=""amount"">Rs. {totalAmount:F2}</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td>{DateTime.UtcNow:MMM dd, yyyy}</td>
                </tr>
            </table>
            
            <p>Please log in to your PartFlow account to view the complete invoice details and make payment if required.</p>
            
            <a href=""http://localhost:5173"" class=""button"">View Invoice</a>
        </div>
        
        <div class=""footer"">
            <p>This is an automated email. Please do not reply to this email. If you have any questions, please contact our support team.</p>
            <p>&copy; 2026 PartFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    }
}
