import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { currentUser, logout } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">
          Welcome, {currentUser?.email}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}
