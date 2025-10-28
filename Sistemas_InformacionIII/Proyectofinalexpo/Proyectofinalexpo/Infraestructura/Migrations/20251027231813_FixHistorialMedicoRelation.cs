using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class FixHistorialMedicoRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistorialMedico_Turnos_TurnoId",
                table: "HistorialMedico");

            migrationBuilder.AddColumn<Guid>(
                name: "TurnosId",
                table: "HistorialMedico",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HistorialMedico_TurnosId",
                table: "HistorialMedico",
                column: "TurnosId");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialMedico_Turnos_TurnoId",
                table: "HistorialMedico",
                column: "TurnoId",
                principalTable: "Turnos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialMedico_Turnos_TurnosId",
                table: "HistorialMedico",
                column: "TurnosId",
                principalTable: "Turnos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistorialMedico_Turnos_TurnoId",
                table: "HistorialMedico");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialMedico_Turnos_TurnosId",
                table: "HistorialMedico");

            migrationBuilder.DropIndex(
                name: "IX_HistorialMedico_TurnosId",
                table: "HistorialMedico");

            migrationBuilder.DropColumn(
                name: "TurnosId",
                table: "HistorialMedico");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialMedico_Turnos_TurnoId",
                table: "HistorialMedico",
                column: "TurnoId",
                principalTable: "Turnos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
