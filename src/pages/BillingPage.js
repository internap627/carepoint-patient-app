import React, { useEffect, useState, useRef } from "react";
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
  Button,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { LocalHospital } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
  const invoiceRef = useRef();

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

  const handleDownloadPdf = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleDownloadPdf}
          sx={{ backgroundColor: "#00695c" }}
        >
          Download PDF
        </Button>
      </Box>
      <Paper
        ref={invoiceRef}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocalHospital sx={{ mr: 1, color: "#00695c", fontSize: "2rem" }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#00695c" }}>
              CarePoint
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6">Invoice</Typography>
            <Typography variant="body2" color="text.secondary">
              #{user?.uid.slice(0, 8)}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Box>
            <Typography variant="h6">Billed to:</Typography>
            <Typography variant="body1">
              {user?.displayName || user?.email}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6">Invoice Date:</Typography>
            <Typography variant="body1">
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {bills.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "#004d40" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#004d40" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#004d40" }} align="right">
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>
                      <Typography variant="body1">{bill.doctor}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {bill.specialty}
                      </Typography>
                    </TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {bill.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ p: 2, textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#00695c" }}>
                Total Due:{" "}
                {bills
                  .reduce(
                    (acc, bill) =>
                      acc + parseFloat(bill.amount.replace("$", "")),
                    0
                  )
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
              </Typography>
            </Box>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
            No billing records found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
