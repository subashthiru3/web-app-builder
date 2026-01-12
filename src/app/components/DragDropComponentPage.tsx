"use client";

import React, { useState } from "react";
import PropertiesPanel from "./PropertiesPanel";
import dynamic from "next/dynamic";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/* ----------------------------------------------------
   SAFE COMPONENTS (NO Prism dependency)
---------------------------------------------------- */
import {
  MWLButton,
  MWLCard,
  MWLAvatar,
  MWLChip,
  MWLBadge,
  MWLAlert,
  MWLTooltip,
  MWLDivider,
  MWLList,
  MWLStepper,
  MWLTransferList,
  MWLFileUploader,
  MWLTopNavbar,
  MWLSidebar,
  MWLFileList,
  MWLScrollSpy,
  MWLBreakPoints,
  MWLErrorBoundary,
  MWLLogin,
  MWLLoginBase,
  MWLOtpInput,
  MWLLogo,
  MWLSlidingPane,
  MWLThemes,
  MWLLayout,
  MWLMultiSelectAutocomplete,
} from "react-web-white-label";

/* ----------------------------------------------------
   BROWSER-ONLY (USES Prism INTERNALLY)
---------------------------------------------------- */
const MWLRichTextEditor = dynamic(
  () => import("react-web-white-label").then((m) => m.MWLRichTextEditor),
  { ssr: false }
);

const MWLPdfViewer = dynamic(
  () => import("react-web-white-label").then((m) => m.MWLPdfViewer),
  { ssr: false }
);

const MWLIconography = dynamic(
  () => import("react-web-white-label").then((m) => m.MWLIconography),
  { ssr: false }
);

const MWLImagePopupViewer = dynamic(
  () => import("react-web-white-label").then((m) => m.MWLImagePopupViewer),
  { ssr: false }
);

/* ----------------------------------------------------
   AVAILABLE COMPONENT REGISTRY
---------------------------------------------------- */
const availableComponents = [
  { name: "Button", component: MWLButton },
  { name: "Card", component: MWLCard },
  { name: "Avatar", component: MWLAvatar },
  { name: "Chip", component: MWLChip },
  { name: "Badge", component: MWLBadge },
  { name: "Alert", component: MWLAlert },
  { name: "Tooltip", component: MWLTooltip },
  { name: "Divider", component: MWLDivider },
  { name: "List", component: MWLList },
  { name: "Stepper", component: MWLStepper },
  { name: "TransferList", component: MWLTransferList },
  { name: "FileUploader", component: MWLFileUploader },
  { name: "TopNavbar", component: MWLTopNavbar },
  { name: "Sidebar", component: MWLSidebar },
  { name: "FileList", component: MWLFileList },
  { name: "ScrollSpy", component: MWLScrollSpy },
  { name: "RichTextEditor", component: MWLRichTextEditor },
  { name: "ImagePopupViewer", component: MWLImagePopupViewer },
  { name: "PdfViewer", component: MWLPdfViewer },
  { name: "Iconography", component: MWLIconography },
  { name: "BreakPoints", component: MWLBreakPoints },
  { name: "ErrorBoundary", component: MWLErrorBoundary },
  { name: "Login", component: MWLLogin },
  { name: "LoginBase", component: MWLLoginBase },
  { name: "OtpInput", component: MWLOtpInput },
  { name: "Logo", component: MWLLogo },
  { name: "SlidingPane", component: MWLSlidingPane },
  { name: "Themes", component: MWLThemes },
  { name: "Layout", component: MWLLayout },
  { name: "MultiSelectAutocomplete", component: MWLMultiSelectAutocomplete },
];

/* ----------------------------------------------------
   DND CONFIG
---------------------------------------------------- */
const ItemTypes = {
  COMPONENT: "component",
};

/* ----------------------------------------------------
   PALETTE ITEM
---------------------------------------------------- */
const PaletteItem = ({ item, index }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { ...item, index }, // Pass all properties of the component
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      style={{
        margin: "8px 0",
        padding: 8,
        background: isDragging ? "#e0e0e0" : "#f5f5f5",
        borderRadius: 4,
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item.name}
    </li>
  );
};

/* ----------------------------------------------------
   CANVAS
---------------------------------------------------- */
const gridStyles: any = {
  single: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  double: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  triple: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
  },
  freeform: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-start",
  },
};

const Canvas = ({
  droppedComponents,
  onDrop,
  onSelect,
  selectedIdx,
  layout,
}: any) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => drop(node as HTMLDivElement | null)}
      style={{
        flex: 1,
        minHeight: 400,
        border: "2px dashed #aaa",
        borderRadius: 8,
        padding: 16,
        background: isOver ? "#e3fcef" : "#fff",
        ...gridStyles[layout],
      }}
    >
      <div style={{ gridColumn: "1/-1", width: "100%" }}>
        <h3>
          Canvas ({layout.charAt(0).toUpperCase() + layout.slice(1)} Layout)
        </h3>
        {droppedComponents.length === 0 && <p>Drag a component here</p>}
      </div>
      {droppedComponents.map((item: any, idx: number) => {
        const Comp = item.component;
        const isSelected = selectedIdx === idx;
        return (
          <div
            key={idx}
            onClick={() => onSelect(idx)}
            style={{
              margin: layout === "freeform" ? 0 : "16px 0",
              padding: 8,
              background: isSelected ? "#e3fcef" : "#fff",
              borderRadius: 4,
              boxShadow: "0 1px 4px #eee",
              border: isSelected ? "2px solid #00b96b" : undefined,
              cursor: "pointer",
              minWidth: layout === "freeform" ? 220 : undefined,
              flex: layout === "freeform" ? "0 0 220px" : undefined,
              width: layout === "freeform" ? 220 : "auto",
            }}
          >
            <Comp {...(item.props || {})} />
          </div>
        );
      })}
    </div>
  );
};

