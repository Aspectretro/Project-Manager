/*
Begin Tables

Age group would be defined by intervals, 
and each would be labeled by alphabetical order

Insert new columns in the user table after the profile creation/set-up page is done
 */
CREATE TABLE
    IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password CHAR(128) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS task (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tag TEXT,
        due_date DATE,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    );