<svelte:head>
	<title>Contact me</title>
</svelte:head>

<form action="mailto:yungsung@mit.edu" method="POST" enctype="text/plain">
    <label>Email:</label><input name="email" type="email">
    <label>Subject:</label><input name="subject" type="text">
    <label>Body:</label><textarea name="body"></textarea><br>
    <button>Send</button>
</form>