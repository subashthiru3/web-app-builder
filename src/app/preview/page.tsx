"use client";


import React, { useEffect, useState } from "react";
import { CanvasComponent } from "@/lib/types";
import { CanvasComponentRenderer } from "@/AppBuilder/Canvas/CanvasComponentRenderer";


const PreviewPage: React.FC = () => {
  const [components, setComponents] = useState<CanvasComponent[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem("wab_components");
        if (stored) setComponents(JSON.parse(stored));
        else setComponents([]);
      } catch {
        setComponents([]);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

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
