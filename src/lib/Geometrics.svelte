<script lang="js">
  import { onMount } from "svelte";
  import GeometricsIndex from "./GeometricsIndex.svelte";
  import GeometricsViewer from "./GeometricsViewer.svelte";

  import gridsPoly001 from "./pieces/grids-poly-001.js";
  import gridsCircle001 from "./pieces/grids-circle-001.js";
  import gridsCircle002 from "./pieces/grids-circle-002.js";
  import gridsQuad001 from "./pieces/grids-quad-001.js";
  import gridsSquare001 from "./pieces/grids-square-001.js";
  import gridsTriangle001 from "./pieces/grids-triangle-001.js";
  import gridsTriangle002 from "./pieces/grids-triangle-002.js";

  let selectedPieceId = null;
  let selectedPiece = null;

  const pieces = [
    {
      id: "grids-poly-001",
      build: gridsPoly001,
    },
    {
      id: "grids-quad-001a",
      base: "grids-quad-001",
      build: gridsQuad001,
      params: { countX: 16, countY: 16, cellVaryY: 1, cellVaryMag: 8 },
    },
    { id: "grids-square-001", build: gridsSquare001 },
    { id: "grids-quad-001", build: gridsQuad001 },
    {
      id: "grids-circle-002a",
      build: gridsCircle002,
      base: "grids-circle-002",
      params: {
        spacing: 18,
        radiusMultiplier: 1.6,
        initialStrokes: 8,
        strokesMultiplier: 0,
        marginX: 60,
        marginY: 60,
      },
    },
    { id: "grids-triangle-002", build: gridsTriangle002 },
    { id: "grids-circle-002", build: gridsCircle002 },
    { id: "grids-triangle-001", build: gridsTriangle001 },
    { id: "grids-square-001", build: gridsSquare001 },
    { id: "grids-circle-001", build: gridsCircle001 },
  ];

  onMount(() => {
    const hash = window.location.hash;
    const pieceId = hash.replace("#", "");
    if (pieceId) {
      selectedPieceId = pieceId;
      selectedPiece = pieces.find((p) => p.id === selectedPieceId);
    }
  });

  const pieceDidSelect = (e) => {
    selectedPieceId = e.detail;
    selectedPiece = pieces.find((p) => p.id === selectedPieceId);
  };

  const indexDidSelect = () => {
    selectedPieceId = null;
    selectedPiece = null;
  };
</script>

{#if selectedPiece}
  <GeometricsViewer piece={selectedPiece} on:indexDidSelect={indexDidSelect} />
{:else}
  <GeometricsIndex {pieces} on:pieceDidSelect={pieceDidSelect} />
{/if}
