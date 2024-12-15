document.addEventListener('DOMContentLoaded', function(){
    const test_start = document.getElementById('test_start');
    test_start.addEventListener('click', () => display_fact());
    const content = document.getElementById('content');
    const toc = document.getElementById('toc');


    function display_fact() {
        fetch('/fact')
            .then(response => response.json())
            .then(data => {
                if (data.fact) {
                    content.innerHTML = '';
                    const heading = document.createElement('h3');
                    heading.id = 'heading';
                    heading.textContent = data.fact;
                    content.appendChild(heading);
                    const p = document.createElement('p');
                    p.textContent = data.detail;
                    content.appendChild(p);
                    setTimeout(() => {
                        content.classList.add('visible');
                    }, 10);
                }
            });
        }
})