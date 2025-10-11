import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, useScrollTrigger } from "@mui/material";
import { LocalHospital } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Optional: subtle shadow on scroll
function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

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
    <ElevationScroll>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#00695c",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "3px solid #004d40",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* Left: Logo + App Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": { opacity: 0.9 },
            }}
            onClick={() => navigate("/")}
          >
            <LocalHospital sx={{ mr: 1, color: "#b2dfdb" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "#e0f2f1",
              }}
            >
              CarePoint
            </Typography>
          </Box>

          {/* Center: Navigation or Welcome */}
          {!currentUser ? (
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                color: "#e0f2f1",
                fontWeight: 500,
              }}
            >
              Welcome to CarePoint
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Button
                onClick={() => navigate("/categories")}
                sx={{
                  color: "#e0f2f1",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#004d40",
                  },
                }}
              >
                Browse Doctors
              </Button>
              <Button
                onClick={() => navigate("/appointments")}
                sx={{
                  color: "#e0f2f1",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#004d40",
                  },
                }}
              >
                My Appointments
              </Button>
              <Button
                onClick={() => navigate("/billing")}
                sx={{
                  color: "#e0f2f1",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#004d40",
                  },
                }}
              >
                Billing
              </Button>
            </Box>
          )}

          {/* Right: Logout */}
          {currentUser && (
            <Button
              onClick={handleLogout}
              sx={{
                color: "#fff",
                backgroundColor: "#004d40",
                fontWeight: 500,
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  backgroundColor: "#00332e",
                },
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
