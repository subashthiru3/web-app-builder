import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { usePagesStore } from "@/lib/pagesStore";

const PageEditor = () => {
  const { pages, activePageId, setActivePage, updatePageName } =
    usePagesStore();

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === activePageId),
    [pages, activePageId],
  );
  const [editedPageNames, setEditedPageNames] = useState<
    Record<number, string>
  >({});
  const [editedDescription, setEditedDescription] = useState<
    Record<number, string>
  >({});

  if (!selectedPage) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="text.secondary">
          No page selected
        </Typography>
      </Box>
    );
  }

  const pageName = editedPageNames[selectedPage.id] ?? selectedPage.name;
  const description =
    editedDescription[selectedPage.id] ?? selectedPage.description;
  const trimmedName = pageName.trim();
  const isUnchanged = trimmedName === selectedPage.name;

  console.log("Rendering PageEditor, selectedPage:", description);

  const handleSave = () => {
    if (!trimmedName || isUnchanged) {
      return;
    }
    updatePageName(selectedPage.id, trimmedName);
    setEditedPageNames((prev) => {
      const next = { ...prev };
      delete next[selectedPage.id];
      return next;
    });
    setEditedDescription((prev) => {
      const next = { ...prev };
      delete next[selectedPage.id];
      return next;
    });
  };

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="subtitle1" fontWeight={600}>
        Page Details
      </Typography>

      <FormControl fullWidth size="small">
        <InputLabel id="page-editor-select-label">Page</InputLabel>
        <Select
          labelId="page-editor-select-label"
          value={activePageId}
          label="Page"
          onChange={(event) => setActivePage(Number(event.target.value))}
        >
          {pages.map((page) => (
            <MenuItem key={page.id} value={page.id}>
              {page.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Page Name"
        value={pageName}
        onChange={(event) =>
          setEditedPageNames((prev) => ({
            ...prev,
            [selectedPage.id]: event.target.value,
          }))
        }
        onBlur={handleSave}
        size="small"
        fullWidth
      />

      <TextField
        label="Description"
        value={description}
        multiline
        rows={4}
        onChange={(event) =>
          setEditedDescription((prev) => ({
            ...prev,
            [selectedPage.id]: event.target.value,
          }))
        }
        size="small"
        fullWidth
      />

      <TextField
        label="Page ID"
        value={String(selectedPage.id)}
        size="small"
        fullWidth
        slotProps={{ input: { readOnly: true } }}
      />

      {/* <TextField
        label="Components"
        value={String(pageComponentCount)}
        size="small"
        fullWidth
        slotProps={{ input: { readOnly: true } }}
      /> */}

      {/* <Button
        variant="contained"
        onClick={handleSave}
        disabled={!trimmedName || isUnchanged}
      >
        Update Page
      </Button> */}
    </Box>
  );
};

export default PageEditor;
