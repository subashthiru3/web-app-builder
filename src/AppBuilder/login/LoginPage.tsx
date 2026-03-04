"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuthStore, type LoginCredentials } from "../../lib/authStore";
import "./LoginPage.css";
import Image from "next/image";

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const {
    login,
    isLoading,
    isAuthenticated,
    errors: storeErrors,
    clearErrors,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [fieldTouched, setFieldTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (storeErrors.length > 0) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [storeErrors, clearErrors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailBlur = () => {
    setFieldTouched((prev) => ({ ...prev, email: true }));
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    }
  };

  const handlePasswordBlur = () => {
    setFieldTouched((prev) => ({ ...prev, password: true }));
    if (password && password.length < 6) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    clearErrors();

    if (fieldTouched.email) {
      if (!value.trim()) {
        setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      } else {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearErrors();

    if (fieldTouched.password) {
      if (!value) {
        setFormErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }));
      } else if (value.length < 6) {
        setFormErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters",
        }));
      } else {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials: LoginCredentials = {
      email: email.trim(),
      password,
      rememberMe,
    };

    await login(credentials);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const isFormValid =
    email.trim() && password && Object.keys(formErrors).length === 0;

  return (
    <Box className="loginPage-container">
      {/* Left Section - Logo */}
      <Box className="loginPage-left">
        <Box className="loginPage-logo-section">
          <Box
            className="loginPage-logo-icon"
            sx={{ width: 100, height: 100, fontSize: 60 }}
          >
            <LockIcon sx={{ fontSize: 60, color: "white" }} />
          </Box>
          <Box
            className="loginPage-logo-text"
            sx={{
              mb: 4,
              p: 4,
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              border: "3px solid transparent",
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(102, 126, 234, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              animation: "pulse-glow 3s ease-in-out infinite",
              "@keyframes pulse-glow": {
                "0%, 100%": {
                  boxShadow:
                    "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(102, 126, 234, 0.3)",
                },
                "50%": {
                  boxShadow:
                    "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 60px rgba(118, 75, 162, 0.5)",
                },
              },
            }}
          >
            <Image src="/logicvalley.png" alt="Logo" width={200} height={60} />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            sx={{ color: "white", fontWeight: 700 }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            Sign in to access your application
          </Typography>
        </Box>
      </Box>

      {/* Right Section - Form */}
      <Box className="loginPage-right">
        <Container maxWidth="sm">
          <Box className="loginPage-content">
            <Card elevation={8} className="loginPage-card">
              <CardContent>
                {/* Header */}
                <Box className="loginPage-header">
                  <Typography
                    variant="h4"
                    component="h2"
                    className="loginPage-title"
                  >
                    Sign In
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Enter your credentials to access the application
                  </Typography>
                </Box>

                {/* Loading Progress */}
                {isLoading && <LinearProgress sx={{ mb: 2 }} />}

                {/* Error Messages */}
                {storeErrors.length > 0 && (
                  <Box className="loginPage-errors">
                    {storeErrors.map((error, index) => (
                      <Alert
                        key={index}
                        severity="error"
                        onClose={() => clearErrors()}
                        sx={{ mb: 1 }}
                      >
                        {error.message}
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="loginPage-form">
                  <Box className="loginPage-form-field">
                    <TextField
                      fullWidth
                      id="email"
                      type="email"
                      label="Email Address"
                      placeholder="example@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      disabled={isLoading}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      variant="outlined"
                      className="loginPage-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="email"
                    />
                  </Box>

                  <Box className="loginPage-form-field">
                    <TextField
                      fullWidth
                      id="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                      disabled={isLoading}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      variant="outlined"
                      className="loginPage-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              disabled={isLoading}
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="current-password"
                    />
                  </Box>

                  <Box className="loginPage-form-options">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={isLoading}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">Remember me</Typography>
                      }
                    />
                    <Button
                      color="primary"
                      variant="text"
                      size="small"
                      href="#"
                      sx={{
                        textTransform: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="loginPage-submit-btn"
                    startIcon={isLoading ? undefined : <CheckIcon />}
                  >
                    {isLoading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Signing in...</span>
                      </Box>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* Footer */}
                <Box className="loginPage-footer">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    Don&apos;t have an account?{" "}
                    <Button color="primary" variant="text" size="small">
                      Sign up here
                    </Button>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
