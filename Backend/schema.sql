/* 
Age group would be defined by intervals, and each would be labeled by alphabetical order
*/
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT
    email TEXT NOT NULL
    username TEXT NOT NULL
    password CHAR(128) NOT NULL
    profession TEXT NOT NULL
    age_group TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS project (
    proj_id INTEGER FOREIGN KEY AUTOINCREMENT
    task_id INTEGER FOREIGN KEY AUTOINCREMENT
    nember_id INTEGER FOREIGN KEY AUTOINCREMENT
    title TEXT NOT NULL
    detail TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS task (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT
    title TEXT NOT NULL
    content TEXT NOT NULL
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
