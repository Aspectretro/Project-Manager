import sqlite3
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your-secret-key"
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

def get_db():
    conn = sqlite3.connect("user.db")
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

# Authentication
def login_required():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return None

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "All fields are required"}), 400
    
    hashed = generate_password_hash(password)

    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO user (email, password) VALUES (?, ?)",
                (email, hashed)
            )
        return jsonify({"message": "Account created!"}), 201
    
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM user WHERE email = ?", (email,)
        ).fetchone()
    
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Incorrect email or password"}), 401
    
    session["user_id"] = user["user_id"]
    return jsonify({"message": "Logged in!", "user_id": user["user_id"]}), 200

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out!"}), 200

@app.route("/me", methods=["GET"])
def me():
    auth_error = login_required()
    if auth_error:
        return auth_error
    
    with get_db() as conn:
        user = conn.execute(
            "SELECT user_id, email, created_at FROM user WHERE user_id = ?",
            (session["user_id"],)
        ).fetchone()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(dict(user)), 200

@app.route("/users/<int:user_id>", methods=["PATCH"])
def edit_profile(user_id):
    auth_error = login_required()
    if auth_error: return auth_error

    if session["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email and not password:
        return jsonify({"error": "At least one field is required"}), 400
    
    with get_db() as conn:
        if email:
            try:
                conn.execute(
                    "UPDATE user SET email = ? WHERE user_id = ?",
                    (email, user_id)
                )
            except sqlite3.IntegrityError:
                return jsonify({"error": "Email already exists"}), 409
        
        if password:
            hashed = generate_password_hash(password)
            conn.execute(
                "UPDATE user SET password = ? WHERE user_id = ?",
                (hashed, user_id)
            )
    
    return jsonify({"message": "Profile updated!"}), 200

# Task handling
@app.route("/event", methods=["POST"])
def event():
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    tag = data.get("tag", "")
    due_date = data.get("due_date")


    if not title:
        return jsonify({"error": "A title is required"}), 400
    
    with get_db() as conn:
        conn.execute(
            "INSERT INTO task (user_id, title, content, tag, due_date) "
            "VALUES (?, ?, ?, ?, ?)",
            (session["user_id"], title, content, tag, due_date)
        )
    
    return jsonify({"message": "Task Created"}), 201

@app.route("/tasks", methods=["GET"])
def get_tasks():
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        tasks = conn.execute(
            "SELECT * FROM task WHERE user_id = ?",
            (session["user_id"],)
        ).fetchall()

    return jsonify([dict(t) for t in tasks]), 200

@app.route("/tasks/<int:task_id>", methods=["PATCH"])
def edit_task(task_id):
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    tag = data.get("tag", "")
    due_date = data.get("due_date")

    with get_db() as conn:
        conn.execute(
            "UPDATE task SET title = ?, content = ?, tag = ?, due_date = ? "
            "WHERE task_id = ? AND user_id = ?",
            (title, content, tag, due_date, task_id, session["user_id"])
        )
    
    return jsonify({"message": "Task Updated"}), 200

@app.route("/tasks/<int:task_id>/resolve", methods=["DELETE"])
def resolve_task(task_id):
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        conn.execute(
            "DELETE FROM task WHERE task_id = ? AND user_id = ?",
            (task_id, session["user_id"])
        )
    
    return jsonify({"message": "Task Resolved"}), 200

# Tag Handling
@app.route("/tags", methods=["GET"])
def get_tags():
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        tags = conn.execute(
            "SELECT * FROM tag WHERE user_id =?",
            (session["user_id"],)
        ).fetchall()

    return jsonify([dict(t) for t in tags]), 200

@app.route("/tags", methods=["POST"])
def create_tag():
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    name = data.get("name", "").strip()

    if not name:
        return jsonify({"error": "Tag name is required"}), 400
    
    with get_db() as conn:
        conn.execute(
            "INSERT INTO tag (user_id, name) VALUES (?, ?)",
            (session["user_id"], name)
        )
    
    return jsonify({"message": "Tag Created"}), 201

@app.route("/tags/<int:tag_id>", methods=["PATCH"])
def edit_tag(tag_id):
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    name = data.get("name", "").strip()

    if not name:
        return jsonify({"error": "Tag name is required"}), 400

    with get_db() as conn:
        conn.execute(
            "UPDATE tag SET name = ? WHERE tag_id = ? AND user_id = ?",
            (name, tag_id, session["user_id"])
        )

    return jsonify({"message": "Tag Updated"}), 200

@app.route("/tags/<int:tag_id>", methods=["DELETE"])
def delete_tag(tag_id):
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        conn.execute(
            "DELETE FROM tag WHERE tag_id = ? AND user_id = ?",
            (tag_id, session["user_id"])
        )

    return jsonify({"message": "Tag Deleted"}), 200

# Project handling
@app.route("/projects", methods=["GET"])
def get_projects():
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        projects = conn.execute(
            "SELECT project.* FROM project "
            "JOIN project_member ON project.project_id = project_member.project_id "
            "WHERE project_member.user_id = ?",
            (session["user_id"],)
        ).fetchall()

    return jsonify([dict(p) for p in projects]), 200

@app.route("/projects", methods=["POST"])
def create_project():
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    name = data.get("name", "").strip()

    if not name:
        return jsonify({"error": "Project name is required"}), 400
    
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO project (user_id, name) VALUES (?, ?)",
            (session["user_id"], name)
        )

        project_id = cursor.lastrowid
        
        conn.execute(
            "INSERT INTO project_member (project_id, user_id, role) VALUES (?, ?, ?)",
            (project_id, session["user_id"])
        )
    
    return jsonify({"message": "Project Created"}), 201

