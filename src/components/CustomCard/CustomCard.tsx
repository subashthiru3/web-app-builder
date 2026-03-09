import { Paper } from "@mui/material";
import React from "react";
import { ICustomCardProps } from "./CustomCard.types";
import "./custom-card.css";

const CustomCard: React.FC<ICustomCardProps> = ({
  children,
  padding,
  width,
  title,
  elevation,
}) => {
  return (
    <Paper
      elevation={elevation ?? 4}
      sx={{ p: padding ?? "1rem", width: width ?? "100%" }}
      className="card-container"
    >
      <h6 className="card-title">{title}</h6>
      {children}
    </Paper>
  );
};

export default CustomCard;
