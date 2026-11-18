import type React from "react";

interface BrandProps {
  className?: string;
  size?: number;
}

/**
 * Velum Brand Mark: An elegant, origami-faceted manuscript leaf and pen-nib symbol.
 * Built with pure SVG geometric vectors to look crisp at 16px, 24px, 32px, 48px, and 64px.
 */
export function VelumMark({ className = "size-8", size }: BrandProps) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="velum-grad-primary" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="velum-grad-accent" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C47335" />
          <stop offset="100%" stopColor="#9B4B18" />
        </linearGradient>
      </defs>
      {/* Outer Folio Shield / Paper Leaf */}
      <path
        d="M24 4L39 12.5V35.5L24 44L9 35.5V12.5L24 4Z"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Faceted Manuscript Fold - Left Wing */}
      <path
        d="M24 4L9 12.5V35.5L24 28V4Z"
        fill="url(#velum-grad-primary)"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Central Nib Axis & Geometry */}
      <path
        d="M24 4V28M24 28L16 23.5M24 28L32 23.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pen Tip / Precision Diamond */}
      <path
        d="M24 28L28 34L24 40L20 34L24 28Z"
        fill="var(--primary)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Slit Breather Hole */}
      <circle cx="24" cy="22" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Velum Wordmark with customizable display styling.
 */
export function VelumWordmark({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-1.5 font-serif font-semibold tracking-[-0.02em] text-foreground leading-none">
        <span className="text-lg sm:text-xl tracking-tight">Velum</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-sans font-medium text-[10px] text-primary uppercase tracking-wider">
          Studio
        </span>
      </div>
      {showTagline && (
        <span className="font-sans text-[11px] text-muted-foreground tracking-normal">
          Scholarly LaTeX Workspace
        </span>
      )}
    </div>
  );
}
