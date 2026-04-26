import { useMemo } from "react";

interface MeteorsProps {
  count?: number;
  minDuration?: number;
  maxDuration?: number;
  minLength?: number;
  maxLength?: number;
  className?: string;
}

interface MeteorData {
  top: number;
  left: number;
  duration: number;
  delay: number;
  length: number;
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateMeteors(
  count: number,
  minDuration: number,
  maxDuration: number,
  minLength: number,
  maxLength: number
): MeteorData[] {
  return Array.from({ length: count }, () => ({
    top: randomRange(-10, 80),
    left: randomRange(10, 110),
    duration: randomRange(minDuration, maxDuration),
    delay: randomRange(0, 10),
    length: randomRange(minLength, maxLength),
  }));
}

const meteorKeyframes = `
  @keyframes meteorFall {
    0% { opacity: 0; transform: rotate(215deg) translateX(0); }
    5% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; transform: rotate(215deg) translateX(-120vh); }
  }
`;

export function Meteors({
  count = 20,
  minDuration = 2,
  maxDuration = 6,
  minLength = 80,
  maxLength = 200,
  className = "",
}: MeteorsProps) {
  const meteors = useMemo(
    () => generateMeteors(count, minDuration, maxDuration, minLength, maxLength),
    [count, minDuration, maxDuration, minLength, maxLength]
  );

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <style>{meteorKeyframes}</style>
      {meteors.map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: m.length,
            height: 1,
            borderRadius: 999,
            transform: "rotate(215deg)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(148,163,184,0.3) 20%, rgba(255,255,255,0.8) 100%)",
            animation: `meteorFall ${m.duration}s linear infinite`,
            animationDelay: `${m.delay}s`,
            opacity: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 0 6px 2px rgba(255,255,255,0.8), 0 0 12px 4px rgba(148,163,184,0.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              width: "60%",
              height: 3,
              borderRadius: 999,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.08) 40%, rgba(255,255,255,0.15) 100%)",
              filter: "blur(1px)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Meteors;
