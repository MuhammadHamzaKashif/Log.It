from flask import Flask, jsonify, render_template, request, session, redirect, url_for
import sqlite3
import random
import markdown
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'

def get_db_connection(db_name):
    connection = sqlite3.connect(db_name)
    connection.row_factory = sqlite3.Row
    return connection

def row_to_dict(cursor, row):
    return {cursor.description[i][0]: (row[i].decode('utf-8') if isinstance(row[i], bytes) else row[i]) for i in range(len(row))}


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/acknowledge')
def acknowledge():
    return render_template('acknowledge.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/rand_fact')
def rand_fact():
    return render_template('rand_fact.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        connection = get_db_connection('course_stats.db')
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Users WHERE username = ?', (username,))
        user = cursor.fetchone()
        connection.close()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['user_id']
            session['username'] = user['username']
            session['education'] = user['education'] 
            return redirect(url_for('learn', level=user['education']))
        else:
            return jsonify({"error": "Invalid username or password"}), 401

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        education = request.form['education']
        major = request.form['major']
        hashed_password = generate_password_hash(password)

        connection = get_db_connection('course_stats.db')
        cursor = connection.cursor()
        cursor.execute('INSERT INTO Users (username, password, email, education, course) VALUES (?, ?, ?, ?, ?)', (username, hashed_password, email, education, major))
        #cursor.execute('INSERT INTO Stats (user_id, course_id, topic, correct, wrong, time) VALUES (?, ?, ?, 0, 0, 0)', (user_id, course_id, "Sample Topic"))
        connection.commit()
        connection.close()

        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/stats')
def get_res():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('login'))

    try:
        connection = get_db_connection('course_stats.db')
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Stats WHERE user_id = ?', (user_id,))
        rows = cursor.fetchall()
        connection.close()

        if rows:
            return jsonify([row_to_dict(cursor, row) for row in rows])
        else:
            return jsonify({"error": "No statistics found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_stats', methods=['POST'])
def update_stats():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('login'))

    try:
        data = request.get_json()
        course_id = data.get('course_id')
        topic = data.get('topic')
        correct = data.get('correct')
        time_taken = data.get('time')

        print(f"Received data: {data}")  # Debug print

        connection = get_db_connection('course_stats.db')
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Stats WHERE user_id = ? AND course_id = ? AND topic = ?', (user_id, course_id, topic))
        row = cursor.fetchone()

        if row:
            if correct:
                cursor.execute('UPDATE Stats SET correct = correct + 1, time = time + ? WHERE stat_id = ?', (time_taken, row['stat_id']))
            else:
                cursor.execute('UPDATE Stats SET wrong = wrong + 1, time = time + ? WHERE stat_id = ?', (time_taken, row['stat_id']))
        else:
            if correct:
                cursor.execute('INSERT INTO Stats (user_id, course_id, topic, correct, wrong, time) VALUES (?, ?, ?, 1, 0, ?)', (user_id, course_id, topic, time_taken))
            else:
                cursor.execute('INSERT INTO Stats (user_id, course_id, topic, correct, wrong, time) VALUES (?, ?, ?, 0, 1, ?)', (user_id, course_id, topic, time_taken))

        connection.commit()
        connection.close()
        return jsonify({"message": "Statistics updated successfully"}), 201
    except Exception as e:
        print(f"Error: {e}")  # Debug print
        return jsonify({"error": str(e)}), 500


@app.route('/topics')
def send_levels():
    arr = []
    dir_path = f"static/courses"

    file_names = os.listdir(dir_path)

    for file_name in file_names[0:]:
        name, _ = os.path.splitext(file_name)
        arr.append(name)

    return jsonify(arr)

@app.route('/topics/<level>')
def send_courses(level):
    arr = []
    dir_path = f"static/courses/{level}"

    file_names = os.listdir(dir_path)

    for file_name in file_names[0:]:
        name, _ = os.path.splitext(file_name)
        arr.append(name)

    return jsonify(arr)


@app.route('/topics/<level>/<coursename>')
def send_qs(level, coursename):
    arr = []
    dir_path = f"static/courses/{level}/{coursename}"

    file_names = os.listdir(dir_path)

    for file_name in file_names[0:]:
        name, _ = os.path.splitext(file_name)
        arr.append(name)

    return jsonify(arr)

@app.route('/questions')
def questions():
    connection = get_db_connection('questions.db')
    cursor = connection.cursor()
    cursor.execute('SELECT statement, answer, topic FROM questions')
    rows = cursor.fetchall()
    connection.close()
    if rows:
        global random_question
        random_question = random.choice(rows)
        return jsonify(dict(random_question))
    else:
        return jsonify({"error": "No questions found"}), 404



@app.route('/info/<level>/<coursename>/<filename>')
def get_mdinfo(level, coursename, filename):
    file_path = f"static/courses/{level}/{coursename}/{filename}.md"
    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
            html_content = markdown.markdown(content)
            return html_content
        
@app.route('/fact')
def fact():
    connection = get_db_connection('facts.db')
    cursor = connection.cursor()
    cursor.execute('SELECT fact, detail FROM facts')
    rows = cursor.fetchall()
    connection.close()
    if rows:
        global random_fact
        random_fact = random.choice(rows)
        return jsonify(dict(random_fact))
    else:
        return jsonify({"error": "No fact found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
