using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yantrik.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsPaidFromInvoices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPaid",
                table: "Invoices");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPaid",
                table: "Invoices",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
