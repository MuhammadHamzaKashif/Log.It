document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    content.innerHTML = '';
    const res_heading = document.createElement('h3');
    res_heading.textContent = "Result\nCorrect answers:\n";
    content.appendChild(res_heading);

    class qs {
        constructor(topic, correct = 0, wrong = 0) {
            this.topic = topic;
            this.correct = correct;
            this.wrong = wrong;
        }
    }

    let result = [];

    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let a = new qs(item.topic, item.correct, item.wrong);
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
        })
        .catch(err => console.error('Error fetching stats:', err));
});
