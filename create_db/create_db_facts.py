import sqlite3
import pandas as pd

data = pd.read_csv('facts.csv')
lim = len(data)

connection = sqlite3.connect('facts.db')
cursor = connection.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS facts (
    fact TEXT,
    detail TEXT
)
''')
for i in range(lim):
    cursor.execute('INSERT INTO facts (fact, detail) VALUES (?, ?)',
               (data.iloc[i].fact, data.iloc[i].detail))

connection.commit()
connection.close()
