import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
} from "@mui/material";
import { appointments } from "../data/appointments";

export default function AppointmentsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>

      <Grid container spacing={3}>
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <Grid item xs={12} sm={6} md={4} key={appt.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{appt.doctor}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appt.specialty}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {appt.date} at {appt.time}
                  </Typography>
                  <Chip
                    label={appt.status}
                    color={appt.status === "Confirmed" ? "success" : "warning"}
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            You have no appointments booked.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
