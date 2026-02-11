"use client";

import { useEffect, useState } from "react";

export function useLocalPreview() {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem("wab_components");
        setComponents(stored ? JSON.parse(stored) : []);
      } catch {
        setComponents([]);
      }
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return components;
}
