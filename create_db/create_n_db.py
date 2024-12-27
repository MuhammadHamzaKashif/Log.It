import sqlite3

conn = sqlite3.connect('course_stats.db')

# Create a cursor object
cursor = conn.cursor()

# Create the Users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    education TEXT NOT NULL,
    course TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Create the Courses table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    description TEXT
)
''')

# Create the Stats table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Stats (
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    topic TEXT,
    correct INTEGER,
    wrong INTEGER,
    time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
)
''')

cursor.execute(''' INSERT INTO Stats (user_id, course_id, topic, correct, wrong, time) VALUES (?, ?, ?, ?, ?, ?) ''', (1, 1, 'Sample Topic', 0, 0, 0))

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database and tables created successfully!")
