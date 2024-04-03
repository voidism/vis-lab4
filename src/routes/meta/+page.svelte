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
</style>

<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

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
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    let xScale, yScale, xAxis, yAxis;
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
    }
</script>

<h1>Meta</h1>

<p>This is a meta page.</p>

<svg viewBox="0 0 {width} {height}">
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis}></g>
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis}></g>
    
    <g class="dots">
        {#each commits as commit}
            <circle
                cx={xScale(commit.datetime)}
                cy={yScale(commit.hourFrac)}
                r="5"
                fill="steelblue"
            />
        {/each}
    </g>

    <!-- X Axis -->
    <!-- <g transform={`translate(0,${height})`}>
        {#each xScale.ticks() as tick}
            <g transform={`translate(${xScale(tick)},0)`}>
                <line y2="-6" stroke="black"></line>
                <text dy="0.71em" y="9" text-anchor="middle">{d3.timeFormat("%b %d")(tick)}</text>
            </g>
        {/each}
    </g> -->

    <!-- Y Axis -->
    <!-- <g>
        {#each yScale.ticks() as tick}
            <g transform={`translate(0,${yScale(tick)})`}>
                <line x2="6" stroke="black"></line>
                <text dx="-0.71em" x="-9" text-anchor="end">{tick}:00</text>
            </g>
        {/each}
    </g> -->
</svg>

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

