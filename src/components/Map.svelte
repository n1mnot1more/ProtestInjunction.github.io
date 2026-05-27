<script>
import { base } from "$app/paths";
  import * as d3 from "d3";
  import * as topojson from "topojson-client";
  import { onMount } from "svelte";

  let canvas;
  let hoverCanvas;
  let hitCanvas;
  let wardHitCanvas;

  let context;
  let hoverContext;
  let hitContext;
  let wardHitContext;

  let path;
  let hitPath;
  let wardHitPath;

  let wards;
  let lads;
  let engwal;

  let hovered = $state(null);
  let hoveredWard = $state(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  let width;
  let height;
  let dpi;

  let pendingHovered = null;
  let pendingHoveredWard = null;
  let hoverTimeout;

  const colorToLad = new Map();
  const colorToWard = new Map();

  const colorScale = d3.scaleThreshold()
    .domain([0.0001, 5, 20, 100, 300, 500, 1300])
    .range([
      "#0a061b",
      "#61187a",
      "#b0349a",
      "#e04d79",
      "#fd842b",
      "#fec083",
      "#fcfd4f"
    ]);

  function drawBaseMap() {
    context.clearRect(0, 0, width, height);

    wards.features.forEach((feature) => {
      context.beginPath();
      path(feature);
      context.fillStyle = colorScale(
        +feature.properties.total_covered_area_ha || 0
      );
      context.fill();
    });

    context.beginPath();
    path(engwal);
    context.strokeStyle = "#262235";
    context.lineWidth = 2;
    context.stroke();
  }

function drawHover() {

  hoverContext.clearRect(
    0,
    0,
    width,
    height
  );

  // WARD OUTLINE (thin)
  if (hoveredWard) {

    hoverContext.beginPath();

    path.context(hoverContext)(hoveredWard);

    hoverContext.strokeStyle = "#ffffff";

    hoverContext.lineWidth = 0.45;

    hoverContext.globalAlpha = 0.9;

    hoverContext.stroke();
  }

  // LAD OUTLINE (thicker)
  if (hovered) {

    hoverContext.beginPath();

    path.context(hoverContext)(hovered);

    hoverContext.strokeStyle = "#ffffff";

    hoverContext.lineWidth = 1.2;

    hoverContext.globalAlpha = 1;

    hoverContext.stroke();
  }

  // reset
  hoverContext.globalAlpha = 1;
}

  function buildLadHitMap() {
    hitContext.clearRect(0, 0, width, height);

    lads.features.forEach((feature, i) => {
      const r = (i + 1) & 255;
      const g = ((i + 1) >> 8) & 255;
      const b = ((i + 1) >> 16) & 255;
      const color = `rgb(${r},${g},${b})`;

      colorToLad.set(`${r},${g},${b}`, feature);

      hitContext.beginPath();
      hitPath(feature);
      hitContext.fillStyle = color;
      hitContext.fill();

      hitContext.strokeStyle = color;
      hitContext.lineWidth = 2;
      hitContext.lineJoin = "round";
      hitContext.lineCap = "round";
      hitContext.stroke();
    });

    console.log("LAD hit map built:", lads.features.length, "features");
  }

  function buildWardHitMap() {
    wardHitContext.clearRect(0, 0, width, height);

    wards.features.forEach((feature, i) => {
      const r = (i + 1) & 255;
      const g = ((i + 1) >> 8) & 255;
      const b = ((i + 1) >> 16) & 255;
      const color = `rgb(${r},${g},${b})`;

      colorToWard.set(`${r},${g},${b}`, feature);

      wardHitContext.beginPath();
      wardHitPath(feature);           // <-- was hitPath, now wardHitPath
      wardHitContext.fillStyle = color;
      wardHitContext.fill();

      wardHitContext.strokeStyle = color;
      wardHitContext.lineWidth = 2;
      wardHitContext.lineJoin = "round";
      wardHitContext.lineCap = "round";
      wardHitContext.stroke();
    });

    console.log("Ward hit map built:", wards.features.length, "features");
  }

  function getFeatureAtPoint(x, y, ctx, colorMap) {
    const radius = 3;
    const size = radius * 2 + 1;

    const px = Math.round(x * dpi);
    const py = Math.round(y * dpi);

    const data = ctx.getImageData(
      px - radius,
      py - radius,
      size,
      size
    ).data;

    const counts = new Map();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r === 0 && g === 0 && b === 0) continue;
      const key = `${r},${g},${b}`;
      const feature = colorMap.get(key);
      if (!feature) continue;
      counts.set(feature, (counts.get(feature) || 0) + 1);
    }

    if (counts.size === 0) return null;

    let best = null, bestCount = 0;
    for (const [feature, count] of counts) {
      if (count > bestCount) {
        best = feature;
        bestCount = count;
      }
    }

    return best;
  }

  onMount(async () => {
    const mobile = window.innerWidth < 900;

    width = mobile ? window.innerWidth : window.innerWidth * 0.6;
const legendHeight = 72;

height = mobile
  ? window.innerHeight
  : window.innerHeight - legendHeight;
    dpi = window.devicePixelRatio || 1;


const topo = await d3.json(`${base}/wards.topo.json`);
wards = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]);

