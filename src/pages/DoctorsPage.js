import React from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
} from "@mui/material";
import { doctors } from "../data/doctors";

export default function DoctorsPage() {
  const { category } = useParams();

  const filteredDoctors = doctors.filter(
    (doc) => doc.specialty === category
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Doctors in {category.charAt(0).toUpperCase() + category.slice(1)}
      </Typography>

      <Grid container spacing={3}>
        {filteredDoctors.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="150"
                image={doc.image}
                alt={doc.name}
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
                  sx={{ mt: 2 }}
                  onClick={() => alert("Booking successful!")}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
