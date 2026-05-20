using backend.Data;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services;

/// <summary>
/// Background service to send automated reminders for unpaid credits
/// </summary>
public class CreditReminderService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<CreditReminderService> _logger;

    public CreditReminderService(
        ApplicationDbContext context,
        IEmailService emailService,
        ILogger<CreditReminderService> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Send credit reminders to customers with unpaid invoices older than specified days
    /// </summary>
    public async Task SendCreditReminders(int daysOverdue = 30)
    {
        try
        {
            _logger.LogInformation($"Starting credit reminder process for invoices overdue > {daysOverdue} days");

            // Get all unpaid invoices older than daysOverdue
            var cutoffDate = DateTime.UtcNow.AddDays(-daysOverdue);

            var overdueInvoices = await _context.SaleInvoices
                .Include(si => si.Customer)
                    .ThenInclude(c => c.User)
                .Where(si =>
                    si.PaymentStatus == PaymentStatus.Pending &&
                    si.CreatedAt < cutoffDate)
                .GroupBy(si => si.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    CustomerName = g.First().Customer.User.Name,
                    CustomerEmail = g.First().Customer.User.Email,
                    InvoiceCount = g.Count(),
                    TotalAmount = g.Sum(si => si.FinalAmount),
                    OldestInvoiceDate = g.Min(si => si.CreatedAt),
                    Invoices = g.Select(si => new
                    {
                        si.Id,
                        si.FinalAmount,
                        si.CreatedAt
                    }).ToList()
                })
                .ToListAsync();

            _logger.LogInformation($"Found {overdueInvoices.Count} customers with overdue credits");

            // Send reminder emails
            int successCount = 0;
            int failureCount = 0;

            foreach (var customer in overdueInvoices)
            {
                try
                {
                    await SendReminderEmail(customer.CustomerEmail, customer.CustomerName, customer.InvoiceCount, customer.TotalAmount, customer.OldestInvoiceDate);
                    successCount++;
                    _logger.LogInformation($"Reminder email sent to {customer.CustomerEmail}");
                }
                catch (Exception ex)
                {
                    failureCount++;
                    _logger.LogError($"Failed to send reminder to {customer.CustomerEmail}: {ex.Message}");
                }
            }

            _logger.LogInformation($"Credit reminder batch completed. Success: {successCount}, Failed: {failureCount}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error in credit reminder service: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Send a single reminder email for unpaid credit
    /// </summary>
    private async Task SendReminderEmail(string email, string customerName, int invoiceCount, decimal totalAmount, DateTime oldestInvoiceDate)
    {
        var subject = $"Payment Reminder: Outstanding Invoice from PartFlow";
        var daysOverdue = (DateTime.UtcNow - oldestInvoiceDate).Days;

        var body = GenerateReminderEmailBody(customerName, invoiceCount, totalAmount, daysOverdue, oldestInvoiceDate);

        await _emailService.SendEmailAsync(email, subject, body);
    }

    /// <summary>
    /// Generate HTML body for reminder email
    /// </summary>
    private string GenerateReminderEmailBody(string customerName, int invoiceCount, decimal totalAmount, int daysOverdue, DateTime oldestDate)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd; border-top: none; }}
        .alert {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }}
        .details {{ background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }}
        .details p {{ margin: 8px 0; }}
        .highlight {{ color: #667eea; font-weight: bold; font-size: 18px; }}
        .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
        .footer {{ font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; }}
        .status-warning {{ background: #ffe6e6; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px; color: #721c24; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>💳 Payment Reminder Notice</h1>
        </div>

        <div class='content'>
            <p>Dear <strong>{customerName}</strong>,</p>

            <p>We hope you're doing well! This is a friendly reminder that you have an outstanding payment with PartFlow.</p>

            <div class='status-warning'>
                <strong>⚠️ Action Required:</strong>
                <p>Your invoice has been outstanding for <strong>{daysOverdue} days</strong> as of {oldestDate:MMMM dd, yyyy}.</p>
            </div>

            <div class='details'>
                <h3 style='margin-top: 0; color: #667eea;'>Outstanding Balance Summary</h3>
                <p><strong>Number of Invoices:</strong> {invoiceCount}</p>
                <p><strong>Total Amount Due:</strong> <span class='highlight'>Rs. {totalAmount:N2}</span></p>
                <p><strong>Oldest Invoice Date:</strong> {oldestDate:MMMM dd, yyyy}</p>
                <p><strong>Days Overdue:</strong> {daysOverdue} days</p>
            </div>

            <div class='alert'>
                <strong>Please note:</strong> Outstanding credits may affect your ability to book future services or make purchases. We would appreciate your prompt payment to avoid any service interruptions.
            </div>

            <h3 style='color: #667eea;'>What You Can Do:</h3>
            <ul>
                <li>Review your invoices in the PartFlow portal</li>
                <li>Process your payment immediately</li>
                <li>Contact us if you have questions or need to arrange a payment plan</li>
            </ul>

            <p><strong>Payment Methods Accepted:</strong></p>
            <ul>
                <li>Bank Transfer</li>
                <li>Direct Deposit</li>
                <li>Credit/Debit Card (in person)</li>
                <li>Check</li>
            </ul>

            <p style='margin-top: 30px;'>If you have already made this payment, please disregard this reminder. Thank you for your prompt attention to this matter.</p>

            <a href='https://partflow.com/dashboard' class='button'>View Your Account →</a>

            <div class='footer'>
                <p>PartFlow - Your Trusted Auto Parts & Service Partner</p>
                <p>This is an automated reminder. Please do not reply to this email.</p>
                <p>If you need assistance, please contact our support team: support@partflow.com or call +977-1-XXXX-XXXX</p>
            </div>
        </div>
    </div>
</body>
</html>";
    }
}
