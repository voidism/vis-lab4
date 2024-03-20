<style>
svg {
	max-width: 20em;
	margin-block: 2em;

	/* Do not clip shapes outside the viewBox */
	overflow: visible;
}

svg:has(path:hover) {
	path:not(:hover) {
		opacity: 50%;
	}
}

.selected {
	--color: oklch(60% 45% 0) !important;

	&:is(path) {
		fill: var(--color);
	}
}

path {
	transition: 300ms;
    cursor: pointer;
}

/* Style for the legend (ul) */
ul.legend {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7em, 1fr));
  gap: 1em; /* Adjust the gap between items */
  padding: 1em; /* Adds padding inside the legend */
  margin: 1em; /* Adds margin around the legend */
  border: 1px solid #ccc; /* Adds a border around the legend */
  list-style: none; /* Removes default list styling */
  border-radius: 8px; /* Optional: rounded corners for the border */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
}

/* Style for each list item (li) */
ul.legend li {
  display: flex;
  align-items: center; /* Vertically centers the swatch and label */
  gap: 0.5em; /* Spacing between swatch and label */
}

/* Style for the swatch (span) */
ul.legend .swatch {
  display: inline-block;
  width: 1em;
  height: 1em;
  aspect-ratio: 1 / 1;
  background-color: var(--color); /* Color variable for swatch */
  border-radius: 4px; /* Slight rounding of corners */
}

/* Style for the flex container */
.container {
  display: flex;
  align-items: center; /* Adjust vertical alignment as needed */
  gap: 1em; /* Spacing between the pie chart and legend */
}

/* Style for the legend within the container */
.container .legend {
  flex: 1; /* Allows the legend to take up available space */
}
</style>

<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2 * Math.PI
    });
    // let data = [
    //     { value: 1, label: "apples" },
    //     { value: 2, label: "oranges" },
    //     { value: 3, label: "mangos" },
    //     { value: 4, label: "pears" },
    //     { value: 5, label: "limes" },
    //     { value: 5, label: "cherries" }
    // ];
    export let data = [];
    let sliceGenerator = d3.pie().value(d => d.value);
    // make arcData and arcs reactive
    let arcData;
    $: arcData = sliceGenerator(data);
    let arcs;
    $: arcs = arcData.map(d => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    export let selectedIndex = -1;
</script>

<div class="container">
<svg viewBox="-50 -50 100 100">
    {#each arcs as arc, index}
        <path d={arc} fill={ colors(index) }
        class:selected={selectedIndex === index}
        on:click={e => selectedIndex = selectedIndex === index ? -1 : index} />
    {/each}
</svg>

<ul class="legend">
	{#each data as d, index}
		<li style="--color: { colors(index) }" class:selected={selectedIndex === index}>
			<span class="swatch"></span>
			{d.label} <em>({d.value})</em>
		</li>
	{/each}
</ul>

</div>