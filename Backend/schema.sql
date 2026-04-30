-- sql queries --

/*
  Begin Tables

  Age group would be defined by intervals, 
  and each would be labeled by alphabetical order
*/

CREATE TABLE IF NOT EXISTS user (
    user_id       INTEGER  PRIMARY KEY AUTOINCREMENT,
    email         TEXT     NOT NULL,
    username      TEXT     NOT NULL,
    password      CHAR(128) NOT NULL,
    profession    TEXT     NOT NULL,
    age_group     TEXT     NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project (
    member_id     INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER  NOT NULL,
    task_id       INTEGER  NOT NULL,
    title         TEXT     NOT NULL,
    detail        TEXT     NOT NULL,
    status      TEXT CHECK(status IN ('active', 'archived', 'completed')) DEFAULT 'active',
    due_date    DATE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (task_id) REFERENCES task(task_id)
);

CREATE TABLE IF NOT EXISTS task (
    task_id       INTEGER   PRIMARY KEY AUTOINCREMENT,
    title         TEXT      NOT NULL,
    content       TEXT      NOT NULL,
    project_id  INTEGER NOT NULL,
    status      TEXT CHECK(status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    priority    TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date    DATE,
    created_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (project_id) REFERENCES project(member_id),
    FOREIGN KEY (assignee_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS project_members (
    project_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    role        TEXT CHECK(role IN ('owner', 'editor', 'viewer')) DEFAULT 'viewer',
    joined_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES project(member_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);