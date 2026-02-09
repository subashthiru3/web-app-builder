import React, { FC, useState, useCallback, useMemo, memo } from "react";
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

type ClipboardAction = "copy" | "cut" | null;

// Constants
const ICON_COLOR = "#757575";
const DISABLED_COLOR = "#BDBDBD";
const PROJECT_NAME = "My Project";

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
  const [clipboardAction, setClipboardAction] = useState<ClipboardAction>(null);
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const exportJSON = useBuilderStore((state) => state.exportJSON);
  const importJSON = useBuilderStore((state) => state.importJSON);
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const selectedView = useBuilderStore((state) => state.selectedView);
  const setSelectedView = useBuilderStore((state) => state.setSelectedView);

  // Dialog state for preview/edit JSON
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  // Handler to open JSON dialog
  const handleOpenJsonDialog = useCallback(() => {
    setJsonText(exportJSON());
    setJsonError("");
    setJsonDialogOpen(true);
  }, [exportJSON]);

  // Handler to close JSON dialog
  const handleCloseJsonDialog = useCallback(() => {
    setJsonDialogOpen(false);
    setJsonError("");
  }, []);
  console.log("SubHeader rendered", jsonText);
  // Handler to save edited JSON
  const handleSaveJsonDialog = useCallback(() => {
    try {
      importJSON(jsonText);
      setJsonDialogOpen(false);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON");
    }
  }, [importJSON, jsonText]);

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
    const json = exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "components.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }, [exportJSON]);

  // Action handlers
  // Removed unused handleSettings

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Removed unused handleCopy

  // Removed unused handleCut

  // Removed unused handlePaste

  // Commented out refresh handler
  // const handleRefresh = useCallback(() => {
  //   console.log("Refresh clicked");
  //   window.location.reload();
  // }, []);

  // Removed unused handleSelectChange

  const handleSave = useCallback(() => {
    console.log("Save clicked");
  }, []);

  // Handler to open preview in new tab
  const handlePreview = useCallback(() => {
    window.open("/preview", "_blank");
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

  // Memoized values
  const isPasteEnabled = useMemo(
    () => clipboardAction !== null && copiedContent !== null,
    [clipboardAction, copiedContent],
  );

  // Removed unused iconStyle and pasteIconStyle

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
                      importJSON(json);
                    } catch {
                      alert("Invalid JSON file.");
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
            {/* Commented for suggestion */}
            {/* <IconWrapper onClick={handleClear}>
              <MdClearAll color={ICON_COLOR} size={20} />
            </IconWrapper> */}
            <IconWrapper onClick={handleSave} title="Save">
              <FaSave color={ICON_COLOR} size={20} />
            </IconWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SubHeader);
