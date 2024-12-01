//const { response } = require("express");

//const { response } = require("express");

document.addEventListener("DOMContentLoaded", function () {


    const lname = document.getElementById("lname");
    const toc = document.getElementById("toc");
    const content = document.getElementById('content');
    const test = document.getElementById('test');
    const learn = document.getElementById('learn');
    const arrow = document.getElementById('arrow-right');


    function showTOC() {
        toc.style.left = "0";
        arrow.style.left = "260px";
    }
    function hideTOC(event) {
        const tocRect = toc.getBoundingClientRect();
        if (event.clientX < tocRect.left || event.clientX > tocRect.right || event.clientY < tocRect.top || event.clientY > tocRect.bottom) {
            toc.style.left = "-250px";
            arrow.style.left = "0px";

        }
    }
    lname.addEventListener("mouseover", showTOC);
    toc.addEventListener("mouseover", showTOC);
    lname.addEventListener("mouseout", hideTOC);
    toc.addEventListener("mouseout", hideTOC);

    test.addEventListener('click', () => display_qs());
    learn.addEventListener('click', () => display_learn());

    function display_learn() {
        const content = document.getElementById('content');


        if (!content.classList.contains('visible')) {
            const a = document.createElement('h2');
            a.textContent = "Table of contents";
            content.appendChild(a);

            fetch('/learn')
                .then(response => response.json())
                .then(data => {
                    data.forEach(item => {
                        const b = document.createElement('li');
                        b.textContent = item;
                        b.id = item;
                        b.style.cursor = 'pointer';
                        b.addEventListener('click', () => display_topic(item));
                        content.appendChild(b);
                    });

                    setTimeout(() => {
                        content.classList.add('visible');
                    }, 10); //transition

                })
                .catch(error => console.error('Error fetching data:', error));
        }
        else {
            content.classList.remove('visible');
            // content.style.opacity = 0;
            content.innerHTML = '';
            display_learn();


            // setTimeout(() => {
            //     content.style.opacity = 1;
            //     //content.classList.add('visible');
            //     // content.style.opacity = 1;
            // }, 1000);

        }
    }


    function display_qs() {
        fetch('/questions')
            .then(response => response.json())
            .then(data => {
                if (data.statement) {
                    correct_ans = data.answer;
                    content.innerHTML = '';
                    const p = document.createElement('p');
                    p.textContent = data.statement;
                    content.appendChild(p);

                    const buttons = document.createElement('div');
                    buttons.id = "buttons";
                    content.appendChild(buttons);
                    ['a', 'b', 'c', 'd'].forEach(option => {
                        const btn = document.createElement('button');
                        btn.textContent = option;
                        btn.id = option;
                        btn.addEventListener('click', () => check_ans(option))
                        buttons.appendChild(btn);
                    });
                    setTimeout(() => {
                        content.classList.add('visible');
                    }, 10); //transition

                }
                else {
                    content.textContent = 'No questions found';
                }
            })
            .catch(err => console.error('Error fetching questions:', err));
    }


    function check_ans(selected_ans) {
        const result = document.createElement('p');
        if (selected_ans === correct_ans) {
            result.textContent = "Correct!";
        }
        else {
            result.textContent = `Wrong! Correct ans: ${correct_ans}`;

        }
        content.appendChild(result);
        const next_q = document.createElement('button');
        next_q.textContent = "next";
        next_q.id = "next";
        next_q.addEventListener('click', () => display_qs())
        content.appendChild(next_q);

    }

    function display_topic(topic) {
        const copyright = document.getElementById('copyright');
        fetch(`/info/${topic}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                content.innerHTML = html;
                content.classList.remove('visible');
                content.classList.add('hidden');
                setTimeout(() => {
                    content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    content.classList.remove('hidden');
                    content.classList.add('visible');
                    content.opacity = 1;
                    copyright.style.position = 'relative';
                }, 10);
            })
            .catch(error => console.error('Error fetching data:', error));
    };


}
);

