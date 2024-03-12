export let _profileData = fetch("https://api.github.com/users/voidism")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });

// export let _profileData = {
//     ok: true,
//     json: async () => ({
//         followers: 24,
//         following: 56,
//         public_repos: 122,
//         public_gists: 6,
//     })
// };