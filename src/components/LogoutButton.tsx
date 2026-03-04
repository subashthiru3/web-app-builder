/**
 * Logout Button Component
 * Reusable logout button with confirmation
 */

"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonProps,
  CircularProgress,
} from "@mui/material";
import { LogoutOutlined as LogoutIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";

export interface LogoutButtonProps extends Omit<ButtonProps, "onClick"> {
  showConfirmation?: boolean;
  redirectTo?: string;
  onLogoutSuccess?: () => void;
  onLogoutError?: (error: Error) => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  showConfirmation = true,
  redirectTo = "/login",
  onLogoutSuccess,
  onLogoutError,
  variant = "outlined",
  color = "error",
  size = "medium",
  startIcon,
  children = "Logout",
  ...props
}) => {
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    if (showConfirmation) {
      setOpenDialog(true);
    } else {
      handleConfirmLogout();
    }
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      onLogoutSuccess?.();
      setOpenDialog(false);

      // Redirect after logout
      setTimeout(() => {
        router.push(redirectTo);
      }, 300);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Logout failed");
      onLogoutError?.(err);
      setIsLoggingOut(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isDisabled = isLoading || isLoggingOut || props.disabled;

  return (
    <>
      <Button
        {...props}
        variant={variant}
        color={color}
        size={size}
        onClick={handleLogoutClick}
        disabled={isDisabled}
        startIcon={isLoggingOut ? <CircularProgress size={20} /> : startIcon || <LogoutIcon />}
      >
        {isLoggingOut ? "Logging out..." : children}
      </Button>

      {showConfirmation && (
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="logout-dialog-title"
        >
          <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to logout? You&apos;ll need to log back in to continue.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              variant="contained"
              color="error"
              disabled={isLoggingOut}
              startIcon={isLoggingOut && <CircularProgress size={16} />}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default LogoutButton;
