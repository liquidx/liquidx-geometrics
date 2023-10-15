<script>
  import { onMount } from "svelte";
  import GeometricsIndex from "./GeometricsIndex.svelte";
  import GeometricsViewer from "./GeometricsViewer.svelte";

  let selectedPieceId = null;
  let selectedPiece = null;

  const pieces = [
    {
      id: "grids-poly-001",
    },
    {
      id: "grids-quad-001a",
      base: "grids-quad-001",
      params: { countX: 16, countY: 16, cellVaryY: 1, cellVaryMag: 8 },
    },
    { id: "grids-square-001" },
    { id: "grids-quad-001" },
    {
      id: "grids-circle-002a",
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
    { id: "grids-triangle-002" },
    { id: "grids-circle-002" },
    { id: "grids-triangle-001" },
    { id: "grids-square-001" },
    { id: "grids-circle-001" },
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
    console.log(e.detail);
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
