import type { CSSProperties } from "react";

interface RetroGridProps {
  color?: string;
  size?: number;
  glowColor?: string;
  speed?: number;
  className?: string;
  horizonFadeColor?: string;
  showGlow?: boolean;
}

export function RetroGrid({
  color = "rgba(139,92,246,0.3)",
  size = 60,
  glowColor = "rgba(139,92,246,0.5)",
  speed = 12,
  className = "",
  horizonFadeColor,
  showGlow = true,
}: RetroGridProps) {
  const animationCSS = speed
    ? `@keyframes retro-scroll-bg{0%{transform:rotateX(55deg) translateY(0)}100%{transform:rotateX(55deg) translateY(${size}px)}}`
    : "";

  const sceneStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
  };

  const glowStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "120%",
    height: 300,
    background: `radial-gradient(ellipse 50% 80% at 50% 50%, ${glowColor}, transparent)`,
    opacity: 0.4,
    pointerEvents: "none",
    filter: "blur(40px)",
  };

  const wrapperStyle: CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
    overflow: "hidden",
    perspective: 400,
    perspectiveOrigin: "50% 0%",
  };

  const gridStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: "rotateX(55deg)",
    transformOrigin: "50% 0%",
    backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 1px, transparent 1px, transparent ${size}px), repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent ${size}px)`,
    backgroundSize: `${size}px ${size}px`,
    animation: speed ? `retro-scroll-bg ${speed}s linear infinite` : "none",
  };

  const horizonFadeStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    background: `linear-gradient(to bottom, ${horizonFadeColor ?? "hsl(var(--background))"} 0%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 1,
  };

  return (
    <div className={className} style={sceneStyle}>
      {animationCSS && <style>{animationCSS}</style>}
      {showGlow && <div style={glowStyle} />}
      <div style={wrapperStyle}>
        <div style={gridStyle} />
        {horizonFadeColor !== "transparent" && <div style={horizonFadeStyle} />}
      </div>
    </div>
  );
}

export default RetroGrid;
