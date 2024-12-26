import sqlite3
import pandas as pd

data = pd.read_csv('questions.csv')
lim = len(data)

connection = sqlite3.connect('questions.db')
cursor = connection.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS questions (
    statement TEXT,
    answer TEXT,
    topic TEXT
)
''')
for i in range(lim):
    cursor.execute('INSERT INTO questions (statement, answer, topic) VALUES (?, ?, ?)',
               (data.iloc[i].Statement, data.iloc[i].Answer.strip(), data.iloc[i].Topic.strip()))

connection.commit()
connection.close()
