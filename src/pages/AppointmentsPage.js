import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Firestore query to get user’s bookings
    const q = query(collection(db, "bookings"), where("userId", "==", user.uid));

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#fafafa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 5,
          textAlign: "center",
          backgroundColor: "#f0f7f7",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#0a4b4f" }}>
          My Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Review your booked consultations below.
        </Typography>
      </Box>

      {/* Appointments Grid */}
      <Grid container spacing={3} justifyContent="center">
        {appointments.length > 0 ? (
          appointments.map((appt) => {
            const dateObj = appt.appointmentAt?.toDate
              ? appt.appointmentAt.toDate()
              : null;
            const formattedDate = dateObj
              ? dateObj.toLocaleDateString()
              : "Unknown date";
            const formattedTime = dateObj
              ? dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <Grid item xs={12} sm={6} md={4} key={appt.id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* Optional: doctor image placeholder */}
                  <CardContent
                    sx={{
                      textAlign: "center",
                      backgroundColor: "#fff",
                      p: 2.5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#00695c" }}
                    >
                      {appt.doctorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appt.specialty}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {formattedDate} at {formattedTime}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Fee: {appt.fee}
                    </Typography>
                    <Chip
                      label="Confirmed"
                      color="success"
                      sx={{ mt: 2, fontWeight: 500 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography
            variant="body1"
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            You have no appointments booked.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
