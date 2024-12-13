//const { response } = require("express");

//const { response } = require("express");

document.addEventListener("DOMContentLoaded", function () {


    const lname = document.getElementById("lname");
    const toc = document.getElementById("toc");
    const content = document.getElementById('content');
    const learn = document.getElementById('learn');
    const arrow = document.getElementById('arrow-right');


    function showTOC() {
        toc.style.left = "0";
        toc.style.height = content.offsetHeight + "px";
        arrow.style.left = "260px";
    }
    function hideTOC(event) {
        const tocRect = toc.getBoundingClientRect();
        if (event.clientX < tocRect.left || event.clientX > tocRect.right || event.clientY < tocRect.top || event.clientY > tocRect.bottom) {
            toc.style.height = content.offsetHeight + "px";
            toc.style.left = "-250px";
            arrow.style.left = "0px";

        }
    }
    lname.addEventListener("mouseover", showTOC);
    toc.addEventListener("mouseover", showTOC);
    lname.addEventListener("mouseout", hideTOC);
    toc.addEventListener("mouseout", hideTOC);

}
);

