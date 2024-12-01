from flask import Flask, jsonify, render_template
import sqlite3
import random
import markdown
import os

app = Flask(__name__)

def get_db_connection():
    connection = sqlite3.connect('questions.db')
    connection.row_factory = sqlite3.Row
    return connection

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/learn')
def learn():
    arr = []
    dir_path = 'static/DiscreteMathematics.wiki'

    file_names = os.listdir(dir_path)

    for file_name in file_names[1:]:
        name, _ = os.path.splitext(file_name)
        arr.append(name)

    return jsonify(arr)

@app.route('/questions')
def questions():
    connection = get_db_connection()
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
    
@app.route('/info/<filename>')
def get_mdinfo(filename):
    #dir_path = '' 
    file_path = f"static/DiscreteMathematics.wiki/{filename}.md"
    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            content = file.read() 
            html_content = markdown.markdown(content) 
            return html_content



if __name__ == "__main__":
    app.run(debug=True)
