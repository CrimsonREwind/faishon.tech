
var themeKey = "faishon-theme";
var lightTheme = "lofi";
var darkTheme = "forest";

function readTheme() {
var savedTheme = lightTheme;
try {
    savedTheme = localStorage.getItem(themeKey) || lightTheme;
} catch (error) {
    savedTheme = lightTheme;
}

return savedTheme === darkTheme ? darkTheme : lightTheme;
}

function writeTheme(theme) {
document.documentElement.setAttribute("data-theme", theme);
try {
    localStorage.setItem(themeKey, theme);
} catch (error) {
    // Ignore storage failures and keep runtime theme.
}
}

function syncControllers(theme) {
var isDark = theme === darkTheme;
document.querySelectorAll(".theme-controller").forEach(function (controller) {
    controller.checked = isDark;
});
}

var initialTheme = readTheme();
writeTheme(initialTheme);
syncControllers(initialTheme);

document.querySelectorAll(".theme-controller").forEach(function (controller) {
controller.addEventListener("change", function () {
    var nextTheme = controller.checked ? darkTheme : lightTheme;
    writeTheme(nextTheme);
    syncControllers(nextTheme);
});
});

lucide.createIcons();


