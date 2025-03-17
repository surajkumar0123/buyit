import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { server } from "../constants/config";
import "./Login.css";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const email = useInputValidation("venom@gmail.com");
  const password = useInputValidation("venom");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/user/login`,
        {
          email: email.value,
          password: password.value,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      localStorage.setItem("buyitid", data.token);
    
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/register`,
        { name: name.value, email: email.value, password: password.value },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{backgroundColor:"black"}}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop:"-5rem",
            backgroundColor:"#1f1f1f"
          }}
          className="a2"
        >
          <Typography variant="h5" className="a1" style={{fontSize:"2rem",marginTop:"3rem"}}>
            {isLogin ? "Login" : "Sign Up"}
          </Typography>
          <form
            style={{ width: "100%" }}
            onSubmit={isLogin ? handleLogin : handleSignUp}
          >
            {!isLogin && (
              <TextField
                required
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
              />
            )}

            <TextField
              required
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
              value={email.value}
              onChange={email.changeHandler}
            />
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              value={password.value}
              onChange={password.changeHandler}
            />

            <Button
              sx={{ marginTop: "1rem" }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Typography textAlign="center" m="1rem">
              OR
            </Typography>

            <Button
              disabled={isLoading}
              fullWidth
              variant="text"
              onClick={toggleLogin}
            >
              {isLogin ? "Sign Up Instead" : "Login Instead"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
