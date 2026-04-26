import { useEffect, useRef, useCallback } from "react";

interface SparklesProps {
  colors?: string[];
  sparkleCount?: number;
  spawnInterval?: number;
  className?: string;
}

export function Sparkles({
  colors = ["#ffd700", "#ffffff", "#00d4ff", "#ff9ff3", "#a78bfa"],
  sparkleCount = 2,
  spawnInterval = 600,
  className = "",
}: SparklesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const createSparkle = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const size = Math.random() * 14 + 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;

    const sparkle = document.createElement("span");
    sparkle.className = "sparkle-bg";
    sparkle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      animation: sparkle-bg-anim 1.2s ease-out forwards;
    `;
    sparkle.innerHTML = `
      <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}">
        <path d="M12 0l3.09 7.26L23 8.27l-5.46 5.04L18.82 21 12 17.27 5.18 21l1.28-7.69L1 8.27l7.91-1.01z"/>
      </svg>
    `;

    wrapper.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1200);
  }, [colors]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    for (let i = 0; i < sparkleCount * 3; i++) {
      setTimeout(() => createSparkle(), i * 80);
    }

    const interval = setInterval(() => {
      for (let i = 0; i < sparkleCount; i++) {
        createSparkle();
      }
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [createSparkle, sparkleCount, spawnInterval]);

  return (
    <>
      <style>{`
        @keyframes sparkle-bg-anim {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          30% { transform: scale(1) rotate(90deg); opacity: 1; }
          100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sparkle-bg { display: none !important; }
        }
      `}</style>
      <div
        ref={wrapperRef}
        className={className}
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
      />
    </>
  );
}

export default Sparkles;
