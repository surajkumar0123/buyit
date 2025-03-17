import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { server } from "../constants/config";
import { useNavigate } from "react-router-dom";


interface Contact {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  feedback: string;
  attended: boolean;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate=useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${server}/api/admin/getcontact`);
        setContacts(response.data.contacts); // Assuming API returns `{ contacts: [...] }`
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : contacts.length === 0 ? (
        <Typography>No contact messages found.</Typography>
      ) : (
        <Card sx={{ boxShadow: 3, p: 2 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact._id} hover>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.phoneNumber}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.feedback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Contacts;
