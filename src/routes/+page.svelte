<script>
    import projects from '$lib/projects.json';
    import Project from '$lib/Project.svelte';
</script>




<svelte:head>
	<title>Home</title>
</svelte:head>

    <header>
        <h1>Yung-Sung Chuang</h1>
        <p>Email: <a href="mailto:yungsung@mit.edu">yungsung@mit.edu</a> | Website: <a href="https://people.csail.mit.edu/yungsung">https://people.csail.mit.edu/yungsung</a>
    </header>

    <section id="education">
        <h2 class="section-header">Education</h2>
        <article>
            <header>
                <h3>Ph.D. Student in Computer Science, Massachusetts Institute of Technology (MIT)</h3>
                <p>Sep. 2021 - Present</p>
            </header>
            <!-- <p>GPA: 5.0/5.0...</p> -->
        </article>
        <article>
            <header>
                <h3>B.S. in Electrical Engineering, National Taiwan University (NTU)</h3>
                <p>Sep. 2016 - Jun. 2020</p>
            </header>
            <!-- <p>GPA: 4.18/4.30...</p> -->
        </article>
    </section>

    <h2>Latest Projects</h2>
    <div class="projects">
        {#each projects.slice(0, 3) as p}
        <Project info={p} hLevel=3 />
        {/each}
    </div>

    <section id="experience">
        <h2 class="section-header">Research Experiences</h2>
        
        <article>
            <header>
                <h3>Spoken Language Systems Group, CSAIL MIT</h3>
                <p>Advisor: Dr. James Glass | <time datetime="2021-09">Sep. 2021</time> - Present</p>
            </header>
            <ul>
                <li>Research Assistant: Passage Retrieval for Open-domain Question Answering with LLMs. [ACL’23]</li>
                <li>Difference-based Contrastive Learning for unsupervised sentence embedding. [NAACL’22]</li>
                <li>Comprehensive benchmark for Self-supervised Speech Representation Learning. [Interspeech’21]</li>
            </ul>
        </article>
    
        <article>
            <header>
                <h3>Microsoft, Redmond WA</h3>
                <p>Advisor: Dr. Pengcheng He & Dr. Yujia Xie | <time datetime="2023-06">Jun. 2023</time> - <time datetime="2023-09">Sep. 2023</time></p>
            </header>
            <p>Research Intern: Reducing Hallucination and Improving Factuality in LLM Decoding. [ICLR’24]</p>
        </article>

        <article>
            <header>
                <h3>MIT-IBM AI Watson Lab</h3>
                <p>Advisor: Dr. Yang Zhang & Dr. Yoon Kim | <time datetime="2022-06">Jun. 2022</time> - <time datetime="2022-09">Sep. 2022</time></p>
            </header>
            <p>Research Intern: Difference-based Contrastive Learning for Sentence Embeddings. [NAACL’22]</p>
        </article>
    
        <!-- Additional research experiences -->
    </section>
    <img src="images/charlesriver.JPG" alt="A picture of frozen Charles River." width="400px">
    
    <section id="publications">
        <h2 class="section-header">Selected Publications</h2>
        <ul>
            <li>“DoLa: Decoding by Contrasting Layers Improves Factuality in Large Language Models”. ICLR 2024.</li>
            <li>“SAIL: Search-Augmented Instruction Learning”. Findings of The 2023 Conference on Empirical Methods in Natural Language Processing.</li>
            <li>“DiffCSE: Difference-based Contrastive Learning for Sentence Embeddings”. NAACL 2022.</li>
            <!-- Additional publications -->
        </ul>
    </section>
    
    <section id="teachings">
        <h2 class="section-header">Teachings</h2>
        <ul>
            <li>Tutorial Speaker at AACL-IJCNLP 2022: Recent Advances in Pre-trained Language Models.</li>
            <li>Teaching Assistant on Natural Language Processing, Fall 2023 @MIT.</li>
            <!-- Additional teachings -->
        </ul>
    </section>
    
    <section id="honors">
        <h2 class="section-header">Honors & Awards</h2>
        <ul>
            <li>Reviewer: NeurIPS, ICLR, ICML, AAAI, EMNLP, ICASSP, Interspeech.</li>
            <li>Presidential Award (4 times) - Electrical Engineering Dept. at NTU.</li>
            <li>Irving T. Ho Memorial Scholarship (2 times) - EECS at NTU.</li>
            <li>Travel Grant for INTERSPEECH 2020 conference.</li>
        </ul>
    </section>
    


    <section id="skills">
        <h2 class="section-header">Skills</h2>
        <p>Languages: Python, C++, Go, MATLAB, Shell Scripting...</p>
        <p>Libraries & Toolkits: PyTorch, Huggingface transformers...</p>
    </section>
