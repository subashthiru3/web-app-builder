"use client";
import React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import { MWLButton, MWLFileUploader } from "react-web-white-label";
import Sidepanel from "@/components/Sidepanel/Sidepanel";
import CustomTabs from "@/components/CustomTab/CustomTabs";
import { LandingPageDetails } from "./constant";
import CustomCard from "@/components/CustomCard/CustomCard";

import AddIcon from "@mui/icons-material/Add";
import DashboardImg from "../../assets/sample-images/dashboard.png";
import ListPageImg from "../../assets/sample-images/list-page.png";
import "./landing-page.css";

const TitleCard = ({
  mainTitle,
  description,
}: {
  mainTitle: string;
  description: string;
}) => {
  return (
    <div className="title-card-container">
      <h1 className="main-title">{mainTitle}</h1>
      <p className="description">{description}</p>
    </div>
  );
};

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
      <Grid container spacing={3} className="body-container">
        <Grid size={12} className="content-container">
          <TitleCard
            mainTitle="Your Projects"
            description="Start with a pre-built layout or create a custom one."
          />
          <CustomCard width={350} title="Add Project">
            <MWLFileUploader />
          </CustomCard>
        </Grid>
        <Grid size={12} className="content-container">
          <TitleCard
            mainTitle="Choose Template"
            description="Start with a pre-built layout or create a custom one."
          />
          <div className="template-container">
            <CustomCard width={267} title="Dashboard Layout">
              <Image src={DashboardImg} alt="Dashboard Layout" width={230} />
            </CustomCard>
            <CustomCard width={267} title="List Page">
              <Image src={ListPageImg} alt="List Page" width={230} />
            </CustomCard>
          </div>
        </Grid>
      </Grid>
      <Sidepanel open={open} onClose={handleDrawerClose}>
        <CustomTabs tabs={LandingPageDetails.pageCreationTabs} />
      </Sidepanel>
    </main>
  );
};

export default LandingPage;
