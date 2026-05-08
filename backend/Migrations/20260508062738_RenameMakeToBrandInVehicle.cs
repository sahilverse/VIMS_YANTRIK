using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yantrik.Migrations
{
    /// <inheritdoc />
    public partial class RenameMakeToBrandInVehicle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Make",
                table: "Vehicles",
                newName: "Brand");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Brand",
                table: "Vehicles",
                newName: "Make");
        }
    }
}
