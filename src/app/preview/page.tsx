"use client";
import PageRenderer from "@/app/preview/PageRenderer";
import { useLocalPreview } from "@/hooks/useLocalPreview";

export default function LocalPreviewPage() {
  const components = useLocalPreview();

  return (
    <PageRenderer
      components={components}
      emptyText="No components to preview"
    />
  );
}
