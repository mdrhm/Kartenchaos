document.addEventListener("DOMContentLoaded", function() {
    // Get the rules button and popup
    var rulesButton = document.getElementById("rules");
    var rulesPopup = document.getElementById("rules-popup");
    var closeButton = document.querySelector(".close");

    // Function to show rules popup
    function showRulesPopup() {
        rulesPopup.style.display = "block";
    }

    // Function to hide rules popup
    function hideRulesPopup() {
        rulesPopup.style.display = "none";
    }

    // Event listener for rules button click
    rulesButton.addEventListener("click", showRulesPopup);

    // Event listener for close button click
    closeButton.addEventListener("click", hideRulesPopup);

    // Close popup when clicking outside of it
    window.addEventListener("click", function(event) {
        if (event.target === rulesPopup) {
            hideRulesPopup();
        }
    });

    // Prevent clicks inside the popup from closing it
    rulesPopup.addEventListener("click", function(event) {
        event.stopPropagation();
    });
});