// src/components/HeaderPortal.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function HeaderPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const portalTarget = document.getElementById("custom-header-portal");
  
  if (!portalTarget) return null;

  return createPortal(children, portalTarget);
}