const ladTopo = await d3.json(`${base}/lads.topo.json`);
lads = topojson.feature(ladTopo, ladTopo.objects[Object.keys(ladTopo.objects)[0]]);

const engwalTopo = await d3.json(`${base}/engwal.topo.json`);
engwal = topojson.feature(engwalTopo, engwalTopo.objects[Object.keys(engwalTopo.objects)[0]]);

    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitExtent([[15, 15], [width - 15, height - 15]], wards);

    // MAIN CANVAS
    canvas.width = width * dpi;
    canvas.height = height * dpi;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context = canvas.getContext("2d");
    context.setTransform(dpi, 0, 0, dpi, 0, 0);

    // HOVER CANVAS
    hoverCanvas.width = width * dpi;
    hoverCanvas.height = height * dpi;
    hoverCanvas.style.width = `${width}px`;
    hoverCanvas.style.height = `${height}px`;
    hoverContext = hoverCanvas.getContext("2d");
    hoverContext.setTransform(dpi, 0, 0, dpi, 0, 0);

    // LAD HIT CANVAS
    hitCanvas.width = width * dpi;
    hitCanvas.height = height * dpi;
    hitContext = hitCanvas.getContext("2d");
    hitContext.imageSmoothingEnabled = false;
    hitContext.setTransform(dpi, 0, 0, dpi, 0, 0);

    // WARD HIT CANVAS
    wardHitCanvas.width = width * dpi;
    wardHitCanvas.height = height * dpi;
    wardHitContext = wardHitCanvas.getContext("2d");
    wardHitContext.imageSmoothingEnabled = false;
    wardHitContext.setTransform(dpi, 0, 0, dpi, 0, 0);

    // PATHS — each bound to its own context
    path = d3.geoPath(projection, context);
    hitPath = d3.geoPath(projection, hitContext);
    wardHitPath = d3.geoPath(projection, wardHitContext);

    buildLadHitMap();
    buildWardHitMap();
    drawBaseMap();

    canvas.addEventListener("mousemove", (e) => {
      const bounds = canvas.getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * width;
      const y = ((e.clientY - bounds.top) / bounds.height) * height;

      tooltipX = e.clientX - bounds.left;
      tooltipY = e.clientY - bounds.top;

      const nextLad = getFeatureAtPoint(x, y, hitContext, colorToLad);
      const nextWard = getFeatureAtPoint(x, y, wardHitContext, colorToWard);

      if (nextLad === hovered && nextWard === hoveredWard) return;

      pendingHovered = nextLad;
      pendingHoveredWard = nextWard;
      clearTimeout(hoverTimeout);

      hoverTimeout = setTimeout(() => {
        hovered = pendingHovered;
        hoveredWard = pendingHoveredWard;
        requestAnimationFrame(drawHover);
      }, 12);
    });

    canvas.addEventListener("mouseleave", () => {
      hovered = null;
      hoveredWard = null;
      pendingHovered = null;
      pendingHoveredWard = null;
      clearTimeout(hoverTimeout);
      requestAnimationFrame(drawHover);
    });

canvas.style.cursor = "crosshair";
  });

  const wardName = $derived(hoveredWard?.properties?.WARD_Name ?? null);
  const total_covered_area_ha = $derived(
    hoveredWard?.properties?.total_covered_area_ha != null
      ? hoveredWard.properties.total_covered_area_ha
      : null
  );
  const tipLeft = $derived(tooltipX + 20);
  const tipTop = $derived(tooltipY - 10);
</script>

<div class="map-wrap">
  <canvas bind:this={canvas} class="base" />
  <canvas bind:this={hoverCanvas} class="hover" />
  <canvas bind:this={hitCanvas} style="display:none;" />
  <canvas bind:this={wardHitCanvas} style="display:none;" />


  <!-- TOOLTIP -->
  {#if hoveredWard}
    <div
      class="tooltip"
      style="left:{tipLeft}px; top:{tipTop}px;"
    >
      <div>
        {hoveredWard.properties.WARD_Name}
      </div>

      <div>
        in
        {hovered?.properties?.LAD25NM ?? "Unknown LAD"}
      </div>

      <div>
        {total_covered_area_ha ?? "?"}
        hectares injuncted.
      </div>
    </div>
  {/if}
</div>




<style>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.base  { z-index: 1; }
.hover { z-index: 2; pointer-events: none; }

.tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  color: #ffffff;
  font-size: 0.9rem;
  font-family: inherit;
  white-space: nowrap;
  text-shadow:
    0 1px 3px rgba(0,0,0,0.8),
    0 0 8px rgba(0,0,0,0.6);
}

</style>