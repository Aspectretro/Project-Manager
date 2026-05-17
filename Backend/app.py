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

def login_required():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return None

#TODO: login authentication
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


@app.route("/event", methods=["POST"])
def event():
    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    tag = data.get("tag", "")
    due_date = data.get("due_date")

    if not title:
        return jsonify({"error": "A title is required"}), 400
    
    with get_db() as conn:
        conn.execute(
            "INSERT INTO task (title, content, tag, due_date) "
            "VALUES (?, ?, ?, ?)",
            (title, content, tag, due_date)
        )
    
    return jsonify({"message": "Task Created"}), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)