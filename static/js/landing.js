var mobileMenu = document.getElementById("mobile-menu");
var mobileMenuButton = document.getElementById("mobile-menu-btn");

function renderMobileMenuIcon(iconName) {
if (!mobileMenuButton) {
    return;
}

if (window.lucide && window.lucide.icons && window.lucide.icons[iconName]) {
    mobileMenuButton.innerHTML = window.lucide.icons[iconName].toSvg({ class: "w-8 h-8" });
    return;
}

var mobileMenuIcon = document.getElementById("mobile-menu-icon");
if (mobileMenuIcon) {
    mobileMenuIcon.setAttribute("data-lucide", iconName);
    if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
    }
}
}

function setMobileMenuState(isOpen) {
if (!mobileMenu) {
    return;
}

mobileMenu.classList.toggle("opacity-0", !isOpen);
mobileMenu.classList.toggle("pointer-events-none", !isOpen);
document.body.classList.toggle("overflow-hidden", isOpen);

renderMobileMenuIcon(isOpen ? "x" : "menu");
}

if (mobileMenu && mobileMenuButton) {
mobileMenuButton.addEventListener("click", function () {
    var isOpen = mobileMenu.classList.contains("opacity-0");
    setMobileMenuState(isOpen);
});

mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
    setMobileMenuState(false);
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
    setMobileMenuState(false);
    }
});
}

if (window.lucide && typeof window.lucide.createIcons === "function") {
window.lucide.createIcons();
}

renderMobileMenuIcon("menu");