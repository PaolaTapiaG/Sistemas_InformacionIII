using Domain.Interfaces;
using Dominio.Entities;

public class CrearHistorialMedico
{
    private readonly IHistorialMedicoRepositorio _historialMedicoRepositorio;
    private readonly ITurnoRepositorio _turnoRepositorio;

    public CrearHistorialMedico(IHistorialMedicoRepositorio historialMedicoRepositorio, ITurnoRepositorio turnoRepositorio)
    {
        _historialMedicoRepositorio = historialMedicoRepositorio;
        _turnoRepositorio = turnoRepositorio;
    }

    public async Task EjecutarAsync(Historial_Medico historialMedico)
    {
        // Validaciones de negocio
        ValidarHistorialMedico(historialMedico);

        // Validar que el turno exista (asumiendo que TurnoId es Guid)
        var turnoExiste = await _turnoRepositorio.ExisteTurnoAsync(historialMedico.TurnoId);
        if (!turnoExiste)
            throw new ArgumentException($"El turno con ID {historialMedico.TurnoId} no existe.");

        // Generar ID si no viene especificado
        if (historialMedico.Id == Guid.Empty)
        {
            historialMedico.Id = Guid.NewGuid();
        }

        await _historialMedicoRepositorio.CrearAsync(historialMedico);
    }

    private void ValidarHistorialMedico(Historial_Medico historialMedico)
    {
        if (historialMedico.TurnoId == Guid.Empty)
            throw new ArgumentException("El ID del turno es obligatorio");

        if (string.IsNullOrWhiteSpace(historialMedico.Diagnostico))
            throw new ArgumentException("El diagnóstico es obligatorio");

        if (string.IsNullOrWhiteSpace(historialMedico.Tratamiento))
            throw new ArgumentException("El tratamiento es obligatorio");

        // Validar longitud máxima de textos
        if (historialMedico.Diagnostico.Length > 1000)
            throw new ArgumentException("El diagnóstico no puede exceder los 1000 caracteres");

        if (historialMedico.Tratamiento.Length > 1000)
            throw new ArgumentException("El tratamiento no puede exceder los 1000 caracteres");

        if (!string.IsNullOrWhiteSpace(historialMedico.Alergias) && historialMedico.Alergias.Length > 500)
            throw new ArgumentException("Las alergias no pueden exceder los 500 caracteres");
    }
}