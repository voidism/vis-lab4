<svelte:head>
	<title>Meta</title>
</svelte:head>

<style>
    /* dl {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto auto;
    }
    dt {
        grid-row: 1;
    }
    dd {
        grid-row: 2;
    } */
    /* Additional styling */
    dl {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-gap: 20px;
        background: #f4f4f4;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: auto;
        max-width: 900px;
    }
    dt {
        font-size: 1.1em;
        color: #333;
        font-weight: bold;
    }
    dd {
        font-size: 1.5em;
        color: #0077cc;
        text-align: right;
        margin: 0;
    }
    dt, dd {
        padding: 5px 0;
    }
    /* Additional styling */
    svg {
        overflow: visible;
    }

    text {
        font-size: 10px;
    }

    .gridlines {
        stroke-opacity: 0.2;
    }
    .gridlines line {
        stroke: var(--gridline-color);
    }

    .info {
        display: grid;
        grid-template-columns: max-content max-content;
        column-gap: 1em;
        row-gap: 0.5em;
        margin: 0;
        /* Add other styling as needed */
    }

    .info dt {
        font-weight: bold;
        color: #666;
        font-size: 1.0em;
    }

    .info dd {
        font-size: 1.0em;
        color: #939494;
        text-align: right;
        margin: 0;
    }

    .tooltip {
        position: fixed;
        top: 1em;
        left: 1em;
        /* Add other styling as needed */
        background-color: oklch(100% 0% 0 / 80%); /* Semi-transparent white */
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Soft shadow for elevation */
        border-radius: 8px; /* Rounded corners */
        padding: 10px; /* Spacing inside the tooltip */
        backdrop-filter: blur(4px); /* Frosted glass effect */
    }

    circle {
        transition: 200ms;
        fill: steelblue;
    }

    circle:hover {
        transform: scale(1.5);
        fill: rgb(17, 189, 198);
    }
    /* if the class of a circle is `selected`, change the fill color to red */
    circle.selected {
        fill: red;
    }

    dl.info {
	/* ... other styles ... */
	transition-duration: 500ms;
	transition-property: opacity, visibility;

	&[hidden]:not(:hover, :focus-within) {
		opacity: 0;
		visibility: hidden;
	}
}

</style>

<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import Pie from "$lib/Pie.svelte";

    let data = [];
    let commits = [];
    let numberOfFiles;
    let totalLOC;
    let maxDepth;
    let longestLine;
    let fileWithMaxLines;
    let width = 1000, height = 600;
    let margin = { top: 10, right: 10, bottom: 30, left: 20 };
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    let yAxisGridlines;
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    let xScale, yScale, xAxis, yAxis;
    let svg;
    onMount(async () => {
        // data = await d3.csv("loc.csv");
        data = await d3.csv("loc.csv", row => ({
            ...row,
            line: Number(row.line), // or just +row.line
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));
        // console.log(data);
        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/vis-society/lab-7/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length
            };
    
            // Like ret.lines = lines
            // but non-enumerable so it doesn’t show up in JSON.stringify
            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });
    
            return ret;
        });

        if (commits.length > 0) {
            xScale = d3.scaleTime()
                .domain(d3.extent(commits, d => d.datetime))
                .range([usableArea.left, usableArea.right])
                .nice();

            yScale = d3.scaleLinear()
                .domain([0, 24])
                .range([usableArea.bottom, usableArea.top]);
        }

        console.log(commits)

        // Total number of unique files
        numberOfFiles = d3.groups(data, d => d.file).length;

        // Total lines of code
        totalLOC = data.length;

        // Maximum depth
        maxDepth = d3.max(data, d => d.depth);

        // Longest line
        longestLine = d3.max(data, d => d.length);

        // File with maximum lines
        let fileGroups = d3.groups(data, d => d.file);
        let maxLineFileGroup = d3.max(fileGroups, group => group[1].length);
        fileWithMaxLines = maxLineFileGroup ? maxLineFileGroup[0] : null;
    });

    
    $: {
        if (xScale && yScale) {
            d3.select(xAxis).call(d3.axisBottom(xScale));
            d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
        }

        if (yScale && yAxisGridlines) {
            d3.select(yAxisGridlines).call(
                d3.axisLeft(yScale)
                    .tickFormat("")
                    .tickSize(-usableArea.width)
            );
        }
    }

    let hoveredIndex = -1;
    $: hoveredCommit = commits[hoveredIndex] ?? {};


    $: if (svg) {
        // const brush = d3.brush()
        //     .on("end", brushended); // Define brushended function to handle brush events
        
        // d3.select(svg).call(brush);
        d3.select(svg).call(d3.brush().on("end", brushed));
        
        // Raise the dots and other necessary elements
        d3.select(svg).selectAll(".dots, .overlay ~ *").raise();

    }


    // $: d3.select(svg).call(d3.brush());
    $: brushSelection = null;

    function brushed (evt) {
        brushSelection = evt.selection;
        console.log(evt);
    }

    function isCommitSelected(commit) {
        if (!brushSelection) {
            return false;
        }
        // console.log(brushSelection);
        const [[x0, y0], [x1, y1]] = brushSelection;
        const x = xScale(commit.datetime);
        const y = yScale(commit.hourFrac);
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;

    }

    $: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    $: console.log(selectedCommits);
    $: hasSelection = brushSelection && selectedCommits.length > 0;
    $: console.log(hasSelection);
    $: selectedLines = (hasSelection ? selectedCommits : commits).flatMap(d => d.lines);
    $: console.log(selectedLines);
    
    // $: languageBreakdown = rollup(selectedLines, lines => lines.length, line => line.type); -> is wrong
    let languageBreakdown;
    $: languageBreakdown = d3.rollups(selectedLines, v => v.length, d => d.type);
    $: console.log(languageBreakdown);
    $: pieChartData = Array.from(languageBreakdown).map(([language, lines]) => ({
        label: language, // Function to convert language to a readable label
        value: lines
    }));
