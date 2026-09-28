"use client";

import { useEffect, useState } from "react";
import { isLite, LITE_EVENT } from "./perf";

/**
 * True when the page runs in lite mode (slower machines). Updates if lite
 * mode is switched on while the page is open, so scenes can rebuild lighter.
 */
export function useLite() {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    // The class is set before hydration; read it once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLite(isLite());
    const on = () => setLite(true);
    window.addEventListener(LITE_EVENT, on);
    return () => window.removeEventListener(LITE_EVENT, on);
  }, []);
  return lite;
}
