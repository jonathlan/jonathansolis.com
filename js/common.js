window.addEventListener("resize", removeScroll);

// Remove scroll class from the right panel in small devices
function removeScroll(){    
    var width = window.innerWidth;
    var height = window.innerHeight;
    var rightPanel = document.getElementById("right-panel");

    if (width < 576)
        rightPanel.classList.remove("card-scroll");
    else if (!rightPanel.classList.contains("card-scroll"))
        rightPanel.classList.add("card-scroll");
}