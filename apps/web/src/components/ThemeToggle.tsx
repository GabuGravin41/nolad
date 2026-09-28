"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nolad-theme") as Theme | null;
      if (saved) setTheme(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  function cycle() {
    const next: Theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    apply(next);
    try {
      localStorage.setItem("nolad-theme", next);
    } catch {
      /* storage unavailable */
    }
  }

  const label = theme === "system" ? "Auto" : theme === "light" ? "Light" : "Dark";
  return (
    <button
      type="button"
      onClick={cycle}
      className="chip cursor-pointer"
      aria-label={`Colour theme: ${label}. Click to change.`}
      title="Colour theme"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
      </svg>
      {label}
    </button>
  );
}

/** Inline script run before paint to avoid a flash of the wrong theme. */
export const themeScript = `(function(){try{var t=localStorage.getItem('nolad-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