/* ----------------------------------------------------
   MAIN PAGE
---------------------------------------------------- */
export default function DragDropComponentPage() {
  const [droppedComponents, setDroppedComponents] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [layout, setLayout] = useState<
    "single" | "double" | "triple" | "freeform"
  >("single");
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Export dropped components and layout as JSON
  const handleExportJson = () => {
    const exportData = {
      layout,
      components: droppedComponents.map((comp) => ({
        name: comp.name,
        props: comp.props || {},
      })),
    };
    setJsonText(JSON.stringify(exportData, null, 2));
    setJsonModalOpen(true);
    setJsonError("");
  };

  // Import dropped components and layout from JSON
  const handleImportJson = () => {
    try {
      const obj = JSON.parse(jsonText);
      if (!obj || typeof obj !== "object") throw new Error("JSON must be an object");
      if (!Array.isArray(obj.components)) throw new Error("Missing 'components' array");
      if (!obj.layout || !["single", "double", "triple", "freeform"].includes(obj.layout)) throw new Error("Invalid or missing 'layout'");
      // Map names to availableComponents
      const imported = obj.components.map((item) => {
        const found = availableComponents.find((c) => c.name === item.name);
        if (!found) throw new Error(`Component '${item.name}' not found`);
        return { ...found, props: item.props };
      });
      setDroppedComponents(imported);
      setLayout(obj.layout);
      setSelectedIdx(null);
      setJsonModalOpen(false);
      setJsonError("");
    } catch (e: any) {
      setJsonError(e.message || "Invalid JSON");
    }
  };

  // Now receives the full item object
  const handleDrop = (item: any) => {
    let defaultProps = {};
    if (item.component && item.component.defaultProps) {
      defaultProps = { ...item.component.defaultProps };
    } else {
      defaultProps = { label: item.name };
    }
    setDroppedComponents((prev) => [...prev, { ...item, props: defaultProps }]);
    setSelectedIdx(droppedComponents.length);
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (selectedIdx === null) return;
    setDroppedComponents((prev) =>
      prev.map((comp, idx) =>
        idx === selectedIdx
          ? { ...comp, props: { ...comp.props, [key]: value } }
          : comp
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", gap: 16, padding: 32 }}>
        {/* Available Components */}
        <div
          style={{
            width: 260,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <h3>Available Components</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {availableComponents.map((item, idx) => (
              <PaletteItem key={item.name} item={item} index={idx} />
            ))}
          </ul>
        </div>
        {/* Properties Panel */}
        <div
          style={{
            width: 260,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            minHeight: 400,
          }}
        >
          <PropertiesPanel
            properties={
              selectedIdx !== null && droppedComponents[selectedIdx]?.props
                ? droppedComponents[selectedIdx].props
                : {}
            }
            onChange={handlePropertyChange}
            type={
              selectedIdx !== null
                ? droppedComponents[selectedIdx]?.name
                : undefined
            }
          />
        </div>

        {/* Canvas + Layout Selector + Import/Export */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label htmlFor="layout-select" style={{ fontWeight: 500 }}>
                Grid Layout:
              </label>
              <select
                id="layout-select"
                value={layout}
                onChange={(e) => setLayout(e.target.value as any)}
                style={{ padding: 4, borderRadius: 4 }}
              >
                <option value="single">Single Column</option>
                <option value="double">Two Columns</option>
                <option value="triple">Three Columns</option>
                <option value="freeform">Freeform (Wrap)</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleExportJson}
                style={{ padding: "6px 12px", borderRadius: 4, background: "#00b96b", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Export JSON
              </button>
              <button
                onClick={() => { setJsonModalOpen(true); setJsonText(""); setJsonError(""); }}
                style={{ marginLeft: 8, padding: "6px 12px", borderRadius: 4, background: "#1677ff", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Import JSON
              </button>
            </div>
          </div>
          <Canvas
            droppedComponents={droppedComponents}
            onDrop={handleDrop}
            onSelect={setSelectedIdx}
            selectedIdx={selectedIdx}
            layout={layout}
          />
        </div>
      </div>

      {/* JSON Modal */}
      {jsonModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 12,
              minWidth: 400,
              boxShadow: "0 2px 16px #0002",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Import / Export JSON</h3>
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setJsonError("");
              }}
              rows={12}
              style={{
                width: "100%",
                fontFamily: "monospace",
                fontSize: 14,
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ccc",
                padding: 8,
              }}
              placeholder="Paste or view JSON here"
            />
            {jsonError && (
              <div style={{ color: "#d00", marginBottom: 8 }}>{jsonError}</div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleImportJson}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  background: "#1677ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Import & Preview
              </button>
              <button
                onClick={() => setJsonModalOpen(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  background: "#aaa",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
}
