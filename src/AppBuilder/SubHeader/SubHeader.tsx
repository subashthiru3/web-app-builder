import React, { FC, useState, useCallback, useMemo, memo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./SubHeader.css";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import RefreshIcon from "@mui/icons-material/Refresh";
import LaptopIcon from "@mui/icons-material/Laptop";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";
import IosShareIcon from "@mui/icons-material/IosShare";
import SaveIcon from "@mui/icons-material/Save";
// import Undo from "@/components/organisms/MWLRichTextEditor/TextEditor-Assests/undo";
// import Redo from "@/components/organisms/MWLRichTextEditor/TextEditor-Assests/redo";
import { MWLSelectField, MWLButton } from "react-web-white-label";

type ClipboardAction = "copy" | "cut" | null;

// Constants
const ICON_COLOR = "#757575";
const DISABLED_COLOR = "#BDBDBD";
const PROJECT_NAME = "My Project";

const VIEW_OPTIONS = [
  { id: "shrinktoview", title: "Shrink to View" },
  { id: "fullview", title: "Full View" },
  { id: "mobileview", title: "Mobile View" },
];

// Reusable icon wrapper component
const IconWrapper: FC<{
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = memo(({ onClick, disabled, children }) => (
  <div
    className={`icon-wrapper ${disabled ? "disabled" : ""}`}
    onClick={disabled ? undefined : onClick}
    style={{
      cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
    }}
  >
    {children}
  </div>
));

IconWrapper.displayName = "IconWrapper";

import { useBuilderStore } from "@/lib/store";

const SubHeader: FC = () => {
  const [clipboardAction, setClipboardAction] = useState<ClipboardAction>(null);
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const exportJSON = useBuilderStore((state) => state.exportJSON);
  const importJSON = useBuilderStore((state) => state.importJSON);

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

  // Handler to save edited JSON
  const handleSaveJsonDialog = useCallback(() => {
    try {
      importJSON(jsonText);
      setJsonDialogOpen(false);
      setJsonError("");
    } catch (err) {
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
  const handleClear = useCallback(() => {
    importJSON("[]");
  }, [importJSON]);
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
  const handleSettings = useCallback(() => {
    console.log("Settings clicked");
    // Add your settings logic here
  }, []);

  const handleUndo = useCallback(() => {
    console.log("Undo clicked");
    // Add your undo logic here
  }, []);

  const handleRedo = useCallback(() => {
    console.log("Redo clicked");
    // Add your redo logic here
  }, []);

  const handleCopy = useCallback(() => {
    console.log("Copy clicked");
    const selectedContent = "Selected content to copy"; // Replace with actual selection logic
    setCopiedContent(selectedContent);
    setClipboardAction("copy");
  }, []);

  const handleCut = useCallback(() => {
    console.log("Cut clicked");
    const cutContent = "Selected content to cut"; // Replace with actual selection logic
    setCopiedContent(cutContent);
    setClipboardAction("cut");
  }, []);

  const handlePaste = useCallback(() => {
    if (clipboardAction && copiedContent) {
      console.log("Paste clicked", {
        action: clipboardAction,
        content: copiedContent,
      });
      // Add your paste logic here
      if (clipboardAction === "cut") {
        setClipboardAction(null);
        setCopiedContent(null);
      }
    }
  }, [clipboardAction, copiedContent]);

  const handleRefresh = useCallback(() => {
    console.log("Refresh clicked");
    window.location.reload();
  }, []);

  const handleSelectChange = useCallback((value: string) => {
    console.log("Selected:", value);
  }, []);

  const handleSave = useCallback(() => {
    console.log("Save clicked");
  }, []);

  // Handler to open preview in new tab
  const handlePreview = useCallback(() => {
    window.open("/preview", "_blank");
  }, []);

  // Memoized values
  const isPasteEnabled = useMemo(
    () => clipboardAction !== null && copiedContent !== null,
    [clipboardAction, copiedContent],
  );

  const iconStyle = useMemo(() => ({ color: ICON_COLOR }), []);
  const pasteIconStyle = useMemo(
    () => ({
      color: isPasteEnabled ? ICON_COLOR : DISABLED_COLOR,
      transition: "color 0.2s ease-in-out",
    }),
    [isPasteEnabled],
  );

  return (
    <div className="mwl-subheader-container">
      <div className="mwl-subheader-assets">
        <div className="mwl-subheader-title">{PROJECT_NAME}</div>
        <div className="mwl-subheader-main-container">
          <div className="mwl-subheader-icons">
            <IconWrapper onClick={handleSettings}>
              <SettingsIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper onClick={handleUndo}>
              <SettingsIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper onClick={handleRedo}>
              <SettingsIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper onClick={handleCopy}>
              <ContentCopyIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper onClick={handleCut}>
              <ContentCutIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper onClick={handlePaste} disabled={!isPasteEnabled}>
              <ContentPasteIcon sx={pasteIconStyle} />
            </IconWrapper>
            <MWLSelectField
              options={VIEW_OPTIONS}
              size="small"
              selectChangeHandler={handleSelectChange}
              placeholder="Select option"
              width="70px"
            />
            <IconWrapper onClick={handleRefresh}>
              <RefreshIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper>
              <LaptopIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper>
              <TabletAndroidIcon sx={iconStyle} />
            </IconWrapper>
          </div>
          <div
            className="mwl-subheader-right-icons"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <IconWrapper onClick={handlePreview}>
              <RemoveRedEyeIcon sx={iconStyle} />
            </IconWrapper>
            <IconWrapper onClick={handleExportJSON}>
              <IosShareIcon sx={iconStyle} />
            </IconWrapper>
            <MWLButton
              text="Preview JSON"
              color="info"
              variant="outlined"
              handleClick={handleOpenJsonDialog}
              style={{ marginRight: 8 }}
            />
            <MWLButton
              text="Import JSON"
              color="info"
              variant="outlined"
              handleClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json,application/json";
                input.onchange = (e) => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const json = event.target?.result as string;
                      importJSON(json);
                    } catch (err) {
                      alert("Invalid JSON file.");
                    }
                  };
                  reader.readAsText(file);
                };
                input.click();
              }}
              style={{ marginRight: 8 }}
            />
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
            <MWLButton
              text="Clear"
              color="secondary"
              variant="outlined"
              handleClick={handleClear}
              style={{ marginRight: 8 }}
            />
            <MWLButton
              text="Save"
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              handleClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SubHeader);
