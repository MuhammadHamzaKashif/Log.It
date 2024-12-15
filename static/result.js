document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const toc = document.getElementById('toc');
    content.innerHTML = '';
    const res_heading = document.createElement('h3');
    res_heading.textContent = "Result\nCorrect answers:\n";
    content.appendChild(res_heading);
    // toc.style.height = '1166px';

    class qs {
        constructor(topic, correct = 0, wrong = 0, time = 0) {
            this.topic = topic;
            this.correct = parseInt(correct, 10) || 0;
            this.wrong = parseInt(wrong, 10) || 0;
            this.count = this.correct + this.wrong;
            this.time = Number(time) || 0;
        }
    }

    let result = [];

    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let a = new qs(item.topic, item.correct, item.wrong, item.time);
                result.push(a);
            });

            // Create the canvas element after fetching the data
            const canvas = document.createElement('canvas');
            canvas.id = 'resultsChart';
            canvas.width = 750;
            canvas.height = 550;
            content.appendChild(canvas);

            // Prepare data for the chart
            const labels = result.map(item => item.topic);
            const val = result.map(item => item.correct);

            // Render the chart
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Correct Answers',
                        data: val,
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
                    }
                }
            });
            const time_heading = document.createElement('h3');
            time_heading.id = 'time_heading';
            time_heading.textContent = "Average Time Taken by Each Topic per Question:";
            content.appendChild(time_heading);
            for (let i = 0; i < result.length; i++) {
                const x = document.createElement('div');
                x.classList.add('time_show');
                if (result[i].count != 0) { 
                    x.innerHTML = `<h4>${result[i].topic}: </h4><p style= "margin-left: 12px;">${(result[i].time / result[i].count).toFixed(2)}s</p>` 
                }
                else{
                    x.innerHTML = `<h4>${result[i].topic}: </h4><p style= "margin-left: 12px;">${0}</p>`
                }
                content.appendChild(x);
            }
        })
        .catch(err => console.error('Error fetching stats:', err));
});
