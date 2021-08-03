
function toggleMenu(event) {
    if(event.target.tagName === "ASIDE" || event.target.tagName === "IMG") {
        document.querySelector("#menu-container").classList.toggle("active");
        document.querySelector("#menu").classList.toggle("active");
    }
}