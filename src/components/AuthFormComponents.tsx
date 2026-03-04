/**
 * Reusable Auth Form Components
 * Helper components for building auth forms
 */

"use client";

import React from "react";
import {
  TextField,
  TextFieldProps,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Typography as MuiTypography,
} from "@mui/material";
import { AuthError } from "../lib/authStore";

/**
 * Email Input Component
 */
export interface EmailInputProps extends Omit<TextFieldProps, "type" | "label" | "error"> {
  error?: string;
  touched?: boolean;
}

export const EmailInput = React.forwardRef<HTMLDivElement, EmailInputProps>(
  ({ error, touched, helperText, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        type="email"
        label="Email Address"
        placeholder="example@company.com"
        error={!!error && touched}
        helperText={error && touched ? error : helperText}
        autoComplete="email"
        {...props}
      />
    );
  }
);

EmailInput.displayName = "EmailInput";

/**
 * Password Input Component
 */
export interface PasswordInputProps extends Omit<TextFieldProps, "type" | "label" | "error"> {
  error?: string;
  touched?: boolean;
  visible?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLDivElement, PasswordInputProps>(
  (
    {
      error,
      touched,
      helperText,
      visible = false,
      ...props
    },
    ref
  ) => {
    return (
      <TextField
        ref={ref}
        type={visible ? "text" : "password"}
        label="Password"
        placeholder="••••••••"
        error={!!error && touched}
        helperText={error && touched ? error : helperText}
        autoComplete="current-password"
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

/**
 * Auth Error Display Component
 */
export interface AuthErrorDisplayProps {
  errors: AuthError[];
  onDismiss?: () => void;
  maxDisplay?: number;
}

export const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  errors,
  onDismiss,
  maxDisplay = 3,
}) => {
  if (errors.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
      {errors.slice(0, maxDisplay).map((error, index) => (
        <Alert
          key={index}
          severity="error"
          onClose={onDismiss}
          sx={{ borderRadius: 1 }}
        >
          {error.message}
        </Alert>
      ))}
      {errors.length > maxDisplay && (
        <Typography variant="caption" color="error">
          +{errors.length - maxDisplay} more error(s)
        </Typography>
      )}
    </Box>
  );
};

/**
 * Form Loading Overlay
 */
export interface FormLoadingProps {
  isLoading: boolean;
  message?: string;
}

export const FormLoading: React.FC<FormLoadingProps> = ({
  isLoading,
  message = "Processing...",
}) => {
  if (!isLoading) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <LinearProgress />
      {message && (
        <MuiTypography variant="caption" display="block" sx={{ mt: 1 }}>
          {message}
        </MuiTypography>
      )}
    </Box>
  );
};

/**
 * Form Field with Validation
 */
export interface ValidatedFieldProps extends Omit<TextFieldProps, "error"> {
  value: string;
  error?: string;
  touched?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const ValidatedField = React.forwardRef<HTMLDivElement, ValidatedFieldProps>(
  ({ value, error, touched, onChange, onBlur, ...props }, ref) => {
    const showError = touched && error;

    return (
      <TextField
        ref={ref}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={!!showError}
        helperText={showError ? error : ""}
        {...props}
      />
    );
  }
);

ValidatedField.displayName = "ValidatedField";

/**
 * Password Strength Indicator
 */
export interface PasswordStrengthIndicatorProps {
  password: string;
  showLabel?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showLabel = true,
}) => {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;

    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (/[a-z]/.test(pwd)) score += 20;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[!@#$%^&*]/.test(pwd)) score += 15;

    let label = "Weak";
    let color = "error";

    if (score >= 80) {
      label = "Very Strong";
      color = "success";
    } else if (score >= 60) {
      label = "Strong";
      color = "success";
    } else if (score >= 40) {
      label = "Medium";
      color = "warning";
    }

    return { score: Math.min(score, 100), label, color };
  };

  if (!password) return null;

  const { score, label, color } = getStrength(password);

  return (
    <Box sx={{ mt: 1 }}>
      {showLabel && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <MuiTypography variant="caption">Password Strength:</MuiTypography>
          <MuiTypography variant="caption" color={color}>
            {label}
          </MuiTypography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: "#e0e0e0",
        }}
      />
    </Box>
  );
};

/**
 * Auth Form Container
 */
export interface AuthFormContainerProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  errors?: AuthError[];
  children: React.ReactNode;
  onErrorDismiss?: () => void;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  title,
  subtitle,
  isLoading = false,
  errors = [],
  children,
  onErrorDismiss,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="textSecondary" variant="body2">
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Loading State */}
      <FormLoading isLoading={isLoading} message="Please wait..." />

      {/* Errors */}
      <AuthErrorDisplay errors={errors} onDismiss={onErrorDismiss} />

      {/* Content */}
      {children}
    </Box>
  );
};

/**
 * Form Actions Container
 */
export interface FormActionsProps {
  submitLabel?: string;
  submitDisabled?: boolean;
  submitLoading?: boolean;
  onSubmit?: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export const FormActions: React.FC<FormActionsProps> = ({
  secondaryAction,
  children,
}) => {
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
      {children}
      {secondaryAction && (
        <Typography variant="body2" align="center">
          {secondaryAction.label}
        </Typography>
      )}
    </Box>
  );
};
