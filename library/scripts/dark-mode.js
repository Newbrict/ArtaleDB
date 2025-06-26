document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Function to apply dark mode
    function enableDarkMode() {
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "☀️ Light Mode";
        localStorage.setItem("dark-mode", "enabled");
    }

    // Function to disable dark mode
    function disableDarkMode() {
        body.classList.remove("dark-mode");
        darkModeToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("dark-mode", "disabled");
    }

    // Check for saved user preference
    if (localStorage.getItem("dark-mode") === "enabled") {
        enableDarkMode();
    }

    // Toggle Dark Mode on button click
    darkModeToggle.addEventListener("click", function () {
        if (body.classList.contains("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});
