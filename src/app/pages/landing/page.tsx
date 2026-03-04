"use client";
import React from "react";
import "./landing-page.css";
import { MWLButton } from "react-web-white-label";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const navigateToNewProject = () => {
    router.push("/pages/app-builder");
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
          handleClick={navigateToNewProject}
        />
      </div>
    </main>
  );
};

export default LandingPage;
