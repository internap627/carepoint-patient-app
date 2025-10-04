import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medical Specialties
      </Typography>

      <Grid container spacing={3}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                transition: "0.3s",
              }}
              onClick={() => navigate(`/doctors/${cat.id}`)}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h2" component="div">
                  {cat.icon}
                </Typography>
                <Typography variant="h6">{cat.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
