# Log.It

A lightweight learning and quiz web app. It organises courses by education level, serves lessons written in Markdown, quizzes the user, and tracks accuracy over time. There is also a random fact page.

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## Features

- Account signup and login with hashed passwords
- Course browser driven by the `static/courses/<level>/<course>/` directory tree
- Lessons rendered from Markdown files to HTML on the server
- Quiz questions pulled at random from `questions.db`
- Per-user, per-topic stats for correct and wrong answers and total time
- Random facts from `facts.db`

## Stack

- Flask with server-rendered Jinja templates
- SQLite for user accounts, quiz stats, questions, and facts
- Vanilla JS and CSS for the interactive quiz and lesson views
- A small Node toolchain (`csv-parse`, `sqlite3`, `marked`) used by the scripts in `create_db/` to build the databases from the CSV sources

## Layout

```
app.py                 Flask app and routes
templates/             index, learn, test, result, login, signup, rand_fact, contact, acknowledge
static/                CSS, JS, and courses/<level>/<course>/*.md lessons
create_db/             scripts that build the sqlite databases from CSV
questions.csv/.db      question bank
facts.csv/.db          facts
course_stats.db        users and quiz statistics
```

## Running

```bash
python app.py
```

The app serves on `http://127.0.0.1:5000`. The databases are committed, so no setup step is required to try it.

To rebuild the databases from the CSV files:

```bash
npm install
python create_db/create_db.py
```

## Notes

- `app.secret_key` is hardcoded in `app.py`. Move it to an environment variable before deploying.
- Quiz questions and facts are chosen with `random.choice` per request, so repeated requests can return the same item.
- The `static/courses` directory is what drives the topic list. Add a Markdown file to add a lesson.
