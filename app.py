from flask import Flask, jsonify, render_template, request
import sqlite3
import random
import markdown
import os

app = Flask(__name__)

def get_db_connection(db_name):
    connection = sqlite3.connect(db_name)
    connection.row_factory = sqlite3.Row
    return connection

def row_to_dict(cursor, row):
    return {cursor.description[i][0]: (row[i].decode('utf-8') if isinstance(row[i], bytes) else row[i]) for i in range(len(row))}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/topics')
def send_qs():
    arr = []
    dir_path = 'static/DiscreteMathematics.wiki'

    file_names = os.listdir(dir_path)

    for file_name in file_names[1:]:
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

@app.route('/stats')
def get_res():
    try:
        connection = get_db_connection('stats.db')
        cursor = connection.cursor()
        cursor.execute('SELECT topic, correct, wrong FROM stats')
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
    try:
        data = request.get_json()
        topic = data.get('topic')
        correct = data.get('correct')

        connection = get_db_connection('stats.db')
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM stats WHERE topic = ?', (topic,))
        row = cursor.fetchone()

        if row:
            if correct:
                cursor.execute('UPDATE stats SET correct = correct + 1 WHERE topic = ?', (topic,))
            else:
                cursor.execute('UPDATE stats SET wrong = wrong + 1 WHERE topic = ?', (topic,))
        else:
            if correct:
                cursor.execute('INSERT INTO stats (topic, correct, wrong) VALUES (?, 1, 0)', (topic,))
            else:
                cursor.execute('INSERT INTO stats (topic, correct, wrong) VALUES (?, 0, 1)', (topic,))

        connection.commit()
        connection.close()
        return jsonify({"message": "Statistics updated successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/info/<filename>')
def get_mdinfo(filename):
    file_path = f"static/DiscreteMathematics.wiki/{filename}.md"
    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
            html_content = markdown.markdown(content)
            return html_content

if __name__ == "__main__":
    app.run(debug=True)
