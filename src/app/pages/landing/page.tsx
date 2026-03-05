"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import { MWLButton } from "react-web-white-label";
import Sidepanel from "@/components/Sidepanel/Sidepanel";

import AddIcon from "@mui/icons-material/Add";
import "./landing-page.css";
import CustomTabs from "@/components/CustomTab/CustomTabs";
import { LandingPageDetails } from "./constant";

const LandingPage = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <main className="landing-container">
      <div className="subheader">
        <h1 className="title">Welcome to Our Application</h1>
        <MWLButton
          variant="contained"
          color="primary"
          text="New Project"
          textTransform="uppercase"
          startIcon={<AddIcon />}
          disableElevation={true}
          handleClick={handleDrawerOpen}
        />
      </div>
      <Grid container spacing={2} className="body-container">
        <Grid size={8}></Grid>
        <Grid size={4}>
          <Sidepanel open={open} onClose={handleDrawerClose}>
            <CustomTabs tabs={LandingPageDetails.pageCreationTabs} />
          </Sidepanel>
        </Grid>
      </Grid>
    </main>
  );
};

export default LandingPage;
