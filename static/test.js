document.addEventListener('DOMContentLoaded', function () {
    const test_start = document.getElementById('test_start');
    test_start.addEventListener('click', () => display_qs());
    class qs {
        constructor(topic, count = 0) {
            this.topic = topic;
            this.count = count;
        }
    }
    let result = [];
    fetch('/topics')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                a = new qs(item);
                result.push(a);
            })
        })

    function search_topic(result, topic) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].topic === topic) {
                return i;
            }
        }
        return -1;
    }



    function display_qs() {
        fetch('/questions')
            .then(response => response.json())
            .then(data => {
                if (data.statement) {
                    correct_ans = data.answer;
                    topic = data.topic.replace(/"/g, '');
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
                        btn.addEventListener('click', () => check_ans(option, topic));
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
    function display_result() {
        content.innerHTML = '';
        const res_heading = document.createElement('h3');
        res_heading.textContent = "Result\nWrong asnwers:\n";
        content.appendChild(res_heading);
        const canvas = document.createElement('canvas'); 
        canvas.id = 'resultsChart'; 
        canvas.width = 750; 
        canvas.height = 550; 
        content.appendChild(canvas); 
        const labels = result.map(item => item.topic); 
        const data = result.map(item => item.count); 
        const ctx = canvas.getContext('2d'); 
        new Chart(ctx, { 
            type: 'bar', 
            data: { 
                labels: labels, 
                datasets: [{ 
                    label: 'Number of Wrong Answers', 
                    data: data, 
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                    borderColor: 'rgba(255, 99, 132, 1)', 
                    borderWidth: 1 
                }] }, 
                options: { 
                    responsive: false,
                    scales: { 
                        y: { 
                            beginAtZero: true 
                        } 
                    } 
                } });
    }


    function update_stats(topic, correct) { 
        fetch('/update_stats', { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify({ 
                topic: topic, 
                correct: correct 
            }) 
        }) 
        .then(response => response.json()) 
        .then(data => { 
            console.log('Success:', data); 
        }) 
        .catch((error) => { 
            console.error('Error:', error); 
        }); 
    }





    function check_ans(selected_ans, topic) {
        const check = document.createElement('p');
        if (selected_ans === correct_ans) {
            check.textContent = "Correct!";
            update_stats(topic, true);
        }
        else {
            check.textContent = `Wrong! Correct ans: ${correct_ans}\n`;
            topic_no = search_topic(result, topic);
            if (topic_no != -1) {
                result[topic_no].count++;
                update_stats(topic, false);
            }
            // else{
            //     check.textContent += "Topic not found";
            // }
        }
        content.appendChild(check);
        const next_q = document.createElement('button');
        next_q.textContent = "Next";
        next_q.id = "next";
        next_q.addEventListener('click', () => display_qs())
        content.appendChild(next_q);
        const finish = document.createElement('button');
        finish.textContent = "Finish";
        finish.id = "next";
        finish.addEventListener('click', () => display_result());
        content.appendChild(finish);

    }
})