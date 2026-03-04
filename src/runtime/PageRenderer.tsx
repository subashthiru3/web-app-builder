"use client";

import { CanvasComponentRenderer } from "@/AppBuilder/Canvas/CanvasComponentRenderer";
import { CanvasComponent } from "@/lib/types";

type Props = {
  components: CanvasComponent[];
  emptyText?: string;
};

export default function PageRenderer({ components, emptyText }: Props) {
  if (!components || components.length === 0) {
    return <div>{emptyText || "No components"}</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      {components.map((c) => (
        <CanvasComponentRenderer key={c.id} component={c} />
      ))}
    </div>
  );
}
