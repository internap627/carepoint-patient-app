import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { getAuth } from "firebase/auth";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* Welcome Message */}
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
          {user
            ? `Welcome back, ${user.displayName || user.email || "Patient"}!`
            : "Welcome to CarePoint"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Select a medical specialty to find the right doctor for you.
        </Typography>
      </Box>

      {/* Categories Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: 600,
          color: "#004d40",
          mb: 3,
        }}
      >
        Medical Specialties
      </Typography>

      {/* Categories Grid */}
      <Grid container spacing={3} justifyContent="center">
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card
              onClick={() => navigate(`/doctors/${cat.id}`)}
              sx={{
                cursor: "pointer",
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
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent
                sx={{
                  textAlign: "center",
                  backgroundColor: "#fff",
                  p: 2.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#00695c",
                  }}
                >
                  {cat.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

