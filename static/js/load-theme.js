
(function () {
var themeKey = "faishon-theme";
var fallbackTheme = "lofi";
var savedTheme = fallbackTheme;

try {
    savedTheme = localStorage.getItem(themeKey) || fallbackTheme;
} catch (error) {
    savedTheme = fallbackTheme;
}

savedTheme = savedTheme === "forest" ? "forest" : fallbackTheme;

document.documentElement.setAttribute("data-theme", savedTheme);
})();