</script>

<h1>Meta</h1>

<p>This is a meta page.</p>
<p>{hasSelection ? selectedCommits.length : "No"} commits selected</p>


<!-- if hasSelection is true, show the following -->
{#if hasSelection}
    <dl>
        {#each languageBreakdown as [language, count]}
            <dt>{language}</dt>
            <dd>{count}</dd>
        {/each}
    </dl>
{/if}


<svg bind:this={svg} viewBox="0 0 {width} {height}">
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis}></g>
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis}></g>
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />



    <!-- <g class="dots">
        {#each commits as commit}
            <circle
                cx={xScale(commit.datetime)}
                cy={yScale(commit.hourFrac)}
                r="5"
                fill="steelblue"
            />
        {/each}
    </g> -->

    <g class="dots">
        {#each commits as commit, index}
            <circle
                class:selected={isCommitSelected(commit)}
                cx={xScale(commit.datetime)}
                cy={yScale(commit.hourFrac)}
                r="5"
                on:mouseenter={() => hoveredIndex = index}
                on:mouseleave={() => hoveredIndex = -1}
                style="transform-origin: center; transform-box: fill-box; transition: 200ms;"
            />
        {/each}
    </g>

</svg>

<Pie data={pieChartData} />

<dl class="info tooltip" hidden={hoveredIndex === -1}>
    <dt>Commit</dt>
    <dd><a href="{hoveredCommit.url}" target="_blank">{hoveredCommit.id}</a></dd>

    <dt>Date</dt>
    <dd>{hoveredCommit.datetime?.toLocaleDateString()}</dd>
    <dt>Time</dt>
    <dd>{hoveredCommit.datetime?.toLocaleTimeString()}</dd>
    <dt>Author</dt>
    <dd>{hoveredCommit.author}</dd>
    <dt>Lines</dt>
    <dd>{hoveredCommit.totalLines}</dd>
</dl>

<dl class="stats">

    <!-- <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
    <dt>Commits</dt>
    <dd>{commits.length}</dd>
    <dt>Average File Length</dt>
    <dd>{avgFileLength ? avgFileLength.toFixed(2) : 'Calculating...'}</dd>
    <dt>Deepest Line Depth</dt>
    <dd>{deepestLine ? deepestLine.depth : 'Calculating...'}</dd>
    <dt>Most Active Hour</dt>
    <dd>{mostActiveTimePeriod != null ? `${mostActiveTimePeriod}:00 - ${mostActiveTimePeriod + 1}:00` : 'Calculating...'}</dd> -->
    <dt>Commits</dt>
    <dd>{commits.length}</dd>
    <dt>Files</dt>
    <dd>{numberOfFiles}</dd>
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{totalLOC}</dd>
    <dt>Maximum Depth</dt>
    <dd>{maxDepth}</dd>
    <dt>Longest Line</dt>
    <dd>{longestLine}</dd>
    <!-- <dt>File with Max Lines</dt>
    <dd>{fileWithMaxLines}</dd> -->
</dl>