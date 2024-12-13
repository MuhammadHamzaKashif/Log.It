document.addEventListener('DOMContentLoaded', function(){
    const test_start = document.getElementById('test_start');
    test_start.addEventListener('click', ()=> display_qs());

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
})