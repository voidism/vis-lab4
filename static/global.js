console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

let base = window.location.pathname.includes('vis-lab4') ? 'vis-lab4' : '';
let pages = [
    { url: base + ".", title: "Home" },
    { url: base + "projects/", title: "Projects" },
    { url: base + "contact/", title: "Contact" },
    { url: base + "cv/", title: "CV" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains("home");

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
}


document.body.insertAdjacentHTML("afterbegin", `
<label class="color-scheme">
    Theme:
    <select id="theme-select">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>`
);

const select = document.querySelector('.color-scheme select');

select.addEventListener('input', function(event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
});

if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

select.addEventListener('input', function(event) {
    localStorage.colorScheme = event.target.value;

    document.documentElement.style.setProperty('color-scheme', event.target.value);
});