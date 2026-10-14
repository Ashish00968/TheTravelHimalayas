import mapboxgl from "mapbox-gl";

/**
 * Creates a zero-DOM, GPU-accelerated animated canvas pulsing beacon.
 * Renders an expanding translucent radar ripple ring and a solid core
 * directly onto Mapbox GL's WebGL canvas without triggering browser DOM layout recalculations.
 *
 * @param map Mapbox map instance
 * @param size Canvas size in pixels (default 80)
 * @param color Hex or rgba color for the ripple and stroke (default #22D3EE)
 * @param coreColor Hex or rgba color for the inner solid circle (default #FFFFFF)
 * @param durationMs Duration of one full pulse cycle in milliseconds (default 1800ms)
 */
export function registerPulsingBeacon(
  map: mapboxgl.Map,
  imageId: string,
  options: {
    size?: number;
    color?: string;
    coreColor?: string;
    durationMs?: number;
  } = {}
) {
  if (map.hasImage(imageId)) return;

  const size = options.size ?? 80;
  const color = options.color ?? "#22D3EE";
  const coreColor = options.coreColor ?? "#FFFFFF";
  const durationMs = options.durationMs ?? 1800;

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;

  const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    onAdd: function () {
      canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      ctx = canvas.getContext("2d", { willReadFrequently: true });
    },

    render: function (): boolean {
      if (!ctx || !canvas) return false;

      const t = (performance.now() % durationMs) / durationMs;

      const innerRadius = (size / 2) * 0.28;
      const outerRadius = (size / 2) * 0.72 * t + innerRadius;

      ctx.clearRect(0, 0, size, size);

      // Outer expanding radar pulse ring
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, Math.max(0, 1 - t) * 0.45);
      ctx.fill();

      // Middle crisp expanding ring edge
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, Math.max(0, 1 - t) * 0.75);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner solid core circle
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreColor;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Read back pixel data for Mapbox texture
      const imageData = ctx.getImageData(0, 0, size, size);
      this.data.set(imageData.data);

      map.triggerRepaint();
      return true;
    },
  };

  try {
    map.addImage(imageId, pulsingDot, { pixelRatio: 2 });
  } catch {
    // Graceful fallback if style is reloading
  }
}

function hexToRgba(hex: string, alpha: number): string {
  if (hex.startsWith("rgba") || hex.startsWith("rgb")) {
    return hex;
  }
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}
