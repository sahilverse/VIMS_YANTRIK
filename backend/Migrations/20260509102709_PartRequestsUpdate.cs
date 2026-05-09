using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yantrik.Migrations
{
    /// <inheritdoc />
    public partial class PartRequestsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PartName",
                table: "PartRequests");

            migrationBuilder.AddColumn<Guid>(
                name: "AppointmentId",
                table: "Reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PartId",
                table: "PartRequests",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PartRequests_PartId",
                table: "PartRequests",
                column: "PartId");

            migrationBuilder.AddForeignKey(
                name: "FK_PartRequests_Parts_PartId",
                table: "PartRequests",
                column: "PartId",
                principalTable: "Parts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PartRequests_Parts_PartId",
                table: "PartRequests");

            migrationBuilder.DropIndex(
                name: "IX_PartRequests_PartId",
                table: "PartRequests");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "PartId",
                table: "PartRequests");

            migrationBuilder.AddColumn<string>(
                name: "PartName",
                table: "PartRequests",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
