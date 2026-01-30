"use client";

import { useEffect, useState } from "react";
import { CanvasComponent } from "@/lib/types";
import { CanvasComponentRenderer } from "@/AppBuilder/CanvasComponentRenderer";

export default function ProjectPage({
  params,
}: {
  params: { project: string };
}) {
  const [components, setComponents] = useState<CanvasComponent[]>([]);

  useEffect(() => {
    fetch(`/runtime/${params.project}/page.json`)
      .then((res) => res.json())
      .then(setComponents)
      .catch(() => setComponents([]));
  }, [params.project]);

  return (
    <div style={{ padding: 32 }}>
      {components.map((component) => (
        <CanvasComponentRenderer key={component.id} component={component} />
      ))}
    </div>
  );
}
