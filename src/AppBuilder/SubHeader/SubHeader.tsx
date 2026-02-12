import React, { FC, useState, useCallback, memo } from "react";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./SubHeader.css";
// Removed unused MUI and react-web-white-label icon imports
import { useBuilderStore } from "@/lib/store";
import { LuUndo2, LuRedo2, LuImport } from "react-icons/lu";
import { IoMdEye } from "react-icons/io";
import { MdOutlineLaptopMac, MdTabletAndroid } from "react-icons/md";
import { BsFiletypeJson } from "react-icons/bs";
// Removed unused FaFileExport, FaFileImport
import { FaSave, FaTabletAlt } from "react-icons/fa";
import { PiExportBold } from "react-icons/pi";
import { usePagesStore } from "@/lib/pagesStore";
import { deployApp, saveData } from "@/api";
import { GrDeploy } from "react-icons/gr";

// Constants
const ICON_COLOR = "#757575";
const DISABLED_COLOR = "#BDBDBD";
const PROJECT_NAME = "krish-commerce";

// Removed unused VIEW_OPTIONS

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
  console.log("SubHeader render start", jsonText);
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
  console.log("SubHeader rendered", jsonText);
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

  // Removed unused handleCopy

  // Removed unused handleCut

  // Removed unused handlePaste

  // Commented out refresh handler
  // const handleRefresh = useCallback(() => {
  //   console.log("Refresh clicked");
  //   window.location.reload();
  // }, []);

  // Removed unused handleSelectChange

  const handleSave = async () => {
    if (jsonText) {
      const response = await saveData(PROJECT_NAME, jsonText);
      if (response.status === 200) {
        alert(response.data?.message);
      }
    } else {
      console.log("No JSON data to save");
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploying(true);

      const jsonString = exportProjectJSON(PROJECT_NAME);
      const json = JSON.parse(jsonString);

      if (!json || json.length === 0) {
        alert("⚠ Nothing to deploy");
        return;
      }

      const response = await deployApp(PROJECT_NAME, json);

      alert("🚀 Deployment Started in GitHub Actions!");
      console.log(response);
    } catch (err) {
      console.error(err);
      alert("❌ Deployment failed");
    } finally {
      setDeploying(false);
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
            {/* <IconWrapper onClick={handleSettings}>
              <IoSettingsOutline color={ICON_COLOR} size={20} />
            </IconWrapper> */}
            <IconWrapper onClick={handleUndo} title="Undo">
              <LuUndo2 color={ICON_COLOR} size={20} />
            </IconWrapper>
            <IconWrapper onClick={handleRedo} title="Redo">
              <LuRedo2 color={ICON_COLOR} size={20} />
            </IconWrapper>
            {/* Commented this code for suggestion */}
            {/* <IconWrapper onClick={handleCopy}>
              <MdContentCopy color={ICON_COLOR} size={20} />
            </IconWrapper>
            <IconWrapper onClick={handleCut}>
              <IoMdCut color={ICON_COLOR} size={20} />
            </IconWrapper>
            <IconWrapper onClick={handlePaste} disabled={!isPasteEnabled}>
              <MdContentPaste
                color={isPasteEnabled ? ICON_COLOR : DISABLED_COLOR}
                size={20}
              />
            </IconWrapper> */}
            {/* <MWLSelectField
              options={VIEW_OPTIONS}
              size="small"
              selectChangeHandler={handleSelectChange}
              placeholder="Select option"
              width="70px"
            /> */}
            {/* Commented this code for needed */}
            {/* <IconWrapper onClick={handleRefresh}>
              <MdOutlineRefresh color={ICON_COLOR} size={20} />
            </IconWrapper>*/}
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
            <IconWrapper
              disabled={deploying}
              onClick={handleDeploy}
              title="Deploy"
            >
              <GrDeploy color={ICON_COLOR} size={20} />
            </IconWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SubHeader);
