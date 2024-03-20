
<script>
    export let info = {};
    export let hLevel = 2;
</script>

<style>
    img {
        max-width: 100%; /* Limit image width to 100% of its container */
        height: auto; /* Maintain aspect ratio */
    }
    .projects {
        display: grid; /* Enable grid layout */
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr)); /* Flexible columns */
        gap: 1em; /* Optional: add some gap between the items */
    }

    .section { 
        margin-bottom: 20px; 
    }
    .section-header { 
        font-size: 20px; 
        font-weight: bold; 
    }
    :root { /* Use blue as the accent color */
        --color-accent: #007bff; /* Define your accent color */
    }

    html {
        accent-color: var(--color-accent); /* Apply the accent color */
    }

    h1 {
        font-size: 400%; /* Significantly larger than body text */
    }

    h1, h2, h3, h4, h5, h6 {
        line-height: 1.1; /* Tighter leading for headings */
        text-wrap: balance; /* Evenly distributed lines */
    }
</style>

<article>
    <svelte:element this={"h" + hLevel}>{ info.title }</svelte:element>
    <img src="{info.image}" alt="">
    <p>{info.description}</p>
    <p>© {info.year}</p>
</article>

