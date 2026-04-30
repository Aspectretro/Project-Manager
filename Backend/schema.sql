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
    age_group     TEXT     NOT NULL
);

CREATE TABLE IF NOT EXISTS project (
    member_id     INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER  NOT NULL,
    task_id       INTEGER  NOT NULL,
    title         TEXT     NOT NULL,
    detail        TEXT     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (task_id) REFERENCES task(task_id)
);

CREATE TABLE IF NOT EXISTS task (
    task_id       INTEGER   PRIMARY KEY AUTOINCREMENT,
    title         TEXT      NOT NULL,
    content       TEXT      NOT NULL,
    created_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS member (
    member_id     INTEGER  PRIMARY KEY AUTOINCREMENT,
    name          TEXT     NOT NULL,
    email         TEXT     NOT NULL
);