"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CanvasComponentRenderer } from "@/AppBuilder/CanvasComponentRenderer";
import { CanvasComponent } from "@/lib/types";

export default function PreviewClient() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project");

  const [components, setComponents] = useState<CanvasComponent[]>([]);

  useEffect(() => {
    if (!project) return;

    fetch(`/runtime/${project}/page.json`)
      .then((res) => res.json())
      .then(setComponents)
      .catch(() => setComponents([]));
  }, [project]);

  if (!project) return <div>No project specified</div>;

  return (
    <div style={{ padding: 32 }}>
      {components.map((c) => (
        <CanvasComponentRenderer key={c.id} component={c} />
      ))}
    </div>
  );
}