@app.route("/projects/<int:project_id>/members", methods=["POST"])
def add_project_member(project_id):
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    email = data.get("email", "").strip()

    with get_db() as conn:
        # Check if requester is owner
        owner = conn.execute(
            "SELECT * FROM project_member WHERE project_id = ? AND user_id = ? AND role = 'owner'",
            (project_id, session["user_id"])
        ).fetchone()

        if not owner:
            return jsonify({"error": "Unauthorized"}), 403

        # Find user by email
        user = conn.execute(
            "SELECT user_id FROM user WHERE email = ?", (email,)
        ).fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        conn.execute(
            "INSERT INTO project_member (project_id, user_id, role) VALUES (?, ?, ?)",
            (project_id, user["user_id"], "member")
        )

    return jsonify({"message": "Member added"}), 201

@app.route("/projects/<int:project_id>/members/<int:user_id>", methods=["DELETE"])
def remove_project_member(project_id, user_id):
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        owner = conn.execute(
            "SELECT * FROM project_member WHERE project_id = ? AND user_id = ? AND role = 'owner'",
            (project_id, session["user_id"])
        ).fetchone()

        if not owner:
            return jsonify({"error": "Unauthorized"}), 403

        conn.execute(
            "DELETE FROM project_member WHERE project_id = ? AND user_id = ?",
            (project_id, user_id)
        )

    return jsonify({"message": "Member removed"}), 200

@app.route("/projects/<int:project_id>/tasks", methods=["POST"])
def assign_task(project_id):
    auth_error = login_required()
    if auth_error: return auth_error

    data = request.get_json()
    task_id = data.get("task_id")
    assigned_to = data.get("assigned_to")

    with get_db() as conn:
        conn.execute(
            "INSERT INTO project_task (project_id, task_id, assigned_to) VALUES (?, ?, ?)",
            (project_id, task_id, assigned_to)
        )

    return jsonify({"message": "Task assigned"}), 201

@app.route("/projects/<int:project_id>/tasks", methods=["GET"])
def get_project_tasks(project_id):
    auth_error = login_required()
    if auth_error: return auth_error

    with get_db() as conn:
        tasks = conn.execute(
            "SELECT task.*, project_task.assigned_to FROM task "
            "JOIN project_task ON task.task_id = project_task.task_id "
            "WHERE project_task.project_id = ?",
            (project_id,)
        ).fetchall()

    return jsonify([dict(t) for t in tasks]), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)