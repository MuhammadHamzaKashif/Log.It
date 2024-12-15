document.addEventListener('DOMContentLoaded', function () {
    const test_start = document.getElementById('test_start');
    test_start.addEventListener('click', () => display_qs());
    const content = document.getElementById('content');
    const toc = document.getElementById('toc');

    class qs {
        constructor(topic, correct = 0, wrong = 0, time = 0) {
            this.topic = topic;
            this.correct = parseInt(correct, 10) || 0;
            this.wrong = parseInt(wrong, 10) || 0;
            this.count = parseInt(this.correct + this.wrong, 10) || 0;
            this.time = Number(time) || 0;
        }
    }

    let result = [];
    let prev_result = [];
    let start_time;
    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let a = new qs(item.topic, item.correct, item.wrong, item.time);
                prev_result.push(a);
            });
        });
    fetch('/topics')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let a = new qs(item);
                result.push(a);
            });
        });

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
                    start_time = performance.now();
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
                    }, 10); // transition

                } else {
                    content.textContent = 'No questions found';
                }
            })
            .catch(err => console.error('Error fetching questions:', err));
    }

    function display_result() {
        content.innerHTML = '';
        toc.style.height = '1780px';
        const res_heading = document.createElement('h3');
        res_heading.textContent = "Result:\n";
        content.appendChild(res_heading);

        const explanation = document.createElement('p');
        explanation.textContent = "These percentages represent the user's increase or decrease in score compared to previous results.";
        explanation.style.color = '#000';
        content.appendChild(explanation);

        const canvas = document.createElement('canvas');
        canvas.id = 'resultsChart';
        canvas.width = 750;
        canvas.height = 550;
        content.appendChild(canvas);

        const labels = result.map(item => item.topic);
        const data = result.map(item => item.correct);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of correct Answers',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        formatter: function (value, context) {
                            const item = result[context.dataIndex];
                            if (!item) {
                                return 'N/A';
                            }
                            // console.log("New item");
                            // console.log("topic:" + item.topic);
                            // console.log("correct:" + item.correct);
                            // console.log("wrong:" + item.wrong);
                            // console.log("count:" + item.count);
                            if (item.count === 0) {
                                return '0%';
                            }
                            const new_perc = (value / item.count) * 100;
                            // console.log("new_perc: " + new_perc);
                            // console.log(context.dataIndex);
                            const prev_item = prev_result[context.dataIndex - 1];
                            if (!prev_item) {
                                return new_perc.toFixed(2) + '%';
                            }
                            // console.log("Prev item");
                            // console.log("topic:" + prev_item.topic);
                            // console.log("correct:" + prev_item.correct);
                            // console.log("wrong:" + prev_item.wrong);
                            // console.log("count:" + prev_item.count);
                            if (prev_item.count !== 0) {
                                const prev_perc = (prev_item.correct / prev_item.count) * 100;
                                // console.log("prev_perc: " + prev_perc);
                                x = (new_perc - prev_perc).toFixed(2);
                                // console.log(x + '%');
                                return (new_perc - prev_perc).toFixed(2) + '%';
                            } else {
                                return new_perc.toFixed(2) + '%';
                            }
                        },
                        color: function (context) {
                            const item = result[context.dataIndex];
                            const new_perc = (item.correct / item.count) * 100;
                            const prev_item = prev_result[context.dataIndex - 1];
                            if (!prev_item || prev_item.count === 0) {
                                return '#000';
                            }
                            const prev_perc = (prev_item.correct / prev_item.count) * 100;
                            const x = new_perc - prev_perc;
                            return x >= 0 ? 'green' : 'red';
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
        const time_heading = document.createElement('h3');
        time_heading.id = 'time_heading';
        time_heading.textContent = "Time Taken by Each Topic per Question as compared to before:";
        content.appendChild(time_heading);
        for (let i = 0; i < result.length; i++) {
            let timeDifference;
            if (result[i].count != 0 && prev_result[i].count != 0) {
                timeDifference = ((result[i].time / result[i].count) - (prev_result[i].time / prev_result[i].count)).toFixed(2);
            }
            else{
                timeDifference = 0;
            }
            const z = document.createElement('div');
            z.innerHTML = `<h4>${result[i].topic}:</h4><p style="color: ${timeDifference <= 0 ? 'green' : 'red'};">${timeDifference}</p>`;
            content.appendChild(z);
        }
    }

    function update_stats(topic, correct, time_taken) {
        fetch('/update_stats', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: topic,
                correct: correct,
                time: time_taken
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
        const topic_no = search_topic(result, topic);
        result[topic_no].count++;
        const end_time = performance.now();
        const time_taken = Number(((end_time - start_time) / 1000).toFixed(2));
        console.log(time_taken);
        result[topic_no].time += time_taken;
        if (selected_ans === correct_ans) {
            result[topic_no].correct++;
            check.textContent = "Correct!";
            update_stats(topic, true, time_taken);
        } else {
            check.textContent = `Wrong! Correct ans: ${correct_ans}\n`;
            if (topic_no != -1) {
                result[topic_no].wrong++;
                update_stats(topic, false, time_taken);
            }
        }
        content.appendChild(check);

        const next_q = document.createElement('button');
        next_q.textContent = "Next";
        next_q.id = "next";
        next_q.addEventListener('click', () => display_qs());
        content.appendChild(next_q);

        const finish = document.createElement('button');
        finish.textContent = "Finish";
        finish.id = "finish";
        finish.addEventListener('click', () => display_result());
        content.appendChild(finish);
    }
});
