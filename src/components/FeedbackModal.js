import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const FeedbackModal = ({ open, onClose, title, message, success }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: success ? "green" : "red" }}>
        {title}
      </DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color={success ? "success" : "error"}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
