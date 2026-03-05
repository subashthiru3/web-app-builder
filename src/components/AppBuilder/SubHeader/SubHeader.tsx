import React, { FC, useState, useCallback, memo, useMemo } from "react";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./sub-header.css";
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
import { MWLSelectField } from "react-web-white-label";
import { saveData, deployCreateProjectStatus, deployProject } from "@/api";
import { Toaster, toast } from "sonner";
import { useStore } from "@/store/store";

// Constants
const ICON_COLOR = "#757575";
const DISABLED_COLOR = "#BDBDBD";

const MOBILE_RESOLUTION_OPTIONS = [
  { id: "mobile-360x640", title: "Android Small" },
  { id: "mobile-375x667", title: "iPhone SE" },
  { id: "mobile-390x844", title: "iPhone 12/13" },
  { id: "mobile-414x896", title: "iPhone XR/11" },
];

const TABLET_RESOLUTION_OPTIONS = [
  { id: "tablet-768x1024", title: "iPad Mini" },
  { id: "tablet-800x1280", title: "Android Tablet" },
  { id: "tablet-834x1112", title: "iPad Air" },
  { id: "tablet-1024x1366", title: "iPad Pro 12.9" },
];

const LAPTOP_RESOLUTION_OPTIONS = [
  { id: "laptop-1280x720", title: "HD Laptop" },
  { id: "laptop-1366x768", title: "WXGA Laptop" },
  { id: "laptop-1440x900", title: "MacBook 13" },
  { id: "laptop-1920x1080", title: "Full HD Laptop" },
];

type ResolutionOption = { id: string; title: string };

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
  const selectedSubView = useBuilderStore((state) => state.selectedSubView);
  const setSelectedSubView = useBuilderStore(
    (state) => state.setSelectedSubView,
  );
  const { projectName: appName, description } = useStore(
    (state) => state.projectData,
  );

  // Dialog state for preview/edit JSON
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  // Handler to open JSON dialog
  const handleOpenJsonDialog = useCallback(() => {
    setJsonText(exportProjectJSON(appName));
    setJsonError("");
    setJsonDialogOpen(true);
  }, [exportProjectJSON, appName]);

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
    const json = exportProjectJSON(appName);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document?.body?.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }, [exportProjectJSON, appName]);

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
      const response = await saveData(appName, jsonText, description);
      if (response.status === 200) {
        toast.success(response.data?.message);
      }
    } else {
      toast.warning("No JSON data to save");
    }
  };

  const handleDeployProject = async () => {
    setDeployStatus("in_progress");
    const jsonString = exportProjectJSON(appName);

    if (!jsonString) {
      toast.warning("Nothing to deploy");
      setDeploying(false);
      return;
    }
    // ✅ 1. SAVE FIRST
    const saveResponse = await saveData(appName, jsonString, description);

    if (saveResponse.status !== 200) {
      toast.error("Failed to save project");
      setDeploying(false);
      return;
    } else {
      try {
        const res = await deployProject(appName, "azure-workout");
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
                  (t: any) => (
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
        setDeployStatus("failed");
      }
    }
  };

  // Handler to open preview in new tab
  const handlePreview = useCallback(() => {
    window.open(`/preview?project=${appName}`, "_blank");
  }, [appName]);

  const handleLaptopView = useCallback(() => {
    setSelectedView("Lap View");
    setSelectedSubView("");
  }, [setSelectedView, setSelectedSubView]);

  const handleMobileView = useCallback(() => {
    setSelectedView("Mobile View");
    setSelectedSubView("");
  }, [setSelectedView, setSelectedSubView]);

  const handleTabletView = useCallback(() => {
    setSelectedView("Tablet View");
    setSelectedSubView("");
  }, [setSelectedView, setSelectedSubView]);

  const viewOptions = useMemo(() => {
    if (selectedView === "Mobile View") return MOBILE_RESOLUTION_OPTIONS;
    if (selectedView === "Tablet View") return TABLET_RESOLUTION_OPTIONS;
    return LAPTOP_RESOLUTION_OPTIONS;
  }, [selectedView]);

  const selectedSubViewOption = useMemo(() => {
    if (!selectedSubView) return undefined;

    const matchedOption = viewOptions.find(
      (option) =>
        option.id === selectedSubView || option.title === selectedSubView,
    );

    if (matchedOption) return matchedOption;

    return { id: selectedSubView, title: selectedSubView };
  }, [viewOptions, selectedSubView]);

  const normalizeSubViewValue = useCallback(
    (value: unknown): string => {
      if (typeof value === "string") {
        const byId = viewOptions.find((option) => option.id === value);
        if (byId) return byId.id;

        const byTitle = viewOptions.find((option) => option.title === value);
        if (byTitle) return byTitle.id;

        const fromPattern = /(mobile|tablet|laptop)-\d+x\d+/i.exec(value);
        if (fromPattern) return fromPattern[0].toLowerCase();

        return "";
      }

      if (value && typeof value === "object") {
        const eventValue = (value as { target?: { value?: string } }).target
          ?.value;
        if (typeof eventValue === "string") {
          const byId = viewOptions.find((option) => option.id === eventValue);
          if (byId) return byId.id;

          const byTitle = viewOptions.find(
            (option) => option.title === eventValue,
          );
          if (byTitle) return byTitle.id;
        }

        const optionValue = value as Partial<ResolutionOption>;

        if (optionValue.id) return optionValue.id;

        if (optionValue.title) {
          const byTitle = viewOptions.find(
            (option) => option.title === optionValue.title,
          );
          if (byTitle) return byTitle.id;
        }
      }

      return "";
    },
    [viewOptions],
  );

  const handleSelectChange = useCallback(
    (value: unknown) => {
      const normalizedValue = normalizeSubViewValue(value);
      console.log("Selected resolution:", normalizedValue);
      setSelectedSubView(normalizedValue);
    },
    [normalizeSubViewValue, setSelectedSubView],
  );

  return (
    <div className="mwl-subheader-container">
      <div className="mwl-subheader-assets">
        <div className="mwl-subheader-title">{appName}</div>
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
            <MWLSelectField
              key={`${selectedView}-${selectedSubView || "none"}`}
              options={viewOptions}
              initialValue={selectedSubViewOption}
              size="small"
              selectChangeHandler={handleSelectChange}
              placeholder="Resolution"
              width="70px"
            />
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
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  try {
                    const json = await file.text();
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
                onClick={handleDeployProject}
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
