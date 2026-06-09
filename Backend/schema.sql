-- User
   CREATE TABLE IF NOT EXISTS user (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password CHAR(128) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

-- Task
   CREATE TABLE IF NOT EXISTS task (
          task_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          tag TEXT,
          due_date DATE,
          created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user (user_id)
          );

-- Tag
   CREATE TABLE IF NOT EXISTS tag (
          tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user (user_id)
          );

-- Project
   CREATE TABLE IF NOT EXISTS project (
          project_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          created_by INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES user (user_id)
          );

-- Project Member
   CREATE TABLE IF NOT EXISTS project_member (
          project_member_id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          role TEXT CHECK (role IN ('owner', 'member')) DEFAULT 'member',
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (project_id, user_id),
          FOREIGN KEY (project_id) REFERENCES project (project_id),
          FOREIGN KEY (user_id) REFERENCES user (user_id)
          );

-- Project Task
   CREATE TABLE IF NOT EXISTS project_task (
          project_task_id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          task_id INTEGER NOT NULL,
          assigned_to INTEGER,
          UNIQUE (project_id, task_id),
          FOREIGN KEY (project_id) REFERENCES project (project_id),
          FOREIGN KEY (task_id) REFERENCES task (task_id),
          FOREIGN KEY (assigned_to) REFERENCES user (user_id)
          );

-- Inbox
   CREATE TABLE IF NOT EXISTS inbox (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          project_id INTEGER,
          task_id INTEGER,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_read INTEGER DEFAULT 0,
          FOREIGN KEY (user_id) REFERENCES user (user_id),
          FOREIGN KEY (project_id) REFERENCES project (project_id),
          FOREIGN KEY (task_id) REFERENCES task (task_id)
          );