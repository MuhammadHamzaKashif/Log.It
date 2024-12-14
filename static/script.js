document.addEventListener("DOMContentLoaded", function () {
    const lname = document.getElementById("lname");
    const toc = document.getElementById("toc");
    const content = document.getElementById('content');
    const arrow = document.getElementById('arrow-right');
    const popup = document.getElementById('popup');
    const test = document.getElementById('test');
    const learn = document.getElementById('learn');
    const result = document.getElementById('result');




    function showTOC() {
        toc.style.left = "0";
        toc.style.height = content.offsetHeight - 50 + "px";
        arrow.style.left = "260px";
    }

    function hideTOC(event) {
        const tocRect = toc.getBoundingClientRect();
        if (event.clientX < tocRect.left || event.clientX > tocRect.right || event.clientY < tocRect.top || event.clientY > tocRect.bottom) {
            toc.style.height = content.offsetHeight - 50 + "px";
            toc.style.left = "-265px";
            arrow.style.left = "0px";
        }
    }

    function showPopup(event, content) {
        popup.style.left = `${event.pageX + 10}px`;
        popup.style.top = `${event.pageY + 10}px`;
        popup.innerHTML = content;
        popup.classList.add('visible');
    }

    function hidePopup() {
        popup.classList.remove('visible');
    }

    lname.addEventListener("mouseover", showTOC);
    toc.addEventListener("mouseover", showTOC);
    lname.addEventListener("mouseout", hideTOC);
    toc.addEventListener("mouseout", hideTOC);



    test.addEventListener('mouseenter', (event) => showPopup(event, "<div><p>Take a random test and test where are you standing.</p></div><div><p>You'll also be able to see how you did compared to your previous records</p></div><div><p>No better day than today to get better!</p></div>"));
    learn.addEventListener('mouseenter', (event) => showPopup(event, "<div><p>Learn about all the important topics.</p></div><div><p>Don't stop till you quench your thirst</p></div>"));
    result.addEventListener('mouseenter', (event) => showPopup(event, "<div><p>See your previous results.</p></div><div><p>How well have you been doing in each topic</p></div>"));
    test.addEventListener('mouseleave', hidePopup);
    learn.addEventListener('mouseleave', hidePopup);
    result.addEventListener('mouseleave', hidePopup);
    // let slideIndex = 0; 
    // showSlides(); 
    // function showSlides() { 
    //     let slides = document.querySelectorAll(".slide"); 
    //     for (let i = 0; i < slides.length; i++) { 
    //         slides[i].style.display = "none"; 
    //     } 
    //     slideIndex++; 
    //     if (slideIndex > slides.length) { 
    //         slideIndex = 1 
    //     } 
    //     slides[slideIndex - 1].style.display = "flex"; 
    //     setTimeout(showSlides, 15000); // Change slide every 3 seconds 
    //     }
});
