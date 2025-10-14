import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { doctors } from "../data/doctors";
import { db } from "../firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00695c",
    },
  },
});

export default function DoctorsPage() {
  const { category } = useParams();
  const auth = getAuth();

  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const filteredDoctors = doctors.filter(
    (doc) => doc.specialty === category
  );

  const handleOpen = (doctor) => {
    setSelectedDoctor(doctor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBooking = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to book an appointment.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select a valid date and time.");
      return;
    }

    // Merge selected date and time into one timestamp
    const combinedDate = new Date(selectedDate);
    combinedDate.setHours(selectedTime.getHours());
    combinedDate.setMinutes(selectedTime.getMinutes());

    // Restrict to working hours (8am–4pm)
    const hour = selectedTime.getHours();
    if (hour < 8 || hour > 16) {
      alert("Please select a time between 8:00 AM and 4:00 PM.");
      return;
    }

    // Check for booking conflicts
    const q = query(
      collection(db, "bookings"),
      where("doctorId", "==", selectedDoctor.id)
    );

    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map(doc => doc.data());

    const newAppointmentStartTime = combinedDate.getTime();
    const newAppointmentEndTime = newAppointmentStartTime + 30 * 60000;

    const conflict = bookings.find(booking => {
      const existingAppointmentStartTime = booking.appointmentAt.toDate().getTime();
      const existingAppointmentEndTime = existingAppointmentStartTime + 30 * 60000;
      return newAppointmentStartTime < existingAppointmentEndTime && newAppointmentEndTime > existingAppointmentStartTime;
    });

    if (conflict) {
      alert("This time slot is already booked. Please choose another time.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userEmail: user.email,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        fee: selectedDoctor.fee,
        appointmentAt: Timestamp.fromDate(combinedDate),
        createdAt: Timestamp.now(),
      });
      alert("Booking successful!");
      handleClose();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Available Doctors in{" "}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Typography>

          <Grid container spacing={3}>
            {filteredDoctors.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    image={doc.image}
                    alt={doc.name}
                    sx={{
                      height: 180,
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{doc.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.experience} experience
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consultation Fee: {doc.fee}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "#00695c" }}
                      onClick={() => handleOpen(doc)}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Booking Modal */}
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                backgroundColor: "white",
                p: 4,
                borderRadius: 2,
                width: 400,
                mx: "auto",
                mt: "10%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Book Appointment with {selectedDoctor?.name}
              </Typography>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField fullWidth sx={{ mb: 2 }} {...params} />}
              />
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                renderInput={(params) => <TextField fullWidth sx={{ mb: 2 }} {...params} />}
              />
              <Button variant="contained" fullWidth onClick={handleBooking}>
                Confirm Booking
              </Button>
            </Box>
          </Modal>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}