import React from "react";
import { CanvasComponent } from "@/lib/types";
import { CanvasComponentRenderer } from "@/AppBuilder/CanvasComponentRenderer";

// 🔑 build-time JSON import
import pageJson from "@/runtime/page.json";

const PreviewPage = () => {
  const components = pageJson as CanvasComponent[];

  return (
    <div style={{ padding: 32 }}>
      {components.length === 0 ? (
        <div>No components to preview.</div>
      ) : (
        components.map((component) => (
          <div key={component.id} style={{ marginBottom: 16 }}>
            <CanvasComponentRenderer component={component} />
          </div>
        ))
      )}
    </div>
  );
};

export default PreviewPage;
