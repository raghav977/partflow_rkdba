using System;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

        
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers {get;set;}
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<Vendor> Vendors { get; set; }
    public DbSet<Part> Parts { get; set; }
    public DbSet<SaleInvoice> SaleInvoices { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<PartRequest> PartRequests { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

       modelBuilder.Entity<User>()
    .Property(u => u.Role)
    .HasConversion<string>()
    .HasMaxLength(20);


    modelBuilder.Entity<Customer>()
    .HasOne(c => c.User)
    .WithOne()
    .HasForeignKey<Customer>(c => c.UserId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<Customer>()
    .HasOne(c => c.CreatedByUser)
    .WithMany()
    .HasForeignKey(c => c.CreatedByUserId)
    .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Vehicle>()
    .Property(v => v.FuelType)
    .HasConversion<string>()
    .HasMaxLength(20);

 modelBuilder.Entity<Vehicle>()
    .HasIndex(v => v.VehicleNumber)
    .IsUnique();

modelBuilder.Entity<Vehicle>()
    .Property(v => v.Color)
    .HasConversion<string>()
    .HasMaxLength(20);
    modelBuilder.Entity<Vehicle>()
    .Property(v => v.Status)
    .HasConversion<string>()
    .HasMaxLength(20);

    modelBuilder.Entity<Vehicle>()
    .HasOne(v => v.Customer)
    .WithMany(c => c.Vehicles)
    .HasForeignKey(v => v.CustomerId)
    .OnDelete(DeleteBehavior.Cascade);

    // Vendor-Part relationship
    modelBuilder.Entity<Part>()
        .HasOne(p => p.Vendor)
        .WithMany(v => v.Parts)
        .HasForeignKey(p => p.VendorId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Vendor>()
        .HasIndex(v => v.Email)
        .IsUnique();

    modelBuilder.Entity<Part>()
        .HasIndex(p => p.Name)
        .IsUnique();

    // SaleInvoice relationships
    modelBuilder.Entity<SaleInvoice>()
        .HasOne(s => s.Customer)
        .WithMany(c => c.SaleInvoices)
        .HasForeignKey(s => s.CustomerId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<SaleInvoice>()
        .HasOne(s => s.Vehicle)
        .WithMany(v => v.SaleInvoices)
        .HasForeignKey(s => s.VehicleId)
        .OnDelete(DeleteBehavior.Restrict);

    // SaleItem relationships
    modelBuilder.Entity<SaleItem>()
        .HasOne(si => si.SaleInvoice)
        .WithMany(s => s.SaleItems)
        .HasForeignKey(si => si.SaleInvoiceId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<SaleItem>()
        .HasOne(si => si.Part)
        .WithMany()
        .HasForeignKey(si => si.PartId)
        .OnDelete(DeleteBehavior.Restrict);

    // Appointment relationships
    modelBuilder.Entity<Appointment>()
        .HasOne(a => a.Customer)
        .WithMany()
        .HasForeignKey(a => a.CustomerId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Appointment>()
        .HasOne(a => a.Vehicle)
        .WithMany()
        .HasForeignKey(a => a.VehicleId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Appointment>()
        .Property(a => a.Status)
        .HasConversion<string>()
        .HasMaxLength(20);

    // PartRequest relationships
    modelBuilder.Entity<PartRequest>()
        .HasOne(pr => pr.Customer)
        .WithMany()
        .HasForeignKey(pr => pr.CustomerId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<PartRequest>()
        .Property(pr => pr.Status)
        .HasConversion<string>()
        .HasMaxLength(20);

    // Review relationships
    modelBuilder.Entity<Review>()
        .HasOne(r => r.Customer)
        .WithMany()
        .HasForeignKey(r => r.CustomerId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}
