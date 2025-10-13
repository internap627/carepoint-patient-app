import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { doc, onSnapshot, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    emergencyContact: "",
  });
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancelClickOpen = () => {
    setCancelOpen(true);
  };

  const handleCancelClose = () => {
    setCancelOpen(false);
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    setDeleting(true);
    try {
      // Delete user's bookings
      const bookingsQuery = query(collection(db, "bookings"), where("userId", "==", currentUser.uid));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const deletePromises = [];
      bookingsSnapshot.forEach((booking) => {
        deletePromises.push(deleteDoc(doc(db, "bookings", booking.id)));
      });
      await Promise.all(deletePromises);

      // Delete user from Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);

      // Clear form
      setUserData(null);
      setFormState({ name: "", phone: "", emergencyContact: "" });

      // Close the dialog
      handleClose();
    } catch (error) {
      console.error("Error deleting user data:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelAlert = async () => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    await setDoc(userDocRef, { emergencyActive: false }, { merge: true });
    handleCancelClose();
  };

  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setFormState({
          name: data.name || "",
          phone: data.phone || "",
          emergencyContact: data.emergencyContact || "",
        });
        setEmergencyActive(data.emergencyActive || false);
      } else {
        // If no user data exists, initialize with empty strings
        setUserData(null);
        setFormState({
          name: currentUser.displayName || "",
          phone: "",
          emergencyContact: "",
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (userData) {
      setFormState({
        name: userData.name || "",
        phone: userData.phone || "",
        emergencyContact: userData.emergencyContact || "",
      });
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, { ...formState, email: currentUser.email }, { merge: true });
      setUserData({ ...formState, email: currentUser.email });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
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
      {emergencyActive && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            backgroundColor: "#f0f7f7",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: '2rem', animation: 'pulse-emoji 2s infinite' }}>🚨</span>
          <Typography variant="h6" color="#e65100">
            Emergency alert active. CarePoint team has been contacted.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCancelClickOpen}
            sx={{ mt: 2, backgroundColor: "#00695c" }}
          >
            Cancel Alert
          </Button>
        </Box>
      )}
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
          User Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Manage your personal information.
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={currentUser?.email || ""}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formState.name}
              fullWidth
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={formState.phone}
              fullWidth
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              value={formState.emergencyContact}
              fullWidth
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: "#00695c" }}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleEdit}
                    sx={{ backgroundColor: "#00695c" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    sx={{ backgroundColor: "#d32f2f" }}
                  >
                    Delete User Data
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {deleting ? (
            <CircularProgress />
          ) : (
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your personal data? This action cannot be undone.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={deleting} sx={{ color: '#0a4b4f', '&:hover': { backgroundColor: 'rgba(10, 75, 79, 0.1)' } }}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus sx={{ color: '#0a4b4f', '&:hover': { backgroundColor: 'rgba(10, 75, 79, 0.1)' } }} disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={cancelOpen}
        onClose={handleCancelClose}
        aria-labelledby="alert-dialog-title-cancel"
        aria-describedby="alert-dialog-description-cancel"
      >
        <DialogTitle id="alert-dialog-title-cancel">
          {"Confirm Cancellation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-cancel">
            Are you sure you want to cancel the emergency alert?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} sx={{ color: '#0a4b4f', '&:hover': { backgroundColor: 'rgba(10, 75, 79, 0.1)' } }}>No</Button>
          <Button onClick={handleCancelAlert} autoFocus sx={{ color: '#0a4b4f', '&:hover': { backgroundColor: 'rgba(10, 75, 79, 0.1)' } }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}