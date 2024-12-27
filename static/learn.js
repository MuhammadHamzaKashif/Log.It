document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const toc = document.getElementById('toc');



    const urlParams = new URLSearchParams(window.location.search); 
    const level = urlParams.get('level'); 
    if (level) 
    { 
        const z = document.createElement('h2');
        z.textContent = "Recommended";
        content.appendChild(z);
        display_courses(level); 
    } 
    else 
    { 
        display_level(); 
    }





    //display_level();

    function display_level() {
        if (!content.classList.contains('visible')) {
            const a = document.createElement('h2');
            a.textContent = "Education Level";
            content.appendChild(a);
            fetch('/topics')
                .then(response => response.json())
                .then(data => {
                    data.forEach(item => {
                        const x = document.createElement('li');
                        x.id = item;
                        x.textContent = item;
                        x.style.cursor = 'pointer';
                        x.addEventListener('click', () => display_courses(item));
                        content.appendChild(x);
                    });
                    setTimeout(() => {
                        content.classList.add('visible');
                    }, 10);
                })
                .catch(error => console.error('Error fetching data:', error));

        } else {
            content.classList.remove('visible');
            content.innerHTML = '';
            display_level();
        }
    }

    function display_courses(item) {
        if (!content.classList.contains('visible')) {
            const a = document.createElement('h2');
            a.textContent = "Available Courses";
            content.appendChild(a);

            fetch(`/topics/${item}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(course => {
                        //level = item;
                        const x = document.createElement('li');
                        x.textContent = course;
                        x.id = course;
                        x.style.cursor = 'pointer';
                        console.log(`level: ${item}`);
                        console.log(`course: ${course}`);
                        x.addEventListener('click', () => display_learn(item, course));
                        content.appendChild(x);
                    });
                    setTimeout(() => {
                        content.classList.add('visible');
                    }, 10);
                })
                .catch(error => console.error('Error fetching data:', error));

        } else {
            content.classList.remove('visible');
            content.innerHTML = '';
            display_courses(item);
        }
    }

    function display_learn(level, course) {
        if (!content.classList.contains('visible')) {
            console.log(`level: ${level}`);
            console.log(`course: ${course}`);
            const a = document.createElement('h2');
            a.textContent = "Table of contents";
            content.appendChild(a);

            fetch(`/topics/${level}/${course}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(topic => {
                        const b = document.createElement('li');
                        b.textContent = topic;
                        b.id = topic;
                        b.style.cursor = 'pointer';
                        b.addEventListener('click', () => display_topic(level, course, topic));
                        content.appendChild(b);
                    });

                    setTimeout(() => {
                        content.classList.add('visible');
                    }, 10);

                })
                .catch(error => console.error('Error fetching data:', error));
        } else {
            content.classList.remove('visible');
            content.innerHTML = '';
            display_learn(level, course);
        }
    }

    function display_topic(level, course, topic) {
        const copyright = document.getElementById('copyright');
        fetch(`/info/${level}/${course}/${topic}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                content.innerHTML = html;
                toc.style.height = `${content.offsetHeight + 180}px`;
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
    }
});
