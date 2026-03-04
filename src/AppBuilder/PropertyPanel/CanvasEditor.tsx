import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";


import { useBuilderStore } from "@/lib/store";


const CanvasEditor = () => {
  const canvasSettings = useBuilderStore((state) => state.canvasSettings);
  const setCanvasSettings = useBuilderStore((state) => state.setCanvasSettings);

  // Handler for grid property changes
  const handleGridPropertyChange = (property: string, value: any) => {
    setCanvasSettings({ [property]: value });
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Grid
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Columns</InputLabel>
            <Select
              value={canvasSettings.columns}
              label="Columns"
              onChange={(e) =>
                handleGridPropertyChange("columns", Number(e.target.value))
              }
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Width</InputLabel>
            <Select
              value={canvasSettings.width}
              label="Width"
              onChange={(e) =>
                handleGridPropertyChange("width", e.target.value)
              }
            >
              <MenuItem value="Fill">Fill</MenuItem>
              <MenuItem value="Auto">Auto</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </div> */}
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <TextField
            label="Padding"
            size="small"
            fullWidth
            value={canvasSettings.padding}
            onChange={(e) =>
              handleGridPropertyChange("padding", e.target.value)
            }
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <TextField
            label="Background Color"
            size="small"
            fullWidth
            type="color"
            value={canvasSettings.backgroundColor}
            onChange={(e) =>
              handleGridPropertyChange("backgroundColor", e.target.value)
            }
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <FormControlLabel
            control={
              <Switch
                checked={canvasSettings.border}
                onChange={(e) =>
                  handleGridPropertyChange("border", e.target.checked)
                }
              />
            }
            label="Border"
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <TextField
            label="Border Color"
            size="small"
            fullWidth
            type="color"
            value={canvasSettings.borderColor}
            disabled={!canvasSettings.border}
            onChange={(e) =>
              handleGridPropertyChange("borderColor", e.target.value)
            }
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <TextField
            label="Border Size"
            size="small"
            fullWidth
            value={canvasSettings.borderSize}
            disabled={!canvasSettings.border}
            onChange={(e) =>
              handleGridPropertyChange("borderSize", e.target.value)
            }
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <TextField
            label="Border Radius"
            size="small"
            fullWidth
            value={canvasSettings.borderRadius}
            onChange={(e) =>
              handleGridPropertyChange("borderRadius", e.target.value)
            }
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <FormControlLabel
            control={
              <Switch
                checked={canvasSettings.shadow}
                onChange={(e) =>
                  handleGridPropertyChange("shadow", e.target.checked)
                }
              />
            }
            label="Shadow"
          />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 180 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Visibility</InputLabel>
            <Select
              value={canvasSettings.visibility}
              label="Visibility"
              onChange={(e) =>
                handleGridPropertyChange("visibility", e.target.value)
              }
            >
              <MenuItem value="100%">100 %</MenuItem>
              <MenuItem value="75%">75 %</MenuItem>
              <MenuItem value="50%">50 %</MenuItem>
              <MenuItem value="25%">25 %</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </Box>
  );
};

export default CanvasEditor;
