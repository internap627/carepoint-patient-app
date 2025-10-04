import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left: Logo */}
        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          CarePoint
        </Typography>

        {/* Center: Welcome / Navigation */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {!currentUser ? (
            <Typography variant="h6">Welcome to CarePoint</Typography>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/categories")}>
                Browse Doctors
              </Button>
              <Button color="inherit" onClick={() => navigate("/appointments")}>
                My Appointments
              </Button>
              <Button color="inherit" onClick={() => navigate("/billing")}>
                Billing
              </Button>
            </>
          )}
        </Box>

        {/* Right: Logout */}
        {currentUser && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
