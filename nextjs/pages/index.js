import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { Box } from "@mui/material";

const Background = styled("div")({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f9f9f9 50%, #fff 50%)",
});

const ImageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
});

const FormContainer = styled(Paper)({
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  textAlign: "center",
  marginBottom: "40px",
});

const Title = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  color: "#0277bd",
  marginBottom: "8px",
});

const Subtitle = styled(Typography)({
  fontSize: "14px",
  color: "#ff4081",
  marginBottom: "16px",
});

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email");
  const [loginEmailOrUsername, setLoginEmailOrUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [loginMethod]: loginEmailOrUsername,
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setIsAuthenticated(true);

      // Redirect to /page1 after successful login with username and email as query params
      router.push({
        pathname: "/page1",
        query: { username: data.username, email: data.email },
      });
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password_hash: registerPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return isAuthenticated ? (
    <Box sx={{ textAlign: "center", padding: "50px" }}>
      <Typography variant="h4">Welcome to Homework Management System</Typography>
      <Typography variant="h6">Manage your tasks efficiently</Typography>
    </Box>
  ) : (
    <Background>
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <ImageContainer>
              <Image
                src="/RAI.png"
                alt="RAI Logo"
                width={500}
                height={400}
                style={{ borderRadius: "10px" }}
              />
            </ImageContainer>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormContainer elevation={3}>
              {isLogin ? (
                <>
                  <Title variant="h4">HELLO! PLEASE LOGIN</Title>
                  <Subtitle>Fill in your details</Subtitle>
                  <ToggleButtonGroup
                    value={loginMethod}
                    exclusive
                    onChange={(e, newMethod) => setLoginMethod(newMethod)}
                    aria-label="login method"
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  >
                    <ToggleButton value="email" aria-label="login with email">
                      Login with Email
                    </ToggleButton>
                    <ToggleButton value="username" aria-label="login with username">
                      Login with Username
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <form onSubmit={handleLoginSubmit}>
                    <TextField
                      fullWidth
                      label={loginMethod === "email" ? "Email" : "Username"}
                      variant="outlined"
                      margin="normal"
                      value={loginEmailOrUsername}
                      onChange={(e) => setLoginEmailOrUsername(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginTop: "16px", backgroundColor: "#d81b60" }}
                      type="submit"
                    >
                      LOGIN
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Title variant="h4">REGISTER</Title>
                  <Subtitle>Create a new account</Subtitle>
                  <form onSubmit={handleRegisterSubmit}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      margin="normal"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginTop: "16px", backgroundColor: "#d81b60" }}
                      type="submit"
                    >
                      REGISTER
                    </Button>
                  </form>
                </>
              )}
              <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={() => setIsLogin(!isLogin)}
                style={{ marginTop: "16px" }}
              >
                {isLogin
                  ? "Don't have an account? Register here!"
                  : "Already have an account? Login here!"}
              </Button>
            </FormContainer>
          </Grid>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Background>
  );
}
