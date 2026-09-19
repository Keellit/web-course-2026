const menuButton = document.querySelector(".menu");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("open");
    nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        menuButton.classList.remove("open");
        nav.classList.remove("open");
    });
});
