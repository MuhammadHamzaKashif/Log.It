document.addEventListener('DOMContentLoaded', function(){
    const content = document.getElementById('content');
    const toc = document.getElementById('toc');

    if (!content.classList.contains('visible')) {
        const a = document.createElement('h2');
        a.textContent = "Table of contents";
        content.appendChild(a);

        fetch('/topics')
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
    };



})