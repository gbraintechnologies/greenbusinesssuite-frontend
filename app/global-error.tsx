"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              'var(--font-sans), "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 480, padding: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Application error
            </h1>
            <p style={{ color: "#64748b", marginBottom: 24 }}>
              {error.message || "The app failed to load. Please refresh."}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
