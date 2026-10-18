import { useEffect, useState } from "react";

const THRESHOLD_PX = 160;
const POLL_MS = 500;

/**
 * Best-effort DevTools open detection (docked size + console getter probe).
 * Cannot erase prior Network-tab YouTube requests — only triggers player lockdown.
 */
export function useDevToolsGuard(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let consoleOpen = false;

    const checkSize = () => {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      return widthGap > THRESHOLD_PX || heightGap > THRESHOLD_PX;
    };

    /** Fires when DevTools console materializes the object */
    const probe = new Image();
    Object.defineProperty(probe, "id", {
      get() {
        consoleOpen = true;
        return "";
      },
    });

    const tick = () => {
      if (cancelled) return;
      consoleOpen = false;
      // eslint-disable-next-line no-console
      console.log("%c", probe);
      // eslint-disable-next-line no-console
      console.clear?.();
      const detected = checkSize() || consoleOpen;
      setOpen((prev) => (prev === detected ? prev : detected));
    };

    tick();
    const id = window.setInterval(tick, POLL_MS);
    window.addEventListener("resize", tick);
    window.addEventListener("focus", tick);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("resize", tick);
      window.removeEventListener("focus", tick);
    };
  }, []);

  return open;
}
