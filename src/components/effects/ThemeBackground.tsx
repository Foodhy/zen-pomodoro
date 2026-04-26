import React from "react";
import { useApp } from "../../context/AppContext";
import Meteors from "./Meteors";
import ParticlesSystem from "./ParticlesSystem";
import FlickeringGrid from "./FlickeringGrid";
import RetroGrid from "./RetroGrid";
import Sparkles from "./Sparkles";

const layerStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  overflow: "hidden",
};

export const ThemeBackground: React.FC = () => {
  const { settings } = useApp();

  switch (settings.theme) {
    case "meteor-shower":
      return (
        <div style={layerStyle} aria-hidden="true">
          <Meteors count={24} />
          <Sparkles
            colors={["#ffffff", "#a78bfa", "#60a5fa"]}
            sparkleCount={1}
            spawnInterval={900}
          />
        </div>
      );
    case "particle-network":
      return (
        <div style={layerStyle} aria-hidden="true">
          <ParticlesSystem
            count={90}
            color={{ r: 99, g: 102, b: 241 }}
            connectionDistance={140}
          />
        </div>
      );
    case "flicker-matrix":
      return (
        <div style={layerStyle} aria-hidden="true">
          <FlickeringGrid
            cellSize={22}
            gap={2}
            baseOpacity={0.05}
            maxOpacity={0.4}
            flickerChance={0.006}
            color={{ r: 16, g: 185, b: 129 }}
          />
        </div>
      );
    case "retro-wave":
      return (
        <div style={layerStyle} aria-hidden="true">
          {/* Solid dark sky base */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, #050018 0%, #0a0220 50%, #0d0428 100%)",
            }}
          />
          {/* Wide warm halo: bleeds around the card on both sides */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "20%",
              transform: "translate(-50%, -50%)",
              width: "180vw",
              height: "70vh",
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(244,114,182,0.55), rgba(236,72,153,0.35) 30%, rgba(168,85,247,0.25) 55%, transparent 80%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          {/* Distant stars across the sky */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: [
                "radial-gradient(1px 1px at 12% 8%, rgba(255,255,255,0.7) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 28% 14%, rgba(255,255,255,0.5) 0%, transparent 100%)",
                "radial-gradient(1.2px 1.2px at 47% 6%, rgba(255,255,255,0.7) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 63% 18%, rgba(255,255,255,0.4) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 81% 10%, rgba(255,255,255,0.6) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 92% 22%, rgba(255,255,255,0.5) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 5% 28%, rgba(255,255,255,0.4) 0%, transparent 100%)",
                "radial-gradient(1.2px 1.2px at 38% 30%, rgba(255,255,255,0.6) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 72% 32%, rgba(255,255,255,0.5) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 18% 42%, rgba(255,255,255,0.35) 0%, transparent 100%)",
                "radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,0.4) 0%, transparent 100%)",
              ].join(","),
              opacity: 0.85,
              maskImage: "linear-gradient(180deg, #000 0%, #000 50%, transparent 65%)",
              WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 50%, transparent 65%)",
            }}
          />
          {/* Synthwave sun: bright disc up high so it clears the timer card */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "12%",
              transform: "translate(-50%, -50%)",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 30%, #fde047 0%, #fb923c 35%, #ec4899 70%, #a855f7 100%)",
              boxShadow:
                "0 0 80px 20px rgba(244,114,182,0.55), 0 0 200px 60px rgba(168,85,247,0.4)",
              filter: "saturate(1.1)",
            }}
          />
          {/* Horizontal scanlines on the lower half of the sun */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "12%",
              transform: "translate(-50%, -50%)",
              width: 240,
              height: 240,
              borderRadius: "50%",
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent 0 12px, rgba(10,2,32,0.95) 12px 16px, transparent 16px 24px, rgba(10,2,32,0.85) 24px 30px, transparent 30px 44px, rgba(10,2,32,0.7) 44px 52px, transparent 52px 70px, rgba(10,2,32,0.55) 70px 80px)",
              maskImage:
                "radial-gradient(circle at 50% 30%, #000 60%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 30%, #000 60%, transparent 100%)",
              clipPath: "inset(50% 0 0 0)",
            }}
          />
          {/* Perspective grid floor */}
          <RetroGrid
            color="rgba(244,114,182,0.55)"
            size={56}
            speed={14}
            showGlow={false}
            horizonFadeColor="transparent"
          />
        </div>
      );
    default:
      return null;
  }
};

export default ThemeBackground;
