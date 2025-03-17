import { useState } from "react";
import { TextField, Button, Container, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../constants/config";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    feedback: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${server}/api/user/contact`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        alert(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }} style={{backgroundColor:"#1f1f1f",borderRadius:"2rem",padding:"3rem"}}>
      <Paper elevation={7} sx={{ p: 4, textAlign: "center" }} style={{backgroundColor:"#1f1f1f"}}>
        <Typography variant="h5" gutterBottom style={{fontSize:"2rem",color:"white"}}>
          Contact Us?
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" name="name" value={formData.name}  InputLabelProps={{
              style: { color: "white" },
            }} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number"   InputLabelProps={{
              style: { color: "white" },
            }} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" name="email"   InputLabelProps={{
              style: { color: "white" },
            }} value={formData.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Feedback" name="feedback"   InputLabelProps={{
              style: { color: "white" },
            }} multiline rows={4} value={formData.feedback} onChange={handleChange} required />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ContactForm;
