"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CanvasComponent } from "@/lib/types";
import { loadData } from "@/api";
import { CanvasComponentRenderer } from "@/AppBuilder/Canvas/CanvasComponentRenderer";

export default function PreviewClient() {
  const searchParams = useSearchParams();
  const project = searchParams?.get("project");

  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project) return;

    const load = async () => {
      try {
        // ⭐ Local preview fallback
        const local = localStorage.getItem("wab_components");

        if (local) {
          setComponents(JSON.parse(local));
          setLoading(false);
          return;
        }

        const res = await loadData(project);
        if (res) {
          const data: any = res.data;
          setComponents(data);
        } else {
          throw new Error("Failed to load");
        }

        // ⭐ Production / API preview
      } catch (err) {
        console.error(err);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [project]);

  if (!project) return <div>No project specified</div>;
  if (loading) return <div>Loading preview...</div>;

  return (
    <div style={{ padding: 32 }}>
      {components.length === 0 ? (
        <div>No components to preview</div>
      ) : (
        components.map((c) => (
          <CanvasComponentRenderer key={c.id} component={c} />
        ))
      )}
    </div>
  );
}
