import React, { useState, useEffect } from 'react';
import { Typography, Box, MenuItem, FormControl, Select, InputLabel, CircularProgress } from '@mui/material';
import ActiveUsersReport from './ActiveUsersReport';
import UsersByRoleReport from './UsersByRoleReport';
import UsersWithoutRolesReport from './UsersWithoutRolesReport';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
    setReportData(null); // Limpiar datos previos al cambiar el reporte
    setError(null); // Limpiar errores previos
  };

  useEffect(() => {
    if (!selectedReport) return;

    setLoading(true);
    setError(null);

    fetch(`/api/reports/reports?report_type=${selectedReport}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener el reporte');
        }
        return response.json();
      })
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedReport]);

  // Mapa de componentes de renderizado
  const reportRenderers = {
    active_users: ActiveUsersReport,
    users_by_rol: UsersByRoleReport,
    users_without_rol: UsersWithoutRolesReport,
  };

  const ReportComponent = reportRenderers[selectedReport];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>
      <Typography variant="body1" gutterBottom>
        Selecciona un tipo de reporte:
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="report-select-label">Tipo de Reporte</InputLabel>
          <Select
            labelId="report-select-label"
            value={selectedReport}
            onChange={handleReportChange}
            label="Tipo de Reporte"
          >
            <MenuItem value="active_users">Usuarios Activos vs Inactivos</MenuItem>
            <MenuItem value="users_by_rol">Usuarios por Rol</MenuItem>
            <MenuItem value="users_without_rol">Usuarios sin Roles Asignados</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
      {reportData && ReportComponent && <ReportComponent data={reportData} />}
    </Box>
  );
}