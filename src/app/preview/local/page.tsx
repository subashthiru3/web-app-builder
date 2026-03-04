"use client";
import PageRenderer from "@/runtime/PageRenderer";
import { useLocalPreview } from "@/runtime/useLocalPreview";

export default function LocalPreviewPage() {
  const components = useLocalPreview();

  return (
    <PageRenderer
      components={components}
      emptyText="No components to preview"
    />
  );
}
