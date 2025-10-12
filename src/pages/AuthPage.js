import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebase";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: "", message: "", success: false });

  const handleAuth = async () => {
    try {
      if (tab === 0) {
        await signInWithEmailAndPassword(auth, email, password);
        setModalInfo({
          title: "Login Successful",
          message: "Welcome back! Redirecting to browse doctors...",
          success: true,
        });
        setModalOpen(true);
        setTimeout(() => navigate("/categories"), 2000);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setModalInfo({
          title: "Registration Successful",
          message: "Your account has been created successfully! Redirecting to browse doctors...",
          success: true,
        });
        setModalOpen(true);
        setTimeout(() => navigate("/categories"), 2000);
      }
    } catch (err) {
      setModalInfo({
        title: "Error",
        message: err.message,
        success: false,
      });
      setModalOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
          backgroundColor: "#f9fafb",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => {
            setTab(newValue);
            setError("");
          }}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{
            style: { backgroundColor: "#2e7d32" }, // Green indicator
          }}
          sx={{
            "& .MuiTab-root": {
              color: "#777",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#00695c", // Green text for selected tab
              fontWeight: "bold",
            },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* Form */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom color="#333">
            {tab === 0 ? "Login to your account" : "Create a new account"}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}

          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: "1rem",
              textTransform: "none",
              backgroundColor: "#00695c",
              "&:hover": {
                backgroundColor: "#00332e",
              },
            }}
            onClick={handleAuth}
          >
            {tab === 0 ? "Login" : "Register"}
          </Button>
        </Box>
      </Paper>

      {/* Feedback Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle sx={{ color: modalInfo.success ? "green" : "red" }}>
          {modalInfo.title}
        </DialogTitle>
        <DialogContent>{modalInfo.message}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModalOpen(false)}
            variant="contained"
            color={modalInfo.success ? "success" : "error"}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
