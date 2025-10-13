import React, { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EmergencyButton = () => {
  const { currentUser } = useAuth();
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setEmergencyActive(docSnap.data().emergencyActive || false);
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, { emergencyActive: true }, { merge: true });
    setEmergencyActive(true);
    handleClose();
  };

  return (
    <>
      <Fab
        color="error"
        aria-label="emergency"
        onClick={handleClickOpen}
        disabled={emergencyActive}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: emergencyActive ? '#9e9e9e' : '#d32f2f',
          animation: emergencyActive ? 'none' : 'pulse 2s infinite',
          fontSize: '2rem',
        }}
      >
        🚨
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Emergency Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to send an emergency alert? The CarePoint team will be notified immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#0a4b4f', '&:hover': { backgroundColor: 'rgba(10, 75, 79, 0.1)' } }}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus sx={{ color: '#0a4b4f', '&:hover': { backgroundColor: 'rgba(10, 75, 79, 0.1)' } }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
