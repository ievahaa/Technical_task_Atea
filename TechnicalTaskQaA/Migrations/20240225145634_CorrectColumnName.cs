using Microsoft.EntityFrameworkCore.Migrations;

namespace TechnicalTaskQaA.Migrations
{
    public partial class CorrectColumnName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordeHash",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "PasswordeHash",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
