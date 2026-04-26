import { useCallback, useEffect, useRef } from "react";

interface FlickeringGridProps {
  cellSize?: number;
  gap?: number;
  baseOpacity?: number;
  maxOpacity?: number;
  flickerChance?: number;
  color?: { r: number; g: number; b: number };
  className?: string;
}

interface Cell {
  x: number;
  y: number;
  opacity: number;
  target: number;
}

export function FlickeringGrid({
  cellSize = 24,
  gap = 2,
  baseOpacity = 0.06,
  maxOpacity = 0.35,
  flickerChance = 0.005,
  color = { r: 16, g: 185, b: 129 },
  className = "",
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const cellsRef = useRef<Cell[]>([]);
  const lerpSpeed = 0.04;

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(rect.width / (cellSize + gap));
    const rows = Math.ceil(rect.height / (cellSize + gap));

    const cells: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: c * (cellSize + gap),
          y: r * (cellSize + gap),
          opacity: baseOpacity + Math.random() * 0.03,
          target: baseOpacity,
        });
      }
    }
    cellsRef.current = cells;

    const w = rect.width;
    const h = rect.height;

    function animate() {
      ctx!.clearRect(0, 0, w, h);

      for (const cell of cellsRef.current) {
        if (Math.random() < flickerChance) {
          cell.target = baseOpacity + Math.random() * (maxOpacity - baseOpacity);
        }
        cell.opacity += (cell.target - cell.opacity) * lerpSpeed;
        cell.target += (baseOpacity - cell.target) * 0.01;

        ctx!.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${cell.opacity})`;
        ctx!.beginPath();
        ctx!.roundRect(cell.x, cell.y, cellSize, cellSize, 2);
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    cancelAnimationFrame(animRef.current);
    animate();
  }, [cellSize, gap, baseOpacity, maxOpacity, flickerChance, color]);

  useEffect(() => {
    setup();

    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(setup, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [setup]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block" }} />
    </div>
  );
}

export default FlickeringGrid;
