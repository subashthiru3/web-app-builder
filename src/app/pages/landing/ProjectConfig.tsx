import { createNewProject } from "@/api";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import React from "react";
import { MWLButton, MWLDivider, MWLTextBox } from "react-web-white-label";
import { toast, Toaster } from "sonner";

const ProjectConfig = () => {
  const { projectData, updateProjectData } = useStore((state) => state);
  const router = useRouter();

  const handleFormDataChange = (field: string, value: string) => {
    updateProjectData(field as keyof typeof projectData, value);
  };

  const handleCreateNewProject = async () => {
    try {
      const res = await createNewProject(
        projectData.projectName?.replaceAll(" ", "-").toLocaleLowerCase(),
        "azure-workout",
      );
      if (res.status === 200) {
        console.log("response from createNewProject:", res);

        toast.info("Project created successfully.");
        router.push("/pages/app-builder");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="project-config-container">
      <MWLTextBox
        label="Project Name"
        placeholder="Enter Project Name"
        size="small"
        value={projectData.projectName}
        onchangeHandler={(e) =>
          handleFormDataChange("projectName", e.target.value)
        }
      />
      <MWLTextBox
        label="Description"
        placeholder="Enter Project Description"
        size="small"
        multiline
        minRows={5}
        value={projectData.description}
        onchangeHandler={(e) =>
          handleFormDataChange("description", e.target.value)
        }
      />
      <MWLDivider />
      <span>Page Data</span>
      <MWLTextBox
        label="URL Path"
        placeholder="Enter URL Path"
        size="small"
        value={projectData.urlPath}
        onchangeHandler={(e) => handleFormDataChange("urlPath", e.target.value)}
      />
      <MWLTextBox
        label="Title"
        placeholder="Enter Project Title"
        size="small"
        value={projectData.title}
        onchangeHandler={(e) => handleFormDataChange("title", e.target.value)}
      />
      <div className="project-config-action">
        <MWLButton
          text={"Create Project"}
          size="medium"
          handleClick={handleCreateNewProject}
          disabled={!projectData.projectName}
        />
      </div>
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
};

export default ProjectConfig;
