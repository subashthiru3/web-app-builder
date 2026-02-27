import React, { FC, useState, useCallback, memo } from "react";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./SubHeader.css";
import { useBuilderStore } from "@/lib/store";
import { LuUndo2, LuRedo2, LuImport } from "react-icons/lu";
import { IoMdEye } from "react-icons/io";
import { MdOutlineLaptopMac, MdTabletAndroid } from "react-icons/md";
import { BsFiletypeJson } from "react-icons/bs";
import { FaSave, FaTabletAlt } from "react-icons/fa";
import { PiExportBold } from "react-icons/pi";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { LuCopy } from "react-icons/lu";
import { usePagesStore } from "@/lib/pagesStore";
import { saveData, createNewProject, deployCreateProjectStatus } from "@/api";
import { Toaster, toast } from "sonner";

// Constants
const ICON_COLOR = "#757575";
const DISABLED_COLOR = "#BDBDBD";
const PROJECT_NAME = "sample-six";

// Reusable icon wrapper component
const IconWrapper: FC<{
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}> = memo(({ onClick, disabled, children, title }) => {
  const icon = (
    <div
      className={`icon-wrapper ${disabled ? "disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
      style={{
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
  return title ? (
    <Tooltip title={title} arrow>
      <span>{icon}</span>
    </Tooltip>
  ) : (
    icon
  );
});

IconWrapper.displayName = "IconWrapper";

const SubHeader: FC = () => {
  const exportProjectJSON = useBuilderStore((state) => state.exportProjectJSON);
  const [deploying, setDeploying] = useState(false);
  const setDeployStatus = useBuilderStore((state) => state.setDeployStatus);
  const importJSON = useBuilderStore((state) => state.importJSON);
  const importProjectJSON = useBuilderStore((state) => state.importProjectJSON);
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const activePageId = usePagesStore((state) => state.activePageId);
  const selectedView = useBuilderStore((state) => state.selectedView);
  const setSelectedView = useBuilderStore((state) => state.setSelectedView);

  // Dialog state for preview/edit JSON
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  // Handler to open JSON dialog
  const handleOpenJsonDialog = useCallback(() => {
    setJsonText(exportProjectJSON(PROJECT_NAME));
    setJsonError("");
    setJsonDialogOpen(true);
  }, [exportProjectJSON]);

  // Handler to close JSON dialog
  const handleCloseJsonDialog = useCallback(() => {
    setJsonDialogOpen(false);
    setJsonError("");
  }, []);
  // Handler to save edited JSON
  const handleSaveJsonDialog = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed && Array.isArray(parsed.pages)) {
        importProjectJSON(jsonText);
      } else {
        importJSON(jsonText, 0);
      }
      setJsonDialogOpen(false);
      setJsonError("");
    } catch (err) {
      setJsonError("Invalid JSON");
      console.error("Failed to import JSON:", err);
    }
  }, [importJSON, importProjectJSON, jsonText]);

  // Handler to copy JSON to clipboard
  const handleCopyJson = useCallback(() => {
    navigator.clipboard.writeText(jsonText);
  }, [jsonText]);

  // Handler to paste JSON from clipboard
  const handlePasteJson = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
    } catch {}
  }, []);

  // Handler to clear all components
  // Removed unused handleClear
  // Handler to export JSON
  const handleExportJSON = useCallback(() => {
    const json = exportProjectJSON(PROJECT_NAME);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }, [exportProjectJSON]);

  // Action handlers
  // Removed unused handleSettings
  const handleUndo = useCallback(() => {
    if (activePageId !== undefined && activePageId !== null) {
      undo(activePageId);
    }
  }, [undo, activePageId]);

  const handleRedo = useCallback(() => {
    if (activePageId !== undefined && activePageId !== null) {
      redo(activePageId);
    }
  }, [redo, activePageId]);

  const handleSave = async () => {
    if (jsonText) {
      const response = await saveData(PROJECT_NAME, jsonText);
      if (response.status === 200) {
        toast.success(response.data?.message);
      }
    } else {
      toast.warning("No JSON data to save");
    }
  };

  const handleCreateNewProject = async () => {
    setDeployStatus("in_progress");
    const appName = `portfolio-${Math.floor(Math.random() * 1000)}`;
    const jsonString = exportProjectJSON(appName);

    if (!jsonString) {
      toast.warning("Nothing to deploy");
      setDeploying(false);
      return;
    }
    // ✅ 1. SAVE FIRST
    const saveResponse = await saveData(appName, jsonString);

    if (saveResponse.status !== 200) {
      toast.error("Failed to save project");
      setDeploying(false);
      return;
    } else {
      try {
        const res = await createNewProject(appName, "azure-workout");
        if (res.status === 200) {
          // ✅ 2. START DEPLOYMENT
          const deploymentId = res.data.deploymentId;

          if (!deploymentId) {
            toast.error("Failed to start deployment");
            setDeploying(false);
            return;
          }

          toast.info("Deployment in progress...");
          setDeploying(true);

          // ✅ 3. POLL DEPLOY STATUS
          const interval = setInterval(async () => {
            try {
              const statusRes = await deployCreateProjectStatus(deploymentId);
              const status = statusRes.data.status;
              const azureStaticUrl = statusRes.data.azureStaticUrl;

              if (status === "SUCCESS") {
                clearInterval(interval);
                setDeploying(false);
                setDeployStatus("success");

                const generatedUrl = `${azureStaticUrl}/preview?project=${appName}`;
                toast.custom(
                  (t) => (
                    <div
                      style={{
                        background: "white",
                        padding: "16px",
                        borderRadius: "12px",
                        width: "420px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 10 }}>
                        🎉 Deployment Successful
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "#f5f5f5",
                          padding: "10px",
                          borderRadius: 8,
                          wordBreak: "break-all",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ flex: 1 }}>{generatedUrl}</span>

                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(generatedUrl);
                            toast.success("Copied to clipboard ✅");
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <LuCopy size={18} />
                        </button>
                      </div>

                      <div style={{ marginTop: 14, textAlign: "right" }}>
                        <button
                          onClick={() => toast.dismiss(t)}
                          style={{
                            background: "#111",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ),
                  {
                    duration: Infinity, // 🔥 VERY IMPORTANT
                  },
                );

                // const liveUrl = `${azureStaticUrl}/preview?project=${appName}`;

                // toast.success("Deployment Completed 🎉", {
                //   description: `Live URL: ${liveUrl}`,
                // });
              }

              if (status === "FAILED") {
                clearInterval(interval);
                setDeploying(false);
                setDeployStatus("failed");
                toast.error("Deployment Failed ❌");
              }
            } catch (err) {
              console.error(err);
              clearInterval(interval);
              setDeploying(false);
              setDeployStatus("failed");
              toast.error("Error checking deployment status");
            }
          }, 5000);
        } else {
          toast.error("Failed to create new project");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to create and deploy project");
        setDeploying(false);
      }
    }
  };

  // Handler to open preview in new tab
  const handlePreview = useCallback(() => {
    window.open(`/preview?project=${PROJECT_NAME}`, "_blank");
  }, []);

  const handleLaptopView = useCallback(() => {
    setSelectedView("Lap View");
  }, [setSelectedView]);

  const handleMobileView = useCallback(() => {
    setSelectedView("Mobile View");
  }, [setSelectedView]);

  const handleTabletView = useCallback(() => {
    setSelectedView("Tablet View");
  }, [setSelectedView]);

  return (
    <div className="mwl-subheader-container">
      <div className="mwl-subheader-assets">
        <div className="mwl-subheader-title">{PROJECT_NAME}</div>
        <div className="mwl-subheader-main-container">
          <div className="mwl-subheader-icons">
            <IconWrapper onClick={handleUndo} title="Undo">
              <LuUndo2 color={ICON_COLOR} size={20} />
            </IconWrapper>
            <IconWrapper onClick={handleRedo} title="Redo">
              <LuRedo2 color={ICON_COLOR} size={20} />
            </IconWrapper>
            <IconWrapper onClick={handleMobileView} title="Mobile View">
              <MdTabletAndroid
                color={
                  selectedView === "Mobile View" ? ICON_COLOR : DISABLED_COLOR
                }
                size={20}
              />
            </IconWrapper>
            <IconWrapper onClick={handleTabletView} title="Tablet View">
              <FaTabletAlt
                color={
                  selectedView === "Tablet View" ? ICON_COLOR : DISABLED_COLOR
                }
                size={20}
              />
            </IconWrapper>
            <IconWrapper onClick={handleLaptopView} title="Laptop View">
              <MdOutlineLaptopMac
                color={
                  selectedView === "Lap View" ? ICON_COLOR : DISABLED_COLOR
                }
                size={20}
              />
            </IconWrapper>
          </div>
          <div
            className="mwl-subheader-right-icons"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <IconWrapper onClick={handlePreview} title="Preview">
              <IoMdEye size={20} color={ICON_COLOR} />
            </IconWrapper>
            <IconWrapper onClick={handleExportJSON} title="Export JSON">
              <PiExportBold size={20} color={ICON_COLOR} />
            </IconWrapper>
            <IconWrapper onClick={handleOpenJsonDialog} title="Edit JSON">
              <BsFiletypeJson size={20} color={ICON_COLOR} />
            </IconWrapper>
            <IconWrapper
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json,application/json";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const json = event.target?.result as string;
                      let parsed;
                      try {
                        parsed = JSON.parse(json);
                      } catch (error) {
                        alert("Invalid JSON file.");
                        console.error("Failed to parse JSON from file:", error);
                        return;
                      }
                      if (parsed && Array.isArray(parsed.pages)) {
                        importProjectJSON(json);
                      } else {
                        importJSON(json, 0);
                      }
                      setJsonText(json);
                    } catch (err) {
                      alert("Invalid JSON file.");
                      console.error("Failed to import JSON from file:", err);
                    }
                  };
                  reader.readAsText(file);
                };
                input.click();
              }}
              title="Import JSON"
            >
              <LuImport size={20} color={ICON_COLOR} />
            </IconWrapper>
            <Dialog
              open={jsonDialogOpen}
              onClose={handleCloseJsonDialog}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Preview & Edit JSON</DialogTitle>
              <DialogContent>
                <TextField
                  multiline
                  minRows={10}
                  maxRows={30}
                  fullWidth
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  error={!!jsonError}
                  helperText={jsonError || "You can edit, copy, or paste JSON."}
                  variant="outlined"
                  InputProps={{
                    style: { fontFamily: "monospace", fontSize: 14 },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCopyJson} color="primary">
                  Copy
                </Button>
                <Button onClick={handlePasteJson} color="primary">
                  Paste
                </Button>
                <Button onClick={handleCloseJsonDialog}>Cancel</Button>
                <Button
                  onClick={handleSaveJsonDialog}
                  color="success"
                  variant="contained"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            <IconWrapper onClick={handleSave} title="Save">
              <FaSave color={ICON_COLOR} size={20} />
            </IconWrapper>
            <span className={deploying ? "rotating" : ""}>
              <IconWrapper
                disabled={deploying}
                onClick={handleCreateNewProject}
                title="Deploy"
              >
                <AiOutlineDeploymentUnit size={20} />
              </IconWrapper>
            </span>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
};

export default memo(SubHeader);
