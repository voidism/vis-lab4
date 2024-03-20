<script>
import projects from '$lib/projects.json';
import Project from '$lib/Project.svelte';
import Pie from '$lib/Pie.svelte';
import * as d3 from 'd3';

let query = "";

let filteredProjects;
$: filteredProjects = projects.filter(project => {
    if (!query) return true;
	let values = Object.values(project).join("\n").toLowerCase();
	return values.includes(query.toLowerCase());
});

let selectedYearIndex = -1;
let selectedYear;
$: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

let filteredByYear;
$: filteredByYear = selectedYear
    ? filteredProjects.filter(project => project.year === selectedYear)
    : filteredProjects;

//    console.log(the names in filteredByYear) every time selectedYear changes
$: console.log(filteredByYear.map(p => p.year));
//    console.log(the names in filteredByYear) every time selectedYear changes
$: console.log(filteredByYear.map(p => p.title));

let rolledData;
let pieData;

$: {
	// Initialize to an empty object every time this runs
	pieData = {};

	// Calculate rolledData and pieData based on filteredProjects here
    rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);
    pieData = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
}


</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<h1>{ projects.length } Projects</h1>

<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…" />

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />

<div class="projects">
    {#each filteredByYear as project}
        <Project info={ project }/>
    {/each}
</div>
