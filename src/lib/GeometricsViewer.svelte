<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let piece;
  const dispatch = createEventDispatcher();

  let parentEl;

  onMount(async () => {
    let props = {};
    console.log(piece);
    let base = piece.base || piece.id;
    if (piece.params) {
      props = piece.params;
    }
    const viewer = (await import(`./pieces/${base}.js`)).default;
    viewer(parentEl, props);
  });
</script>

<div id="geometryControls">
  <a href="#" on:click={() => dispatch("indexDidSelect")}>back</a>
  <a href="#" id="share">share</a>
  <a href="#" id="capture">record</a>
</div>
<div id="canvasAndControls">
  <div id="container" bind:this={parentEl} />
  <div id="controls" />
</div>

<style>
  #canvasAndControls {
    display: flex;
    flex-wrap: wrap;
  }

  #container {
    margin-right: 2rem;
    margin-bottom: 2rem;
  }

  #controls {
    margin-left: 0;
  }
</style>
