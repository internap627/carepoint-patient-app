import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { bills } from "../data/billing";

export default function BillingPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing & Invoices
      </Typography>

      {bills.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Specialty</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.doctor}</TableCell>
                  <TableCell>{bill.specialty}</TableCell>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={bill.status}
                      color={bill.status === "Paid" ? "success" : "error"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No billing records found.
        </Typography>
      )}
    </Box>
  );
}
