import sqlite3
import pandas as pd

data = pd.read_csv('stats.csv')
lim = len(data)

connection = sqlite3.connect('stats.db')
cursor = connection.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS stats (
    topic TEXT,
    correct INT,
    wrong INT
)
''')
for i in range(lim):
    cursor.execute('INSERT INTO stats (topic, correct, wrong) VALUES (?, ?, ?)',
               (data.iloc[i].topic, data.iloc[i].correct, data.iloc[i].wrong))

connection.commit()
connection.close()
