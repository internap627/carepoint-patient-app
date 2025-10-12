import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!user) return;
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userBills = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            doctor: data.doctorName,
            specialty: data.specialty,
            date: data.appointmentAt.toDate().toLocaleDateString(),
            amount: data.fee,
          };
        });
        setBills(userBills);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [user]);

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
      {/* Page Header */}
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
            ? `${user.displayName || user.email || "Patient"}, here’s your invoice summary`
            : "Invoice Summary"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Review the upcoming appointments and the corresponding fees.
        </Typography>
      </Box>

      {/* Invoice Table */}
      {bills.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#004d40" }}>
                  Doctor
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#004d40" }}>
                  Specialty
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#004d40" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#004d40" }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} hover>
                  <TableCell>{bill.doctor}</TableCell>
                  <TableCell>{bill.specialty}</TableCell>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{bill.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 3, textAlign: "right" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#00695c" }}>
              Total Due:{" "}
              {bills
                .reduce((acc, bill) => acc + parseFloat(bill.amount.replace("$", "")), 0)
                .toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Typography>
          </Box>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          No billing records found.
        </Typography>
      )}
    </Box>
  );
}